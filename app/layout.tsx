import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nghịch Thủy Hàn",
  description: "Công cụ xây dựng đội hình bang chiến",
  icons: {
    icon: [{ url: "/favicon.ico" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              if (localStorage.getItem('theme') === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            } catch (_) {}
          `,
          }}
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
