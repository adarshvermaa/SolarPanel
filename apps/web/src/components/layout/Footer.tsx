import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-dark text-neutral-light pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-secondary font-bold">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                                    <circle cx="12" cy="12" r="5" />
                                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                SolarGov <span className="text-primary">CG</span>
                            </span>
                        </div>
                        <p className="text-neutral-400 text-sm mb-4">
                            Empowering Chhattisgarh with sustainable solar energy solutions.
                            Simplifying government schemes for every household and business.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" aria-label="Twitter" className="text-neutral-400 hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" aria-label="LinkedIn" className="text-neutral-400 hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-neutral-400 hover:text-primary text-sm transition-colors">Home</Link></li>
                            <li><Link href="/schemes" className="text-neutral-400 hover:text-primary text-sm transition-colors">Browse Schemes</Link></li>
                            <li><Link href="/apply" className="text-neutral-400 hover:text-primary text-sm transition-colors">Apply Online</Link></li>
                            <li><Link href="/track" className="text-neutral-400 hover:text-primary text-sm transition-colors">Track Application</Link></li>
                            <li><Link href="/installers" className="text-neutral-400 hover:text-primary text-sm transition-colors">Find Installers</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Resources</h3>
                        <ul className="space-y-2">
                            <li><Link href="/blog" className="text-neutral-400 hover:text-primary text-sm transition-colors">Blog & News</Link></li>
                            <li><Link href="/faq" className="text-neutral-400 hover:text-primary text-sm transition-colors">FAQs</Link></li>
                            <li><Link href="/calculator" className="text-neutral-400 hover:text-primary text-sm transition-colors">Solar Calculator</Link></li>
                            <li><Link href="/policy" className="text-neutral-400 hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="text-neutral-400 hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-neutral-400 text-sm">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>Raipur, Chhattisgarh, India - 492001</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400 text-sm">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>+91 1800-123-4567 (Helpline)</span>
                            </li>
                            <li className="flex items-center gap-3 text-neutral-400 text-sm">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>support@solargov-cg.example</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-neutral-500 text-sm text-center md:text-left">
                        &copy; {new Date().getFullYear()} SolarGov CG. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <button className="text-neutral-400 hover:text-white text-sm font-medium">English</button>
                        <span className="text-neutral-700">|</span>
                        <button className="text-neutral-400 hover:text-white text-sm font-medium">हिन्दी</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
