import { useState } from "react";
import type { CommonCategory } from "../types";
import "./Modal.css";

interface CategoryEditModalProps {
  category?: CommonCategory;
  onSave: (data: Omit<CommonCategory, "id"> & { id?: string }) => void;
  onClose: () => void;
}

export function CategoryEditModal({
  category,
  onSave,
  onClose,
}: CategoryEditModalProps) {
  const [name, setName] = useState(category?.name ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [icon, setIcon] = useState(category?.icon ?? "📁");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: category?.id,
      name: name.trim(),
      description: description.trim(),
      icon: icon.trim() || "📁",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-labelledby="edit-cat-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="edit-cat-title">
            {category ? "编辑分类" : "新增分类"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="cat-name">分类名称</label>
              <input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="例如 JavaScript"
              />
            </div>
            <div className="form-field">
              <label htmlFor="cat-icon">图标（Emoji）</label>
              <input
                id="cat-icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                maxLength={4}
              />
            </div>
            <div className="form-field">
              <label htmlFor="cat-desc">描述</label>
              <textarea
                id="cat-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="该分类涵盖的知识点…"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
