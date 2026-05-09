import { describe, expect, it } from "vitest";
import { getGraph, getInitialNodeId, getNode, normalizeSiteData } from "./siteData";

describe("siteData selectors", () => {
  it("normalizes and selects root data", () => {
    const data = normalizeSiteData({
      taxonomy: { root: "ai", graphs: { ai: { center: "ai", nodes: ["ai"], edges: [] } } },
      nodes: { ai: { id: "ai", title: "AI" } }
    });
    expect(getInitialNodeId(data)).toBe("ai");
    expect(getGraph(data, "ai").center).toBe("ai");
    expect(getNode(data, "ai").title).toBe("AI");
  });
});
