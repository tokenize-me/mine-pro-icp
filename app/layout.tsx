import type { Metadata } from "next";
import { Arimo } from "next/font/google";
import "./globals.css";
import { Providers } from "./provider";
import { Toaster } from "sonner";
import Nav from "@/components/navigation";
import Footer from "@/components/footer";
import Image from "next/image";
import config from "@/config";
import { GoogleTagManager } from "@next/third-parties/google";

const arimo = Arimo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: config.siteTitle,
  description: config.siteDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${arimo.className}`}>
        <Providers>
          {config.displayOptions?.showBackgroundImage &&
            config.backgroundImagePath && (
              <div
                className={`-z-10 fixed h-screen w-screen top-0 left-0 opacity-${config.backgroundImageOpacity}`}
              >
                <Image
                  src={config.backgroundImagePath}
                  alt="background image"
                  fill
                  objectFit="cover"
                  quality={100}
                  priority
                />
              </div>
            )}
          <div className="heroSectionBG"></div> {/* top radial gradient */}
          <div className="flex  justify-center w-full">
            <Nav />
          </div>
          {children}
          <Footer />
          <GoogleTagManager gtmId="GTM-KJFH5TG2" />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
