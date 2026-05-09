export const normalizeSiteData = (raw) => ({
  generated_at: raw?.generated_at || null,
  taxonomy: raw?.taxonomy || { root: null, graphs: {} },
  nodes: raw?.nodes || {},
  models: raw?.models || {},
  archives: raw?.archives || {},
});

export const fetchSiteData = async () => {
  const response = await fetch(`${import.meta.env.BASE_URL}site-data.json`);
  if (!response.ok) throw new Error(`Failed to load site data: ${response.status}`);
  return normalizeSiteData(await response.json());
};

export const getInitialNodeId = (data) => data.taxonomy.root;
export const getGraph = (data, graphId) => data.taxonomy.graphs[graphId] || data.taxonomy.graphs[data.taxonomy.root] || null;
export const getNode = (data, nodeId) => data.nodes[nodeId] || null;
export const getModelForNode = (data, node) => (node?.model_id ? data.models[node.model_id] : null);
export const getArchivesForNode = (data, nodeId) => data.archives[nodeId] || [];
