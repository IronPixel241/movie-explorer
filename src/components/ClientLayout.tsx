'use client';

import AuthProvider from "@/app/providers/AuthProvider";
import QueryProvider from "@/app/providers/QueryProvider";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "./Navbar";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
} 