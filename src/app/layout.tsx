import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Reachmark PM Tool",
  description: "ClickUp-like project management tool"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
