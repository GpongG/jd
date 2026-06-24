import { useCallback } from "react";
import type { CommonCategory } from "../types";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  onReorderCategories: (categories: CommonCategory[]) => void;
}

function SortableCatItem({
  cat,
  active,
  counts,
  onSelect,
  onEditCategory,
  onDeleteCategory,
}: {
  cat: CommonCategory;
  active: string | "all";
  counts: Map<string | "all", number>;
  onSelect: (id: string | "all") => void;
  onEditCategory: (cat: CommonCategory) => void;
  onDeleteCategory: (cat: CommonCategory) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cat.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`common-cat-row ${isDragging ? "dragging" : ""}`} {...listeners}>
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
    </div>
  );
}

export function CommonSidebar({
  categories,
  active,
  counts,
  onSelect,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onReorderCategories,
}: CommonSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active: activeItem, over } = event;
      if (!over || activeItem.id === over.id) return;

      const oldIndex = categories.findIndex((c) => c.id === activeItem.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = arrayMove(categories, oldIndex, newIndex);
      onReorderCategories(reordered);
    },
    [categories, onReorderCategories]
  );

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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={categories.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            {categories.map((cat) => (
              <SortableCatItem
                key={cat.id}
                cat={cat}
                active={active}
                counts={counts}
                onSelect={onSelect}
                onEditCategory={onEditCategory}
                onDeleteCategory={onDeleteCategory}
              />
            ))}
          </SortableContext>
        </DndContext>
      </nav>
      {active !== "all" && (
        <p className="sidebar-desc">
          {categories.find((c) => c.id === active)?.description}
        </p>
      )}
    </aside>
  );
}
