import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-light dark:bg-neutral-dark px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-secondary dark:text-white mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
                    Page Not Found
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-primary text-secondary font-semibold rounded-lg hover:bg-yellow-500 transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
