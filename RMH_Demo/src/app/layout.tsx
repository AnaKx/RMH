import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/globals.css";
import { WizardProvider } from '@/lib/context';

export const metadata: Metadata = {
  title: "RoleModel Hub",
  description: "Mentor Onboarding Demo",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><WizardProvider>{children}</WizardProvider></body>
    </html>
  );
}