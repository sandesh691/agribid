import "@/styles/globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { LanguageProvider } from "@/lib/language-context";
import { ToastProvider } from "@/lib/toast-context";
import { ModalProvider } from "@/lib/modal-context";

export const metadata: Metadata = {
    title: "AgriBid | Direct Farm-to-Retailer Marketplace",
    description: "A transparent digital agricultural marketplace connecting farmers directly with retailers.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>
                <LanguageProvider>
                    <ToastProvider>
                        <ModalProvider>
                            <main>{children}</main>
                        </ModalProvider>
                    </ToastProvider>
                </LanguageProvider>
            </body>
        </html>
    );
}
