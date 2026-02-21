import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Care Bridge Kenya - Building Bridges of Hope",
    description: "Lifting burdens, building futures. Raise funds for school fees, medical bills, and urgent needs through transparent crowdfunding.",
    keywords: ["crowdfunding", "Kenya", "fundraising", "medical bills", "school fees", "M-Pesa", "donations"],
    authors: [{ name: "Care Bridge Kenya" }],
    openGraph: {
        title: "Care Bridge Kenya - Building Bridges of Hope",
        description: "Lifting burdens, building futures",
        type: "website",
        locale: "en_KE",
    },
};

import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/auth-context";
import { CampaignProvider } from "@/context/campaign-context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="antialiased">
                <ThemeProvider>
                    <AuthProvider>
                        <CampaignProvider>
                            {children}
                        </CampaignProvider>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

