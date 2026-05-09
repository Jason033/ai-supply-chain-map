import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, "utf8"));

const normalizeMeta = (meta) =>
  Object.fromEntries(
    Object.entries(meta).map(([key, value]) => [
      key,
      value instanceof Date ? value.toISOString().slice(0, 10) : value,
    ]),
  );

const listFiles = async (dirPath, predicate) => {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && predicate(entry.name))
      .map((entry) => path.join(dirPath, entry.name));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

const listArchiveVersions = async (archiveDir) => {
  try {
    const nodeDirs = await fs.readdir(archiveDir, { withFileTypes: true });
    const versions = [];
    for (const nodeDir of nodeDirs.filter((entry) => entry.isDirectory())) {
      const nodeId = nodeDir.name;
      const versionDirs = await fs.readdir(path.join(archiveDir, nodeId), { withFileTypes: true });
      for (const versionDir of versionDirs.filter((entry) => entry.isDirectory())) {
        const versionPath = path.join(archiveDir, nodeId, versionDir.name);
        const parsed = matter(await fs.readFile(path.join(versionPath, "node.md"), "utf8"));
        let model = null;
        try {
          model = await readJson(path.join(versionPath, "model.json"));
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
        }
        versions.push({
          node_id: nodeId,
          version_date: versionDir.name,
          node: { meta: normalizeMeta(parsed.data), body: parsed.content.trim() },
          model,
          summary: await readJson(path.join(versionPath, "summary.json")),
        });
      }
    }
    return versions;
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
};

export const loadSiteContent = async ({ rootDir }) => {
  const contentDir = path.join(rootDir, "content");
  const nodeFiles = await listFiles(path.join(contentDir, "nodes"), (name) => name.endsWith(".md"));
  const modelFiles = await listFiles(path.join(contentDir, "models"), (name) => name.endsWith(".json"));
  const nodes = await Promise.all(
    nodeFiles.map(async (filePath) => {
      const parsed = matter(await fs.readFile(filePath, "utf8"));
      return { filePath, meta: normalizeMeta(parsed.data), body: parsed.content.trim() };
    }),
  );
  const models = await Promise.all(
    modelFiles.map(async (filePath) => ({ filePath, data: await readJson(filePath) })),
  );
  return {
    nodes,
    models,
    taxonomy: await readJson(path.join(contentDir, "taxonomy", "graphs.json")),
    archives: await listArchiveVersions(path.join(contentDir, "archive")),
    schemas: {
      node: await readJson(path.join(contentDir, "schema", "node.schema.json")),
      model: await readJson(path.join(contentDir, "schema", "model.schema.json")),
    },
  };
};
