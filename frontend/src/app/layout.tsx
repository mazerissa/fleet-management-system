import "./globals.css";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";


export const metadata = {
  title: "Fleet Management",
  description: "Company vehicle management platform",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">

      <body className="bg-slate-100 text-slate-900">

        <div className="flex min-h-screen">

          <Sidebar />

          <div className="flex flex-1 flex-col">

            <Navbar />

            <main className="flex-1 p-8">
              {children}
            </main>

          </div>

        </div>

      </body>

    </html>
  );
}