import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import Script from "next/script"
import "./globals.css"
import { AuthGuard } from "@/components/auth-guard"
import { BalanceProvider } from "@/lib/context/BalanceContext"
import { OrdersProvider } from "@/lib/context/OrdersContext"
import { ThemeProvider } from "@/components/theme-provider"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CryptoSphere Trade",
  description: "CryptoSphere Trade – seamless crypto trading dashboard",
  generator: "cryptosphere-trade",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="ocean">
          <AuthGuard>
            <OrdersProvider>
              <BalanceProvider>{children}</BalanceProvider>
            </OrdersProvider>
          </AuthGuard>
        </ThemeProvider>
        <Analytics />
        <Script id="tawk-chat-widget" strategy="afterInteractive">
          {`
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
  var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
  s1.async=true;
  s1.src="https://embed.tawk.to/6917ad81a373f9195a3a1d59/1ja27rgqf";
  s1.charset="UTF-8";
  s1.setAttribute("crossorigin","*");
  s0.parentNode.insertBefore(s1,s0);
})();
          `}
        </Script>
      </body>
    </html>
  )
}
