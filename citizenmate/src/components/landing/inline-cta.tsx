"use client";

import { useLocalizedPath } from "@/lib/use-localized-path";
import { Button } from "@/components/ui/button";
import { useT } from "@/i18n/i18n-context";

export function InlineCTA() {
  const { getUrl } = useLocalizedPath();
  const { t } = useT();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-[1140px] px-4 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-3">
          {t("landing.inline_cta_title")}
        </h2>
        <p className="text-foreground/70 mb-6">
          {t("landing.inline_cta_desc")}
        </p>
        <Button render={<a href={getUrl("/practice")} />}>
          {t("landing.inline_cta_button")}
        </Button>
      </div>
    </section>
  );
}
