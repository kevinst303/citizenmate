"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export function AuthRedirectHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    if (searchParams?.get("auth") === "required") {
      openAuthModal();
      
      // Clean up the URL so a reload doesn't trigger the modal again
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("auth");
      
      const newQuery = newParams.toString() ? `?${newParams.toString()}` : "";
      router.replace(`${pathname}${newQuery}`, { scroll: false });
    }
  }, [searchParams, openAuthModal, router, pathname]);

  return null;
}
