import { useCallback, useMemo, useState } from "react";
import type { CommonCategory, CommonQuestion } from "../types";
import {
  loadCommonBank,
  newId,
  saveCommonBank,
} from "../storage/localStore";
import { CommonSidebar } from "./CommonSidebar";
import { SearchBar } from "./SearchBar";
import { QuestionCard } from "./QuestionCard";
import { CategoryEditModal } from "./CategoryEditModal";
import {
  CommonQuestionEditModal,
  type CommonQuestionPayload,
} from "./CommonQuestionEditModal";
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
import "../App.css";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function SortableQuestionItem({
  question,
  categories,
  index,
  expanded,
  onToggle,
  onEdit,
  onDelete,
}: {
  question: CommonQuestion;
  categories: { id: string; jdId: "h5-senior"; name: string; description: string; icon: string }[];
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 100 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionCard
        question={{
          id: question.id,
          jdId: "h5-senior",
          category: question.category,
          title: question.title,
          difficulty: question.difficulty,
          tags: question.tags,
          answer: "",
          answerHtml: question.answerHtml,
          keyPoints: question.keyPoints,
        }}
        categories={categories}
        index={index}
        expanded={expanded}
        onToggle={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
        dragListeners={listeners}
      />
    </div>
  );
}

interface CommonQuestionsViewProps {
  onCountChange?: (count: number) => void;
}

export function CommonQuestionsView({ onCountChange }: CommonQuestionsViewProps) {
  const [bank, setBank] = useState(loadCommonBank);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<CommonQuestion | null>(
    null
  );
  const [addingQuestion, setAddingQuestion] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    CommonCategory | "new" | null
  >(null);

  const persist = useCallback(
    (next: typeof bank) => {
      setBank(next);
      saveCommonBank(next);
      onCountChange?.(next.questions.length);
    },
    [onCountChange]
  );

  const filtered = useMemo(() => {
    const q = normalize(search);
    return bank.questions.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (difficulty !== "all" && item.difficulty !== difficulty) {
        return false;
      }
      if (!q) return true;
      const catName =
        bank.categories.find((c) => c.id === item.category)?.name ?? "";
      const haystack = [item.title, item.answerHtml, item.tags.join(" "), catName]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [bank, activeCategory, search, difficulty]);

  const countsByCategory = useMemo(() => {
    const map = new Map<string | "all", number>();
    map.set("all", bank.questions.length);
    for (const c of bank.categories) {
      map.set(
        c.id,
        bank.questions.filter((q) => q.category === c.id).length
      );
    }
    return map;
  }, [bank]);

  const sidebarCategories = bank.categories.map((c) => ({
    id: c.id,
    jdId: "h5-senior" as const,
    name: c.name,
    description: c.description,
    icon: c.icon,
  }));

  const handleSaveCategory = (
    data: Omit<CommonCategory, "id"> & { id?: string }
  ) => {
    if (data.id) {
      persist({
        ...bank,
        categories: bank.categories.map((c) =>
          c.id === data.id
            ? {
                id: c.id,
                name: data.name,
                description: data.description,
                icon: data.icon,
              }
            : c
        ),
      });
    } else {
      const id = newId("cat");
      persist({
        ...bank,
        categories: [
          ...bank.categories,
          {
            id,
            name: data.name,
            description: data.description,
            icon: data.icon,
          },
        ],
      });
    }
    setEditingCategory(null);
  };

  const handleDeleteCategory = (cat: CommonCategory) => {
    const count = bank.questions.filter((q) => q.category === cat.id).length;
    if (count > 0) {
      if (
        !window.confirm(
          `分类「${cat.name}」下有 ${count} 道题，删除后这些题也会一并删除。确定继续？`
        )
      ) {
        return;
      }
    } else if (!window.confirm(`确定删除分类「${cat.name}」？`)) {
      return;
    }
    persist({
      categories: bank.categories.filter((c) => c.id !== cat.id),
      questions: bank.questions.filter((q) => q.category !== cat.id),
    });
    if (activeCategory === cat.id) setActiveCategory("all");
  };

  const handleSaveQuestion = (payload: CommonQuestionPayload) => {
    if (editingQuestion) {
      persist({
        ...bank,
        questions: bank.questions.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                ...payload,
                keyPoints: payload.keyPoints.length
                  ? payload.keyPoints
                  : undefined,
              }
            : q
        ),
      });
      setEditingQuestion(null);
    } else {
      const id = newId("cq");
      persist({
        ...bank,
        questions: [
          ...bank.questions,
          {
            id,
            ...payload,
            keyPoints: payload.keyPoints.length
              ? payload.keyPoints
              : undefined,
          },
        ],
      });
      setAddingQuestion(false);
      setExpandedId(id);
    }
  };

  const handleDeleteQuestion = (q: CommonQuestion) => {
    if (!window.confirm(`确定删除「${q.title}」？`)) return;
    persist({
      ...bank,
      questions: bank.questions.filter((item) => item.id !== q.id),
    });
    if (expandedId === q.id) setExpandedId(null);
  };

  const questionSensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragEndQuestions = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = filtered.findIndex((q) => q.id === active.id);
      const newIndex = filtered.findIndex((q) => q.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedFiltered = arrayMove(filtered, oldIndex, newIndex);

      // 将重新排序后的 filtered 子集映射回完整 questions 数组
      const filteredIds = new Set(filtered.map((q) => q.id));
      let fi = 0;
      const newQuestions = bank.questions.map((q) =>
        filteredIds.has(q.id) ? reorderedFiltered[fi++] : q
      );

      persist({ ...bank, questions: newQuestions });
    },
    [filtered, bank, persist]
  );

  const handleReorderCategories = useCallback(
    (reordered: CommonCategory[]) => {
      persist({ ...bank, categories: reordered });
    },
    [bank, persist]
  );

  return (
    <div className="layout common-layout">
      <CommonSidebar
        categories={bank.categories}
        active={activeCategory}
        counts={countsByCategory}
        onSelect={setActiveCategory}
        onAddCategory={() => setEditingCategory("new")}
        onEditCategory={(cat) => setEditingCategory(cat)}
        onDeleteCategory={handleDeleteCategory}
        onReorderCategories={handleReorderCategories}
      />
      <main className="main">
        <div className="common-toolbar">
          <h2>常见面试题</h2>
          <button
            type="button"
            className="btn-add-question"
            disabled={bank.categories.length === 0}
            onClick={() => setAddingQuestion(true)}
          >
            + 新增题目
          </button>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
          resultCount={filtered.length}
        />
        <div className="question-list">
          {filtered.length === 0 ? (
            <div className="empty">
              <p>
                {bank.questions.length === 0
                  ? "还没有题目，点击「新增题目」开始积累"
                  : "没有匹配的题目"}
              </p>
              {bank.questions.length === 0 && bank.categories.length > 0 && (
                <button type="button" onClick={() => setAddingQuestion(true)}>
                  新增第一道题
                </button>
              )}
              {bank.questions.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setDifficulty("all");
                    setActiveCategory("all");
                  }}
                >
                  清除筛选
                </button>
              )}
            </div>
          ) : (
            <DndContext
              sensors={questionSensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndQuestions}
            >
              <SortableContext
                items={filtered.map((q) => q.id)}
                strategy={verticalListSortingStrategy}
              >
                {filtered.map((q, i) => (
                  <SortableQuestionItem
                    key={q.id}
                    question={q}
                    categories={sidebarCategories}
                    index={i + 1}
                    expanded={expandedId === q.id}
                    onToggle={() =>
                      setExpandedId((prev) => (prev === q.id ? null : q.id))
                    }
                    onEdit={() => setEditingQuestion(q)}
                    onDelete={() => handleDeleteQuestion(q)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>
      </main>

      {editingCategory !== null && (
        <CategoryEditModal
          category={editingCategory === "new" ? undefined : editingCategory}
          onSave={handleSaveCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}

      {(addingQuestion || editingQuestion) && (
        <CommonQuestionEditModal
          question={editingQuestion ?? undefined}
          categories={bank.categories}
          defaultCategory={
            activeCategory !== "all" ? activeCategory : undefined
          }
          onSave={handleSaveQuestion}
          onClose={() => {
            setAddingQuestion(false);
            setEditingQuestion(null);
          }}
        />
      )}
    </div>
  );
}
