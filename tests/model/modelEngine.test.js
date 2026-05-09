import { describe, expect, it } from "vitest";
import { calculateDemandModel, formatImpactLabel } from "../../src/model/modelEngine";

const model = {
  template: "advanced_packaging_capacity",
  scenarios: {
    base: {
      inputs: {
        ai_accelerator_spend: 70000000000,
        foundry_and_packaging_share: 0.22,
        company_share: 0.6,
        company_revenue: 85000000000
      }
    }
  }
};

describe("calculateDemandModel", () => {
  it("calculates demand bridge impact", () => {
    const result = calculateDemandModel(model, "base");
    expect(result.segmentDemand).toBe(15400000000);
    expect(result.companyDemand).toBe(9240000000);
    expect(result.revenueImpactRatio).toBeCloseTo(0.1087, 4);
    expect(result.impactLevel).toBe("major");
  });

  it("formats impact labels", () => {
    expect(formatImpactLabel("small")).toBe("小影響");
    expect(formatImpactLabel("medium")).toBe("中等影響");
    expect(formatImpactLabel("major")).toBe("重大影響");
  });
});
