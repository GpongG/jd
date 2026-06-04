import { useEffect, useState } from "react";
import type { Category, Difficulty, Question } from "../types";
import { normalizeAnswerHtml } from "../utils/htmlAnswer";
import { markdownToHtml } from "../utils/markdownToHtml";
import { RichTextEditor } from "./RichTextEditor";
import "./Modal.css";

export interface QuestionEditPayload {
  title: string;
  answerHtml: string;
  keyPoints: string[];
  tags: string[];
  difficulty: Difficulty;
  category: string;
}

interface QuestionEditModalProps {
  question: Question & { answerHtml?: string };
  categories: Category[];
  onSave: (payload: QuestionEditPayload) => void;
  onClose: () => void;
}

const DIFFICULTIES: Difficulty[] = ["基础", "进阶", "高级"];

export function QuestionEditModal({
  question,
  categories,
  onSave,
  onClose,
}: QuestionEditModalProps) {
  const [title, setTitle] = useState(question.title);
  const [answerHtml, setAnswerHtml] = useState("");
  const [keyPoints, setKeyPoints] = useState<string[]>(
    question.keyPoints?.length ? [...question.keyPoints] : [""]
  );
  const [tagsStr, setTagsStr] = useState(question.tags.join(", "));
  const [difficulty, setDifficulty] = useState<Difficulty>(question.difficulty);
  const [category, setCategory] = useState(question.category);

  useEffect(() => {
    if (question.answerHtml) {
      setAnswerHtml(question.answerHtml);
    } else if (question.answer) {
      setAnswerHtml(markdownToHtml(question.answer));
    } else {
      setAnswerHtml("<p></p>");
    }
  }, [question]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
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
        aria-labelledby="edit-question-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="edit-question-title">编辑题目</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-field">
              <label htmlFor="q-title">问题</label>
              <input
                id="q-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="q-cat">分类</label>
                <select
                  id="q-cat"
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
                <label htmlFor="q-diff">难度</label>
                <select
                  id="q-diff"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
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
              <label htmlFor="q-tags">标签（逗号分隔）</label>
              <input
                id="q-tags"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                placeholder="React, Vue, 性能"
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
                      placeholder={`要点 ${i + 1}`}
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
              <label>参考答案（富文本）</label>
              <RichTextEditor
                value={answerHtml}
                onChange={setAnswerHtml}
                minHeight={280}
                placeholder="编写详细解析…"
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
