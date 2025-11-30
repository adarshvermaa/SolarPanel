import React from 'react';

export function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">SolarPanel Platform</h3>
                        <p className="text-gray-400 text-sm">
                            Empowering India with renewable energy through government schemes and subsidies.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/schemes" className="hover:text-white">Schemes</a></li>
                            <li><a href="/blog" className="hover:text-white">Blog</a></li>
                            <li><a href="/contact" className="hover:text-white">Contact Us</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact</h3>
                        <p className="text-gray-400 text-sm">
                            Email: support@solarpanel.com<br />
                            Phone: +91 1800-123-4567
                        </p>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} SolarPanel Platform. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
