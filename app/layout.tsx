import { ToastProvider } from "@/components/ui/toast"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <body>
      <ToastProvider>
        {children}
        <Toaster />
      </ToastProvider>
      </body>
      </html>
  )
}


