import Ajv2020 from "ajv/dist/2020.js";
import { loadSiteContent } from "./content-loader.js";

const formatAjvErrors = (prefix, errors = []) =>
  errors.map((error) => `${prefix}${error.instancePath || ""} ${error.message}`.trim());

export const validateSiteContent = async ({ rootDir }) => {
  const content = await loadSiteContent({ rootDir });
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  const validateNode = ajv.compile(content.schemas.node);
  const validateModel = ajv.compile(content.schemas.model);
  const errors = [];
  const nodeIds = new Set();
  const modelIds = new Set(content.models.map((model) => model.data.model_id));

  for (const node of content.nodes) {
    const valid = validateNode(node.meta);
    if (!valid) errors.push(...formatAjvErrors(`${node.meta.id || "unknown node"}: `, validateNode.errors));
    if (nodeIds.has(node.meta.id)) errors.push(`Duplicate node id: ${node.meta.id}`);
    nodeIds.add(node.meta.id);
    if (node.meta.model_id && !modelIds.has(node.meta.model_id)) {
      errors.push(`${node.meta.id}: model_id ${node.meta.model_id} does not resolve`);
    }
    if (node.meta.type === "industry" && !node.body.includes("## 一句話結論")) {
      errors.push(`${node.meta.id}: industry node must include ## 一句話結論`);
    }
    if (node.meta.type === "company" && !node.body.includes("## 一句話買入假設")) {
      errors.push(`${node.meta.id}: company node must include ## 一句話買入假設`);
    }
  }

  for (const model of content.models) {
    const valid = validateModel(model.data);
    if (!valid) errors.push(...formatAjvErrors(`${model.data.model_id || "unknown model"}: `, validateModel.errors));
  }

  for (const [graphId, graph] of Object.entries(content.taxonomy.graphs || {})) {
    if (!nodeIds.has(graph.center)) errors.push(`${graphId}: graph center ${graph.center} does not resolve`);
    for (const nodeId of graph.nodes || []) {
      if (!nodeIds.has(nodeId)) errors.push(`${graphId}: graph node ${nodeId} does not resolve`);
    }
    for (const edge of graph.edges || []) {
      if (!Array.isArray(edge) || edge.length !== 2) errors.push(`${graphId}: edge must be [source, target]`);
      if (edge[0] && !nodeIds.has(edge[0])) errors.push(`${graphId}: edge source ${edge[0]} does not resolve`);
      if (edge[1] && !nodeIds.has(edge[1])) errors.push(`${graphId}: edge target ${edge[1]} does not resolve`);
    }
  }

  for (const archive of content.archives) {
    const current = content.nodes.find((node) => node.meta.id === archive.node_id);
    if (!current) errors.push(`${archive.node_id}/${archive.version_date}: archive has no current node`);
    if (!archive.summary?.main_reason) errors.push(`${archive.node_id}/${archive.version_date}: missing summary main_reason`);
    if (current && archive.version_date > current.meta.updated_at) {
      errors.push(`${archive.node_id}/${archive.version_date}: archive date later than current updated_at`);
    }
    if (archive.node.meta.model_id && !archive.model) {
      errors.push(`${archive.node_id}/${archive.version_date}: archived node has model_id but missing model.json`);
    }
  }

  return { valid: errors.length === 0, errors };
};
