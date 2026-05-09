const templates = {
  advanced_packaging_capacity: {
    segment: (i) => i.ai_accelerator_spend * i.foundry_and_packaging_share,
    company: (i) => i.ai_accelerator_spend * i.foundry_and_packaging_share * i.company_share,
  },
  liquid_cooling_penetration: {
    segment: (i) => i.ai_server_units * i.liquid_cooling_penetration * i.value_per_server,
    company: (i) => i.ai_server_units * i.liquid_cooling_penetration * i.value_per_server * i.company_share,
  },
  software_usage_or_seat: {
    segment: (i) => i.users * i.penetration_rate * i.arpu,
    company: (i) => i.users * i.penetration_rate * i.arpu * i.company_share,
  },
  custom_steps: {
    segment: (i) => i.source_demand * i.segment_share,
    company: (i) => i.source_demand * i.segment_share * i.company_share,
  },
};

const classifyImpact = (ratio) => {
  if (ratio >= 0.08) return "major";
  if (ratio >= 0.03) return "medium";
  return "small";
};

export const calculateDemandModel = (model, scenarioKey = "base", overrides = {}) => {
  const scenario = model.scenarios?.[scenarioKey];
  if (!scenario) throw new Error(`Unknown scenario: ${scenarioKey}`);
  const inputs = { ...scenario.inputs, ...overrides };
  const formula = templates[model.template] || templates.custom_steps;
  const companyRevenue = inputs.company_revenue;
  if (typeof companyRevenue !== "number" || companyRevenue <= 0) {
    throw new Error("company_revenue must be a positive number");
  }
  const segmentDemand = formula.segment(inputs);
  const companyDemand = formula.company(inputs);
  const revenueImpactRatio = companyDemand / companyRevenue;
  return {
    scenarioKey,
    inputs,
    segmentDemand,
    companyDemand,
    companyRevenue,
    revenueImpactRatio,
    impactLevel: classifyImpact(revenueImpactRatio),
  };
};

export const formatImpactLabel = (impactLevel) =>
  ({
    small: "小影響",
    medium: "中等影響",
    major: "重大影響",
  })[impactLevel] || "未分類";
