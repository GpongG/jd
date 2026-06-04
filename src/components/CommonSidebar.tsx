import type { CommonCategory } from "../types";
import "./Sidebar.css";
import "./CommonSidebar.css";

interface CommonSidebarProps {
  categories: CommonCategory[];
  active: string | "all";
  counts: Map<string | "all", number>;
  onSelect: (id: string | "all") => void;
  onAddCategory: () => void;
  onEditCategory: (cat: CommonCategory) => void;
  onDeleteCategory: (cat: CommonCategory) => void;
}

export function CommonSidebar({
  categories,
  active,
  counts,
  onSelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}: CommonSidebarProps) {
  return (
    <aside className="sidebar common-sidebar">
      <div className="common-sidebar-actions">
        <button type="button" className="sidebar-action-btn" onClick={onAddCategory}>
          + 新增分类
        </button>
      </div>
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
          <div key={cat.id} className="common-cat-row">
            <button
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
            <div className="common-cat-tools">
              <button
                type="button"
                className="cat-tool-btn"
                title="编辑分类"
                onClick={() => onEditCategory(cat)}
              >
                ✎
              </button>
              <button
                type="button"
                className="cat-tool-btn cat-tool-btn--danger"
                title="删除分类"
                onClick={() => onDeleteCategory(cat)}
              >
                ×
              </button>
            </div>
          </div>
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
