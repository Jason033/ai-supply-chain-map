import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";

const toElements = (graph, nodes) => [
  ...graph.nodes.map((nodeId) => ({
    data: {
      id: nodeId,
      label: nodes[nodeId]?.title || nodeId,
      type: nodes[nodeId]?.type || "industry",
    },
  })),
  ...graph.edges.map(([source, target]) => ({
    data: { id: `${source}-${target}`, source, target },
  })),
];

export function SupplyGraph({ graph, nodes, selectedNodeId, onSelectNode, onEnterGraph, availableGraphs }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const cy = cytoscape({
      container: containerRef.current,
      elements: toElements(graph, nodes),
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#f1f5ff",
            "border-color": "#2f6feb",
            "border-width": 2,
            color: "#182230",
            "font-size": 12,
            "text-valign": "center",
            "text-halign": "center",
            width: 108,
            height: 44,
            shape: "round-rectangle",
          },
        },
        { selector: "node[type = 'company']", style: { "background-color": "#ecfdf3", "border-color": "#039855" } },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#b7c3d8",
            "target-arrow-color": "#b7c3d8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
        { selector: ".selected", style: { "background-color": "#2f6feb", color: "#ffffff" } },
      ],
      layout: { name: "cose", animate: false, padding: 46 },
      wheelSensitivity: 0.2,
    });
    cyRef.current = cy;
    cy.on("tap", "node", (event) => onSelectNode(event.target.id()));
    cy.on("dbltap", "node", (event) => {
      const nodeId = event.target.id();
      if (availableGraphs[nodeId]) onEnterGraph(nodeId);
    });
    return () => {
      cy.destroy();
      cyRef.current = null;
    };
  }, [graph, nodes, onSelectNode, onEnterGraph, availableGraphs]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.nodes().removeClass("selected");
    if (selectedNodeId) cy.getElementById(selectedNodeId).addClass("selected");
  }, [selectedNodeId]);

  return (
    <div className="graph-shell">
      <div className="graph-hint">單擊看右側分析；雙擊產業節點進入下一層圖。</div>
      <div ref={containerRef} className="graph-canvas" aria-label="AI 產業鏈關聯圖" />
      <div className="graph-node-list" aria-label="目前圖譜節點">
        {graph.nodes.map((nodeId) => (
          <button key={nodeId} type="button" className={nodeId === selectedNodeId ? "active" : ""} onClick={() => onSelectNode(nodeId)}>
            {nodes[nodeId]?.title || nodeId}
          </button>
        ))}
      </div>
    </div>
  );
}
