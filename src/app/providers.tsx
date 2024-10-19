"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from '../context/authContext.js'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    
    <AuthProvider>

      <SessionProvider>

        <ThemeProvider attribute="class" enableSystem={false} defaultTheme="dark">
          {children}
        </ThemeProvider>

      </SessionProvider>

    </AuthProvider>


  );
}
