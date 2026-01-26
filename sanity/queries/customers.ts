import { defineQuery } from "next-sanity";

export const CUSTOMER_BY_EMAIL_QUERY = defineQuery(`*[
  _type == "customer"
  && email == $email
][0]{
  _id,
  email,
  name,
  clerkUserId,
  stripeCustomerId,
  createdAt
}`);

export const CUSTOMER_BY_STRIPE_ID_QUERY = defineQuery(`*[
  _type == "customer"
  && stripeCustomerId == $stripeCustomerId
][0]{
  _id,
  email,
  name,
  clerkUserId,
  stripeCustomerId,
  createdAt
}`);

/**
 * Get customers with their performance metrics
 * Includes total orders, total spent, and last order date
 */
export const CUSTOMERS_WITH_STATS_QUERY = defineQuery(`*[_type == "customer"] {
  _id,
  email,
  name,
  stripeCustomerId,
  createdAt,
  "orderCount": count(*[_type == "order" && references(^._id)]),
  "totalSpent": math::sum(*[_type == "order" && references(^._id) && status in ["paid", "shipped", "delivered"]].total),
  "lastOrderDate": *[_type == "order" && references(^._id)] | order(createdAt desc)[0].createdAt
}`);
