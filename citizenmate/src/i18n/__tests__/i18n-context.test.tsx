import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { I18nProvider, useT } from "../i18n-context";

// Regression guard for the SSR raw-keys bug: with initialDictionary seeded,
// t() must resolve on the very first render (server HTML and hydration)
// instead of falling back to the raw dictionary key until useEffect runs.

function Probe() {
  const { t, loading } = useT();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="value">{t("landing.hero_title")}</span>
      <span data-testid="missing">{t("landing.not_a_real_key", "fallback-text")}</span>
    </div>
  );
}

const dict = {
  landing: {
    hero_title: "Pass your Australian Citizenship Test — guaranteed.",
  },
};

describe("I18nProvider initialDictionary seeding", () => {
  it("resolves keys and reports loaded on first render when seeded", () => {
    render(
      <I18nProvider locale="en" initialDictionary={dict}>
        <Probe />
      </I18nProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("false");
    expect(screen.getByTestId("value")).toHaveTextContent(
      "Pass your Australian Citizenship Test — guaranteed."
    );
  });

  it("uses the provided fallback for missing keys without rendering the raw key", () => {
    render(
      <I18nProvider locale="en" initialDictionary={dict}>
        <Probe />
      </I18nProvider>
    );

    expect(screen.getByTestId("missing")).toHaveTextContent("fallback-text");
    expect(screen.queryByText("landing.not_a_real_key")).toBeNull();
  });

  it("does not re-render with raw keys after mounting (no flash)", () => {
    render(
      <I18nProvider locale="en" initialDictionary={dict}>
        <Probe />
      </I18nProvider>
    );
    act(() => {});
    expect(screen.getByTestId("value")).toHaveTextContent(
      "Pass your Australian Citizenship Test — guaranteed."
    );
  });
});
