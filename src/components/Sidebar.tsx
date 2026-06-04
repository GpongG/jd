import type { Category } from "../types";
import "./Sidebar.css";

interface SidebarProps {
  categories: Category[];
  active: string | "all";
  counts: Map<string | "all", number>;
  onSelect: (id: string | "all") => void;
}

export function Sidebar({
  categories,
  active,
  counts,
  onSelect,
}: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <button
          type="button"
          className={`sidebar-item ${active === "all" ? "active" : ""}`}
          onClick={() => onSelect("all")}
        >
          <span className="sidebar-icon">📚</span>
          <span className="sidebar-label">
            全部题目
            <span className="sidebar-count">{counts.get("all")}</span>
          </span>
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`sidebar-item ${active === cat.id ? "active" : ""}`}
            onClick={() => onSelect(cat.id)}
          >
            <span className="sidebar-icon">{cat.icon}</span>
            <span className="sidebar-label">
              {cat.name}
              <span className="sidebar-count">{counts.get(cat.id)}</span>
            </span>
          </button>
        ))}
      </nav>
      {active !== "all" && (
        <p className="sidebar-desc">
          {categories.find((c) => c.id === active)?.description}
        </p>
      )}
    </aside>
  );
}
