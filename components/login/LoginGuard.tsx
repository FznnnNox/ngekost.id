"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    supabase.auth.getSession().then(({ data }) => {
      if (cancelled) return;

      if (data.session) {
        // Sudah login, jangan tampilkan halaman login
        router.replace("/");
      } else {
        setChecking(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [router]);

  // Tahan tampilan dulu supaya form login tidak sempat berkedip
  if (checking) {
    return <div className="min-h-screen bg-white" />;
  }

  return <>{children}</>;
}