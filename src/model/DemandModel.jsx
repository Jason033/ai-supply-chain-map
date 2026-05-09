import { useMemo, useState } from "react";
import { calculateDemandModel, formatImpactLabel } from "./modelEngine";

const formatValue = (value, format) => {
  if (format === "percent") return `${(value * 100).toFixed(1)}%`;
  if (format === "currency") {
    return new Intl.NumberFormat("zh-TW", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);
  }
  return new Intl.NumberFormat("zh-TW").format(value);
};

export function DemandModel({ model }) {
  const [scenarioKey, setScenarioKey] = useState("base");
  const [overrides, setOverrides] = useState({});
  const result = useMemo(() => calculateDemandModel(model, scenarioKey, overrides), [model, scenarioKey, overrides]);
  const scenario = model.scenarios[scenarioKey];

  return (
    <section className="demand-model">
      <header>
        <p className="eyebrow">Demand Bridge / {model.template}</p>
        <h2>需求傳導模型</h2>
        <p className="meta-line">資料日期：{model.data_as_of} / 可信度：{model.confidence}</p>
      </header>
      <div className="scenario-tabs" role="tablist" aria-label="情境選擇">
        {Object.entries(model.scenarios).map(([key, item]) => (
          <button key={key} type="button" className={key === scenarioKey ? "active" : ""} onClick={() => setScenarioKey(key)}>
            {item.label || key}
          </button>
        ))}
      </div>
      <div className="model-output">
        <div><span>本環節需求</span><strong>{formatValue(result.segmentDemand, "currency")}</strong></div>
        <div><span>公司可能需求</span><strong>{formatValue(result.companyDemand, "currency")}</strong></div>
        <div><span>占公司營收</span><strong>{formatValue(result.revenueImpactRatio, "percent")}</strong></div>
        <div><span>影響判斷</span><strong>{formatImpactLabel(result.impactLevel)}</strong></div>
      </div>
      <p className="model-interpretation">
        這不是精準預測股價，而是把上游需求翻譯成公司可能取得的訂單規模。若占公司營收比例高，這條需求傳導對投資判斷更有意義。
      </p>
      <div className="parameter-grid">
        {model.steps.map((step) => (
          <label key={step.value_key} className="parameter-control">
            <span>{step.label}</span>
            <input
              type="number"
              inputMode="decimal"
              value={result.inputs[step.value_key]}
              step={step.format === "percent" ? "0.01" : "1000000"}
              onChange={(event) => setOverrides((current) => ({ ...current, [step.value_key]: Number(event.target.value) }))}
            />
            <small>預設：{formatValue(scenario.inputs[step.value_key], step.format)}。{step.explain}</small>
          </label>
        ))}
      </div>
    </section>
  );
}
