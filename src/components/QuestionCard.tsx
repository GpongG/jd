import { useEffect, useRef } from "react";
import type { Category, Question } from "../types";
import { AnswerContent } from "./AnswerContent";
import { HtmlAnswer } from "./HtmlAnswer";
import "./QuestionCard.css";
import "./CommonSidebar.css";

export type DisplayQuestion = Question & { answerHtml?: string };

interface QuestionCardProps {
  question: DisplayQuestion;
  categories: Category[];
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dragListeners?: Record<string, any>;
}

const difficultyClass: Record<string, string> = {
  基础: "diff-basic",
  进阶: "diff-mid",
  高级: "diff-hard",
};

export function QuestionCard({
  question,
  categories,
  index,
  expanded,
  onToggle,
  onEdit,
  onDelete,
  dragListeners,
}: QuestionCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const category = categories.find((c) => c.id === question.category);

  // 展开时自动将卡片滚动到视口顶部
  useEffect(() => {
    if (expanded && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [expanded]);

  return (
    <article
      ref={cardRef}
      className={`question-card ${expanded ? "expanded" : ""}`}
    >
      <button
        type="button"
        className="question-header"
        onClick={onToggle}
        aria-expanded={expanded}
        {...(dragListeners ?? {})}
      >
        <span className="question-index">{index}</span>
        <div className="question-meta">
          <div className="question-tags-row">
            <span className="cat-tag">
              {category?.icon} {category?.name}
            </span>
            <span
              className={`diff-tag ${difficultyClass[question.difficulty]}`}
            >
              {question.difficulty}
            </span>
            {question.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="question-title">{question.title}</h2>
        </div>
        <span className="chevron" aria-hidden>
          {expanded ? "−" : "+"}
        </span>
      </button>
      {expanded && (
        <>
          <div className="question-body">
            {question.keyPoints && question.keyPoints.length > 0 && (
              <div className="key-points">
                <h3>答题要点</h3>
                <ul>
                  {question.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="answer-section">
              <h3>参考解析</h3>
              {question.answerHtml ? (
                <HtmlAnswer html={question.answerHtml} />
              ) : (
                <AnswerContent text={question.answer} />
              )}
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="question-card-actions">
              {onEdit && (
                <button
                  type="button"
                  className="card-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                >
                  编辑
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  className="card-action-btn card-action-btn--danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                >
                  删除
                </button>
              )}
            </div>
          )}
        </>
      )}
    </article>
  );
}
