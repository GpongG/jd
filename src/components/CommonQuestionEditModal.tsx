import { useState } from "react";
import type { CommonCategory, CommonQuestion, Difficulty } from "../types";
import { normalizeAnswerHtml } from "../utils/htmlAnswer";
import { RichTextEditor } from "./RichTextEditor";
import "./Modal.css";

export interface CommonQuestionPayload {
  title: string;
  answerHtml: string;
  keyPoints: string[];
  tags: string[];
  difficulty: Difficulty;
  category: string;
}

interface CommonQuestionEditModalProps {
  question?: CommonQuestion;
  categories: CommonCategory[];
  defaultCategory?: string;
  onSave: (payload: CommonQuestionPayload) => void;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ["基础", "进阶", "高级"];

export function CommonQuestionEditModal({
  question,
  categories,
  defaultCategory,
  onSave,
  onClose,
}: CommonQuestionEditModalProps) {
  const [title, setTitle] = useState(question?.title ?? "");
  const [answerHtml, setAnswerHtml] = useState(
    question?.answerHtml ?? "<p></p>"
  );
  const [keyPoints, setKeyPoints] = useState<string[]>(
    question?.keyPoints?.length ? [...question.keyPoints] : [""]
  );
  const [tagsStr, setTagsStr] = useState(question?.tags.join(", ") ?? "");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    question?.difficulty ?? "进阶"
  );
  const [category, setCategory] = useState(
    question?.category ?? defaultCategory ?? categories[0]?.id ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) return;
    onSave({
      title: title.trim(),
      answerHtml: normalizeAnswerHtml(answerHtml),
      keyPoints: keyPoints.map((p) => p.trim()).filter(Boolean),
      tags: tagsStr
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean),
      difficulty,
      category,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal modal--wide"
        role="dialog"
        aria-labelledby="common-q-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="common-q-title">
            {question ? "编辑面试题" : "新增面试题"}
          </h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {categories.length === 0 ? (
              <p className="form-hint">请先添加至少一个分类。</p>
            ) : (
              <>
                <div className="form-field">
                  <label htmlFor="cq-title">问题</label>
                  <input
                    id="cq-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="cq-cat">分类</label>
                    <select
                      id="cq-cat"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.icon} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="cq-diff">难度</label>
                    <select
                      id="cq-diff"
                      value={difficulty}
                      onChange={(e) =>
                        setDifficulty(e.target.value as Difficulty)
                      }
                    >
                      {DIFFICULTIES.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="cq-tags">标签</label>
                  <input
                    id="cq-tags"
                    value={tagsStr}
                    onChange={(e) => setTagsStr(e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>答题要点</label>
                  <div className="key-points-editor">
                    {keyPoints.map((point, i) => (
                      <div key={i} className="key-point-row">
                        <input
                          value={point}
                          onChange={(e) => {
                            const next = [...keyPoints];
                            next[i] = e.target.value;
                            setKeyPoints(next);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setKeyPoints(keyPoints.filter((_, j) => j !== i))
                          }
                          disabled={keyPoints.length <= 1}
                        >
                          删
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="key-point-add"
                      onClick={() => setKeyPoints([...keyPoints, ""])}
                    >
                      + 添加要点
                    </button>
                  </div>
                </div>
                <div className="form-field">
                  <label>答案（富文本）</label>
                  <RichTextEditor
                    value={answerHtml}
                    onChange={setAnswerHtml}
                    minHeight={280}
                  />
                </div>
              </>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              取消
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={categories.length === 0}
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
