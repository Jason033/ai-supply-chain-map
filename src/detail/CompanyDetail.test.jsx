import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CompanyDetail } from "./CompanyDetail";

const node = {
  title: "台積電",
  ticker: "TSM",
  status: "wait_for_price",
  updated_at: "2026-05-09",
  data_as_of: "2026-Q1",
  body_html: "<h2>一句話買入假設</h2><p>Sample thesis.</p>",
  scores: {
    industry_benefit: { value: 5, label: "high", reason: "AI demand flows directly into advanced process demand." },
    financial_conversion: { value: 5, label: "high", reason: "Orders can become revenue and margin." },
    valuation_setup: { value: 2, label: "stretched", reason: "Market already reflects strong growth." },
    expectation_gap: { value: 3, label: "medium", reason: "More upside requires stronger evidence." }
  },
  sources: [{ title: "TSMC IR", url: "https://investor.tsmc.com/english" }]
};

describe("CompanyDetail", () => {
  it("renders buyability status and scores", () => {
    render(<CompanyDetail node={node} model={null} archives={[]} />);
    expect(screen.getAllByText("等價格")).toHaveLength(2);
    expect(screen.getByText("這頁要回答什麼")).toBeInTheDocument();
    expect(screen.getByText("目前結論")).toBeInTheDocument();
    expect(screen.getByText("產業受惠強度")).toBeInTheDocument();
    expect(screen.getAllByText("5/5")).toHaveLength(2);
    expect(screen.getByText("TSMC IR")).toBeInTheDocument();
  });
});
