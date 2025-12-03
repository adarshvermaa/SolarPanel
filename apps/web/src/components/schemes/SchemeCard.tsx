import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Calendar, Users, Zap } from "lucide-react";

export interface Scheme {
    id: string;
    title: string;
    description: string;
    benefit: string;
    target: string;
    deadline: string;
    imageUrl: string;
    slug: string;
}

interface SchemeCardProps {
    scheme: Scheme;
}

export default function SchemeCard({ scheme }: SchemeCardProps) {
    return (
        <div className="group flex flex-col rounded-xl border border-neutral-200 bg-white overflow-hidden transition-all hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={scheme.imageUrl}
                    alt={scheme.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 right-4 bg-primary text-secondary text-xs font-bold px-3 py-1 rounded-full">
                    Active
                </div>
            </div>

            <div className="flex flex-col flex-grow p-6">
                <h3 className="text-xl font-bold text-secondary dark:text-white mb-2 line-clamp-2">
                    {scheme.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {scheme.description}
                </p>

                <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="font-medium">Benefit:</span> {scheme.benefit}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">Target:</span> {scheme.target}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">Valid till:</span> {scheme.deadline}
                    </div>
                </div>

                <Link
                    href={`/schemes/${scheme.id}`}
                    className="mt-auto inline-flex items-center justify-center w-full px-4 py-2.5 text-sm font-semibold text-secondary bg-neutral-100 rounded-lg hover:bg-primary hover:text-secondary transition-colors dark:bg-neutral-800 dark:text-white dark:hover:bg-primary dark:hover:text-secondary"
                >
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
