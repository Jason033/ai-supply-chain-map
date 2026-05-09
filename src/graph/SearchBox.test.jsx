import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SearchBox } from "./SearchBox";

describe("SearchBox", () => {
  it("filters nodes and selects a result", () => {
    const onSelectNode = vi.fn();
    render(
      <SearchBox
        nodes={{
          ai: { id: "ai", title: "AI" },
          tsmc: { id: "tsmc", title: "台積電", ticker: "TSM" }
        }}
        onSelectNode={onSelectNode}
      />,
    );
    fireEvent.change(screen.getByLabelText("搜尋產業、公司或 ticker"), { target: { value: "TSM" } });
    fireEvent.click(screen.getByText("台積電"));
    expect(onSelectNode).toHaveBeenCalledWith("tsmc");
  });
});
