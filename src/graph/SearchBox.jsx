import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export function SearchBox({ nodes, onSelectNode }) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return Object.values(nodes)
      .filter((node) => `${node.title} ${node.ticker || ""} ${node.id}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [nodes, query]);

  return (
    <div className="search-box">
      <Search aria-hidden="true" size={17} />
      <input
        value={query}
        aria-label="搜尋產業、公司或 ticker"
        placeholder="搜尋產業、公司或 ticker"
        onChange={(event) => setQuery(event.target.value)}
      />
      {results.length > 0 ? (
        <div className="search-results">
          {results.map((node) => (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                onSelectNode(node.id);
                setQuery("");
              }}
            >
              <span>{node.title}</span>
              {node.ticker ? <small>{node.ticker}</small> : <small>{node.type}</small>}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
