import Link from "next/link";
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function Footer() {
    return (
        <footer className="bg-zinc-900 text-zinc-300">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
                <div className="grid grid-cols-1 gap-8 rounded-2xl bg-zinc-800/50 p-8 sm:grid-cols-2 lg:grid-cols-4 lg:p-12">
                    {/* Brand & Newsletter */}
                    <div className="col-span-1 space-y-8 sm:col-span-2 lg:col-span-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white">Ecommerce AI</span>
                        </div>
                        <p className="text-sm leading-6 text-zinc-400">
                            Premium furniture for your modern lifestyle. Experience the future of shopping with our AI-powered platform.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com/DavidNart90"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white"
                            >
                                <Github className="h-6 w-6" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/david-nartey-bb9722179"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-400 hover:text-white"
                            >
                                <Linkedin className="h-6 w-6" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-white">Shop</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="/?category=all" className="text-sm leading-6 hover:text-white">
                                    All Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm leading-6 hover:text-white">
                                    New Arrivals
                                </Link>
                            </li>
                            <li>
                                <Link href="/" className="text-sm leading-6 hover:text-white">
                                    Featured
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li>
                                <Link href="#" className="text-sm leading-6 hover:text-white">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 hover:text-white">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 hover:text-white">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm leading-6 hover:text-white">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-sm font-semibold leading-6 text-white">Contact</h3>
                        <ul role="list" className="mt-6 space-y-4">
                            <li className="flex items-center gap-2 text-sm leading-6">
                                <Phone className="h-4 w-4 shrink-0 text-zinc-500" />
                                <span>+233 55 168 7501</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm leading-6">
                                <Mail className="h-4 w-4 shrink-0 text-zinc-500" />
                                <span>davidnart90@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm leading-6">
                                <MapPin className="h-4 w-4 shrink-0 text-zinc-500" />
                                <span>Accra, Ghana</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-zinc-800 pt-8 text-sm text-zinc-500">
                    <p className="mb-4">
                        This is a product of David Nartey.
                    </p>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <p>&copy; {new Date().getFullYear()} Ecommerce AI. All rights reserved.</p>
                        <a href="https://david-nart-portfolio.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                            Visit Developer Portfolio &rarr;
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
