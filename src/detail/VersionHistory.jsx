const statusLabels = {
  researchable: "可研究",
  wait_for_price: "等價格",
  observe: "觀察",
  exclude: "排除",
};

const scoreLabels = {
  industry_benefit: "產業受惠",
  financial_conversion: "財務轉換",
  valuation_setup: "估值位置",
  expectation_gap: "預期差",
};

export function VersionHistory({ archives, onSelectArchive }) {
  if (!archives.length) return null;
  return (
    <section className="version-history">
      <h2>歷史版本</h2>
      <div className="version-items">
        {archives.map((archive) => (
          <button key={archive.version_date} type="button" onClick={() => onSelectArchive(archive)}>
            <strong>{archive.version_date}</strong>
            <span>狀態：{statusLabels[archive.summary.status_from]} → {statusLabels[archive.summary.status_to]}</span>
            <span>{archive.summary.main_reason}</span>
            {archive.summary.score_changes ? (
              <span>
                {Object.entries(archive.summary.score_changes)
                  .map(([key, change]) => `${scoreLabels[key] || key}: ${change.from}→${change.to}`)
                  .join(" / ")}
              </span>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}
