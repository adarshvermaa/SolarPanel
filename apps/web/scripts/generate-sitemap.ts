import fs from "fs";
import path from "path";

const SITE_URL = "https://solargov-cg.example";

const STATIC_ROUTES = [
    "",
    "/schemes",
    "/apply",
    "/track",
    "/blog",
    "/contact",
    "/calculator",
    "/faq",
];

// Mock fetching dynamic routes (e.g. from API or DB)
const DYNAMIC_ROUTES = [
    "/schemes/pm-surya-ghar",
    "/schemes/kusum-component-a",
    "/schemes/rooftop-phase-ii",
];

function generateSitemap() {
    const routes = [...STATIC_ROUTES, ...DYNAMIC_ROUTES];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
            .map((route) => {
                return `
  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`;
            })
            .join("")}
</urlset>`;

    const publicDir = path.join(process.cwd(), "public");
    fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap);
    console.log("✅ sitemap.xml generated!");
}

generateSitemap();
