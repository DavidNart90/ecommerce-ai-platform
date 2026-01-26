import { generateText, gateway } from "ai";
import { client } from "@/sanity/lib/client";
import {
  ORDERS_LAST_7_DAYS_QUERY,
  ORDER_STATUS_DISTRIBUTION_QUERY,
  TOP_SELLING_PRODUCTS_QUERY,
  PRODUCTS_INVENTORY_QUERY,
  UNFULFILLED_ORDERS_QUERY,
  REVENUE_BY_PERIOD_QUERY,
} from "@/sanity/queries/stats";

// ============================================
// Types
// ============================================

interface OrderItem {
  quantity: number;
  priceAtPurchase: number;
  productName: string;
  productId: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  itemCount: number;
  items: OrderItem[];
}

interface StatusDistribution {
  paid: number;
  shipped: number;
  delivered: number;
  cancelled: number;
}

interface ProductSale {
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
}

interface UnfulfilledOrder {
  _id: string;
  orderNumber: string;
  total: number;
  createdAt: string;
  email: string;
  itemCount: number;
}

interface RevenuePeriod {
  currentPeriod: number;
  previousPeriod: number;
  currentOrderCount: number;
  previousOrderCount: number;
}

interface Insights {
  salesTrends: {
    summary: string;
    highlights: string[];
    trend: "up" | "down" | "stable";
  };
  inventory: {
    summary: string;
    alerts: string[];
    recommendations: string[];
  };
  actionItems: {
    urgent: string[];
    recommended: string[];
    opportunities: string[];
  };
}

interface RawMetrics {
  currentRevenue: number;
  previousRevenue: number;
  revenueChange: string;
  orderCount: number;
  avgOrderValue: string;
  unfulfilledCount: number;
  lowStockCount: number;
}

interface CachedResponse {
  dataHash: string;
  insights: Insights;
  rawMetrics: RawMetrics;
  generatedAt: string;
  cachedAt: number; // timestamp for TTL check
}

// ============================================
// Cache Configuration
// ============================================

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour max cache age

// In-memory cache (persists across requests until cold start/deploy)
let insightsCache: CachedResponse | null = null;

/**
 * Generate a simple hash from an object for cache comparison
 * Uses JSON stringification + basic string hashing
 */
function hashObject(obj: unknown): string {
  const str = JSON.stringify(obj);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Check if cache is valid (exists, hash matches, and not expired)
 */
function isCacheValid(currentHash: string): boolean {
  if (!insightsCache) return false;

  const now = Date.now();
  const cacheAge = now - insightsCache.cachedAt;

  // Cache is invalid if expired OR hash doesn't match
  if (cacheAge > CACHE_TTL_MS) {
    console.log("[Insights Cache] Cache expired (age: " + Math.round(cacheAge / 1000 / 60) + " min)");
    return false;
  }

  if (insightsCache.dataHash !== currentHash) {
    console.log("[Insights Cache] Data changed, cache invalidated");
    return false;
  }

  console.log("[Insights Cache] Cache HIT (age: " + Math.round(cacheAge / 1000 / 60) + " min)");
  return true;
}

// ============================================
// API Route Handler
// ============================================

export async function GET() {
  try {
    // Calculate date ranges
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Use fresh client (bypass CDN) to get real-time data for admin insights
    const freshClient = client.withConfig({ useCdn: false });

    // Fetch all analytics data in parallel
    const [
      recentOrders,
      statusDistribution,
      productSales,
      productsInventory,
      unfulfilledOrders,
      revenuePeriod,
    ] = await Promise.all([
      freshClient.fetch<Order[]>(ORDERS_LAST_7_DAYS_QUERY, {
        startDate: sevenDaysAgo.toISOString(),
      }),
      freshClient.fetch<StatusDistribution>(ORDER_STATUS_DISTRIBUTION_QUERY),
      freshClient.fetch<ProductSale[]>(TOP_SELLING_PRODUCTS_QUERY),
      freshClient.fetch<Product[]>(PRODUCTS_INVENTORY_QUERY),
      freshClient.fetch<UnfulfilledOrder[]>(UNFULFILLED_ORDERS_QUERY),
      freshClient.fetch<RevenuePeriod>(REVENUE_BY_PERIOD_QUERY, {
        currentStart: sevenDaysAgo.toISOString(),
        previousStart: fourteenDaysAgo.toISOString(),
      }),
    ]);

    // Aggregate top selling products
    const productSalesMap = new Map<
      string,
      { name: string; totalQuantity: number; revenue: number }
    >();

    for (const sale of productSales) {
      if (!sale.productId) continue;
      const existing = productSalesMap.get(sale.productId);
      if (existing) {
        existing.totalQuantity += sale.quantity;
        existing.revenue += sale.quantity * (sale.productPrice || 0);
      } else {
        productSalesMap.set(sale.productId, {
          name: sale.productName || "Unknown",
          totalQuantity: sale.quantity,
          revenue: sale.quantity * (sale.productPrice || 0),
        });
      }
    }

    const topProducts = Array.from(productSalesMap.entries())
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Find products needing restock (low stock but high sales)
    const productSalesById = new Map(
      Array.from(productSalesMap.entries()).map(([id, data]) => [
        id,
        data.totalQuantity,
      ])
    );

    const needsRestock = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock <= 5 && salesQty > 0;
      })
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    // Slow moving inventory (in stock but no sales)
    const slowMoving = productsInventory
      .filter((p) => {
        const salesQty = productSalesById.get(p._id) || 0;
        return p.stock > 10 && salesQty === 0;
      })
      .slice(0, 5);

    // Helper to calculate days since order
    const getDaysSinceOrder = (createdAt: string) => {
      const orderDate = new Date(createdAt);
      const diffTime = now.getTime() - orderDate.getTime();
      return Math.floor(diffTime / (1000 * 60 * 60 * 24));
    };

    // Calculate metrics
    const currentRevenue = revenuePeriod.currentPeriod || 0;
    const previousRevenue = revenuePeriod.previousPeriod || 0;
    const revenueChange =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
          ? 100
          : 0;

    const avgOrderValue =
      recentOrders.length > 0
        ? recentOrders.reduce((sum, o) => sum + (o.total || 0), 0) /
          recentOrders.length
        : 0;

    // Prepare data summary for AI (and for hashing)
    const dataSummary = {
      salesTrends: {
        currentWeekRevenue: currentRevenue,
        previousWeekRevenue: previousRevenue,
        revenueChangePercent: revenueChange.toFixed(1),
        currentWeekOrders: revenuePeriod.currentOrderCount || 0,
        previousWeekOrders: revenuePeriod.previousOrderCount || 0,
        avgOrderValue: avgOrderValue.toFixed(2),
        topProducts: topProducts.map((p) => ({
          name: p.name,
          unitsSold: p.totalQuantity,
          revenue: p.revenue.toFixed(2),
        })),
      },
      inventory: {
        outOfStock: productsInventory
          .filter((p) => p.stock === 0)
          .map((p) => ({
            name: p.name,
            category: p.category,
          })),
        lowStock: productsInventory
          .filter((p) => p.stock > 0 && p.stock <= 5)
          .map((p) => ({
            name: p.name,
            stock: p.stock,
            category: p.category,
          })),
        needsRestock: needsRestock.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        slowMoving: slowMoving.map((p) => ({
          name: p.name,
          stock: p.stock,
          category: p.category,
        })),
        totalProducts: productsInventory.length,
        outOfStockCount: productsInventory.filter((p) => p.stock === 0).length,
        lowStockCount: productsInventory.filter((p) => p.stock > 0 && p.stock <= 5).length,
      },
      operations: {
        statusDistribution,
        unfulfilledOrders: unfulfilledOrders.map((o) => ({
          orderNumber: o.orderNumber,
          total: o.total,
          daysSinceOrder: getDaysSinceOrder(o.createdAt),
          itemCount: o.itemCount,
        })),
        urgentOrders: unfulfilledOrders.filter(
          (o) => getDaysSinceOrder(o.createdAt) > 2
        ).length,
      },
    };

    // Calculate raw metrics (needed for response regardless of cache)
    const rawMetrics: RawMetrics = {
      currentRevenue,
      previousRevenue,
      revenueChange: revenueChange.toFixed(1),
      orderCount: revenuePeriod.currentOrderCount || 0,
      avgOrderValue: avgOrderValue.toFixed(2),
      unfulfilledCount: unfulfilledOrders.length,
      lowStockCount: productsInventory.filter((p) => p.stock <= 5).length,
    };

    // ============================================
    // Cache Check - Return cached if valid
    // ============================================
    const dataHash = hashObject(dataSummary);

    if (isCacheValid(dataHash)) {
      // Return cached insights with fresh rawMetrics
      return Response.json({
        success: true,
        insights: insightsCache!.insights,
        rawMetrics, // Always return fresh metrics
        generatedAt: insightsCache!.generatedAt,
        cached: true, // Flag to indicate this was cached
      });
    }

    // ============================================
    // Generate AI Insights (cache miss)
    // ============================================
    console.log("[Insights Cache] Cache MISS - calling AI");

    const { text } = await generateText({
      model: gateway("anthropic/claude-3-5-haiku-latest"),
      system: `You are an expert e-commerce analytics assistant. Analyze the provided store data and generate actionable insights for the store admin.

Your response must be valid JSON with this exact structure:
{
  "salesTrends": {
    "summary": "2-3 sentence summary of sales performance",
    "highlights": ["highlight 1", "highlight 2", "highlight 3"],
    "trend": "up" | "down" | "stable"
  },
  "inventory": {
    "summary": "2-3 sentence summary of inventory status",
    "alerts": ["alert 1", "alert 2"],
    "recommendations": ["recommendation 1", "recommendation 2"]
  },
  "actionItems": {
    "urgent": ["urgent action 1", "urgent action 2"],
    "recommended": ["recommended action 1", "recommended action 2"],
    "opportunities": ["opportunity 1", "opportunity 2"]
  }
}

Guidelines:
- Be specific with numbers and product names
- Prioritize actionable insights
- Keep highlights, alerts, and recommendations concise (under 100 characters each)
- Focus on what the admin can do TODAY
- Use £ for currency
- IMPORTANT: When mentioning orders that need to be processed or shipped, ALWAYS include the order number, ALL ORDERS THAT NEEDS TO BE PROCESSED OR SHIPPED SHOULD BE LISTED IN THE URGENT ACTION ITEMS SECTION.
- List specific order numbers in urgent action items so the admin can take immediate action
- IF ALL ORDERS ARE FULFILLED, LIST "ALL ORDERS ARE FULFILLED" IN THE URGENT ACTION ITEMS SECTION. WITH THE TOTAL NUMBER OF ORDERS THAT ARE FULFILLED with a green checkmark icon and no other urgent action items.
- INVENTORY ALERTS: In the inventory.alerts array:
  1. FIRST list ALL out-of-stock products (stock = 0) as URGENT with product name (e.g., "OUT OF STOCK: Modern Coffee Table")
  2. THEN list up to 4 low-stock products (stock 1-5) as warnings with product name and stock count (e.g., "Low stock: Velvet Sofa (2 left)")`,
      prompt: `Analyze this e-commerce store data and provide insights:

${JSON.stringify(dataSummary, null, 2)}

Generate insights in the required JSON format.`,
    });

    // Parse AI response
    let insights: Insights;
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        insights = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch {
      // Fallback insights if parsing fails
      insights = {
        salesTrends: {
          summary: `Revenue this week: £${currentRevenue.toFixed(2)} (${revenueChange > 0 ? "+" : ""}${revenueChange.toFixed(1)}% vs last week)`,
          highlights: [
            `${revenuePeriod.currentOrderCount || 0} orders this week`,
            `Average order value: £${avgOrderValue.toFixed(2)}`,
            topProducts[0]
              ? `Top seller: ${topProducts[0].name}`
              : "No sales data yet",
          ],
          trend:
            revenueChange > 5 ? "up" : revenueChange < -5 ? "down" : "stable",
        },
        inventory: {
          summary: `${needsRestock.length} products need restocking. ${slowMoving.length} products have no recent sales.`,
          alerts: needsRestock
            .slice(0, 2)
            .map((p) => `${p.name} has only ${p.stock} left`),
          recommendations: [
            "Review low stock items before the weekend",
            "Consider promotions for slow-moving inventory",
          ],
        },
        actionItems: {
          urgent:
            unfulfilledOrders.length > 0
              ? [`Ship ${unfulfilledOrders.length} pending orders`]
              : ["All orders fulfilled!"],
          recommended: ["Review inventory levels", "Check product listings"],
          opportunities: ["Featured products drive more sales"],
        },
      };
    }

    const generatedAt = new Date().toISOString();

    // ============================================
    // Update Cache
    // ============================================
    insightsCache = {
      dataHash,
      insights,
      rawMetrics,
      generatedAt,
      cachedAt: Date.now(),
    };
    console.log("[Insights Cache] Cache updated with new insights");

    return Response.json({
      success: true,
      insights,
      rawMetrics,
      generatedAt,
      cached: false, // Flag to indicate this was freshly generated
    });
  } catch (error) {
    console.error("Failed to generate insights:", error);
    return Response.json(
      {
        success: false,
        error: "Failed to generate insights",
      },
      { status: 500 }
    );
  }
}
