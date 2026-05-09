import fs from "node:fs/promises";
import path from "node:path";
import { marked } from "marked";
import { loadSiteContent } from "./content-loader.js";
import { validateSiteContent } from "./validate-content.js";

const toSiteNode = (node) => ({
  ...node.meta,
  body_markdown: node.body,
  body_html: marked.parse(node.body),
});

export const buildSiteData = async ({ rootDir }) => {
  const validation = await validateSiteContent({ rootDir });
  if (!validation.valid) {
    throw new Error(`Content validation failed:\n${validation.errors.join("\n")}`);
  }
  const content = await loadSiteContent({ rootDir });
  const archives = content.archives.reduce((acc, archive) => {
    acc[archive.node_id] ||= [];
    acc[archive.node_id].push({
      version_date: archive.version_date,
      summary: archive.summary,
      node: toSiteNode(archive.node),
      model: archive.model,
    });
    acc[archive.node_id].sort((a, b) => b.version_date.localeCompare(a.version_date));
    return acc;
  }, {});
  return {
    generated_at: new Date().toISOString(),
    taxonomy: content.taxonomy,
    nodes: Object.fromEntries(content.nodes.map((node) => [node.meta.id, toSiteNode(node)])),
    models: Object.fromEntries(content.models.map((model) => [model.data.model_id, model.data])),
    archives,
  };
};

export const writeSiteData = async ({ rootDir }) => {
  const outputPath = path.join(rootDir, "public", "site-data.json");
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(await buildSiteData({ rootDir }), null, 2)}\n`);
  return outputPath;
};
