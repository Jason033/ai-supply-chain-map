import { useEffect, useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  fetchSiteData,
  getArchivesForNode,
  getGraph,
  getInitialNodeId,
  getModelForNode,
  getNode,
  normalizeSiteData,
} from "./data/siteData";
import { DetailPanel } from "./detail/DetailPanel";
import { SearchBox } from "./graph/SearchBox";
import { SupplyGraph } from "./graph/SupplyGraph";
import { AppShell } from "./layout/AppShell";

export default function App() {
  const [data, setData] = useState(() => normalizeSiteData(null));
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [currentGraphId, setCurrentGraphId] = useState(null);
  const [selectedArchive, setSelectedArchive] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchSiteData()
      .then((loaded) => {
        if (!active) return;
        const initialNodeId = getInitialNodeId(loaded);
        setData(loaded);
        setSelectedNodeId(initialNodeId);
        setCurrentGraphId(initialNodeId);
      })
      .catch((loadError) => {
        if (!active) return;
        setError(loadError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const selectNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setSelectedArchive(null);
  };

  const selectedNode = useMemo(() => getNode(data, selectedNodeId), [data, selectedNodeId]);
  const graph = useMemo(() => getGraph(data, currentGraphId), [data, currentGraphId]);
  const displayedNode = selectedArchive?.node || selectedNode;
  const displayedModel = selectedArchive?.model || getModelForNode(data, selectedNode);

  if (error) return <div className="status-page" role="alert">資料載入失敗：{error}</div>;
  if (!selectedNode || !graph || !displayedNode) return <div className="status-page">正在讀取 AI 產業鏈資料...</div>;

  return (
    <AppShell
      toolbar={
        <>
          <div className="brand-strip">
            <div>
              <p className="eyebrow">AI Supply Chain Map</p>
              <h1>AI 產業鏈投資研究地圖</h1>
            </div>
            <div className="breadcrumbs">
              <button
                type="button"
                onClick={() => {
                  setCurrentGraphId(data.taxonomy.root);
                  selectNode(data.taxonomy.root);
                }}
              >
                AI
              </button>
              {currentGraphId !== data.taxonomy.root ? (
                <>
                  <ChevronRight size={16} aria-hidden="true" />
                  <span>{getNode(data, currentGraphId)?.title}</span>
                </>
              ) : null}
            </div>
          </div>
          <SearchBox nodes={data.nodes} onSelectNode={selectNode} />
        </>
      }
      graph={
        <SupplyGraph
          graph={graph}
          nodes={data.nodes}
          selectedNodeId={selectedNodeId}
          availableGraphs={data.taxonomy.graphs}
          onSelectNode={selectNode}
          onEnterGraph={(nodeId) => {
            setCurrentGraphId(nodeId);
            selectNode(nodeId);
          }}
        />
      }
      detail={
        <DetailPanel
          node={displayedNode}
          model={displayedModel}
          archives={getArchivesForNode(data, selectedNode.id)}
          selectedArchive={selectedArchive}
          onSelectArchive={setSelectedArchive}
          onClearArchive={() => setSelectedArchive(null)}
        />
      }
    />
  );
}
