import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://unitybridgeke.org";

    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/explore", "/campaign/"],
                disallow: ["/admin", "/dashboard", "/api/", "/auth/"],
            },
        ],
        sitemap: `${appUrl}/sitemap.xml`,
    };
}
