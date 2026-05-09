import { DemandModel } from "../model/DemandModel";

export function IndustryDetail({ node, model }) {
  return (
    <article className="detail-content industry-detail">
      <header className="detail-header">
        <p className="eyebrow">Industry</p>
        <h1>{node.title}</h1>
        <p className="meta-line">更新日期：{node.updated_at} / 資料日期：{node.data_as_of}</p>
      </header>
      <section className="decision-frame" aria-label="產業頁閱讀導覽">
        <div className="decision-frame-main">
          <p className="eyebrow">這頁要回答什麼</p>
          <h2>這個環節如何把 AI 源頭需求變成可投資的公司機會？</h2>
          <p>
            閱讀重點不是記名詞，而是看需求從哪裡來、卡在哪裡、誰能把瓶頸轉成營收與毛利。
          </p>
        </div>
      </section>
      <div className="analysis-body" dangerouslySetInnerHTML={{ __html: node.body_html }} />
      {model ? <DemandModel model={model} /> : null}
    </article>
  );
}
