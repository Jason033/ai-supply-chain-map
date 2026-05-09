import { useState } from "react";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function AppShell({ graph, detail, toolbar }) {
  const [leftPane, setLeftPane] = useState(58);

  const startResize = (event) => {
    event.preventDefault();
    const container = event.currentTarget.closest(".workbench");
    const width = container?.getBoundingClientRect().width || window.innerWidth;
    const startX = event.clientX;
    const startPane = leftPane;
    const onMove = (moveEvent) => {
      const next = clamp(startPane + ((moveEvent.clientX - startX) / width) * 100, 34, 76);
      setLeftPane(Math.round(next));
      window.dispatchEvent(new Event("resize"));
    };
    const onEnd = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.dispatchEvent(new Event("resize"));
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
  };

  return (
    <main className="app-shell">
      <section className="top-toolbar">{toolbar}</section>
      <section className="workbench" style={{ "--left-pane": `${leftPane}%` }}>
        <div className="graph-pane">{graph}</div>
        <button
          type="button"
          className="splitter"
          role="separator"
          aria-label="調整圖譜與內容寬度"
          aria-orientation="vertical"
          onMouseDown={startResize}
        />
        <aside className="detail-pane">{detail}</aside>
      </section>
    </main>
  );
}
