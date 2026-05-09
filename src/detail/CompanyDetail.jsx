import { DemandModel } from "../model/DemandModel";
import { VersionHistory } from "./VersionHistory";

const statusLabels = {
  researchable: "可研究",
  wait_for_price: "等價格",
  observe: "觀察",
  exclude: "排除",
};

const scoreLabels = {
  industry_benefit: "產業受惠強度",
  financial_conversion: "財務轉換能力",
  valuation_setup: "估值位置",
  expectation_gap: "預期差機會",
};

export function CompanyDetail({ node, model, archives, selectedArchive, onSelectArchive, onClearArchive }) {
  const thesisText = node.body_markdown?.match(/## 一句話買入假設\s+([\s\S]*?)(?=\n## |$)/)?.[1]?.trim();

  return (
    <article className="detail-content company-detail">
      {selectedArchive ? (
        <div className="archive-banner">
          <span>這是 {selectedArchive.version_date} 的舊版分析。</span>
          <button type="button" onClick={onClearArchive}>回到最新版</button>
        </div>
      ) : null}
      <header className="detail-header">
        <p className="eyebrow">Company / {node.ticker}</p>
        <h1>{node.title}</h1>
        <div className={`status-badge status-${node.status}`}>{statusLabels[node.status] || node.status}</div>
        <p className="meta-line">更新日期：{node.updated_at} / 資料日期：{node.data_as_of}</p>
      </header>
      <section className="decision-frame" aria-label="公司頁閱讀導覽">
        <div className="decision-frame-main">
          <p className="eyebrow">這頁要回答什麼</p>
          <h2>這家公司現在是值得研究、該等價格，還是先排除？</h2>
          <p>
            判斷順序是：先確認 AI 需求是否真的會流到公司，再看能否變成財報，最後檢查估值是否已經把好消息反映完。
          </p>
        </div>
        <div className="decision-summary-card">
          <span>目前結論</span>
          <strong>{statusLabels[node.status] || node.status}</strong>
          <p>{thesisText || "請先看下方買入假設與需求傳導模型。"}</p>
        </div>
      </section>
      <section className="score-grid" aria-label="買入判斷分數">
        {Object.entries(scoreLabels).map(([key, label]) => {
          const score = node.scores[key];
          return (
            <div key={key} className="score-card">
              <div className="score-topline"><span>{label}</span><strong>{score.value}/5</strong></div>
              <p className="score-label">{score.label}</p>
              <p>{score.reason}</p>
            </div>
          );
        })}
      </section>
      <div className="analysis-body" dangerouslySetInnerHTML={{ __html: node.body_html }} />
      {model ? <DemandModel model={model} /> : null}
      <section className="source-list">
        <h2>來源</h2>
        <ul>
          {node.sources.map((source) => (
            <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>
          ))}
        </ul>
      </section>
      <VersionHistory archives={archives} onSelectArchive={onSelectArchive} />
    </article>
  );
}
