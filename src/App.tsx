import { useCallback, useMemo, useState } from "react";
import type { AppView, JdId, Question } from "./types";
import { getJobProfile } from "./data/jds";
import { getCategories } from "./data/categories";
import { getQuestions, getQuestionCount } from "./data/questions";
import {
  loadCommonBank,
  loadOverrides,
  mergeQuestion,
  saveOverride,
} from "./storage/localStore";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { QuestionCard } from "./components/QuestionCard";
import { QuestionEditModal } from "./components/QuestionEditModal";
import type { QuestionEditPayload } from "./components/QuestionEditModal";
import { CommonQuestionsView } from "./components/CommonQuestionsView";
import "./App.css";

const JD_STORAGE_KEY = "interview-active-jd";
const VIEW_STORAGE_KEY = "interview-active-view";

function loadJd(): JdId {
  try {
    const saved = localStorage.getItem(JD_STORAGE_KEY);
    if (saved === "h5-senior" || saved === "frontend-dev") return saved;
  } catch {
    /* ignore */
  }
  return "h5-senior";
}

function loadView(): AppView {
  try {
    const saved = localStorage.getItem(VIEW_STORAGE_KEY);
    if (saved === "jd" || saved === "common") return saved;
  } catch {
    /* ignore */
  }
  return "jd";
}

function normalize(s: string) {
  return s.toLowerCase().trim();
}

export default function App() {
  const [activeJd, setActiveJd] = useState<JdId>(loadJd);
  const [activeView, setActiveView] = useState<AppView>(loadView);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [overrides, setOverrides] = useState(loadOverrides);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [commonCount, setCommonCount] = useState(
    () => loadCommonBank().questions.length
  );

  const job = getJobProfile(activeJd);
  const categories = getCategories(activeJd);
  const baseQuestions = useMemo(() => getQuestions(activeJd), [activeJd]);

  const questions = useMemo(
    () => baseQuestions.map((q) => mergeQuestion(q, overrides)),
    [baseQuestions, overrides]
  );

  const jdCounts = useMemo(
    () =>
      ({
        "h5-senior": getQuestionCount("h5-senior"),
        "frontend-dev": getQuestionCount("frontend-dev"),
      }) as Record<JdId, number>,
    []
  );

  const handleJdChange = useCallback((jdId: JdId) => {
    setActiveJd(jdId);
    setActiveCategory("all");
    setSearch("");
    setDifficulty("all");
    setExpandedId(null);
    try {
      localStorage.setItem(JD_STORAGE_KEY, jdId);
    } catch {
      /* ignore */
    }
  }, []);

  const handleViewChange = useCallback((view: AppView) => {
    setActiveView(view);
    setExpandedId(null);
    if (view === "common") {
      setCommonCount(loadCommonBank().questions.length);
    }
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, view);
    } catch {
      /* ignore */
    }
  }, []);

  const handleSaveEdit = useCallback(
    (payload: QuestionEditPayload) => {
      if (!editingQuestion) return;
      const next = saveOverride(editingQuestion.id, {
        title: payload.title,
        answerHtml: payload.answerHtml,
        keyPoints: payload.keyPoints,
        tags: payload.tags,
        difficulty: payload.difficulty,
        category: payload.category,
      });
      setOverrides(next);
      setEditingQuestion(null);
    },
    [editingQuestion]
  );

  const filtered = useMemo(() => {
    const q = normalize(search);
    return questions.filter((item) => {
      if (activeCategory !== "all" && item.category !== activeCategory) {
        return false;
      }
      if (difficulty !== "all" && item.difficulty !== difficulty) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        item.title,
        item.answer,
        item.answerHtml ?? "",
        item.tags.join(" "),
        categories.find((c) => c.id === item.category)?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCategory, search, difficulty, questions, categories]);

  const countsByCategory = useMemo(() => {
    const map = new Map<string | "all", number>();
    map.set("all", questions.length);
    for (const c of categories) {
      map.set(
        c.id,
        questions.filter((q) => q.category === c.id).length
      );
    }
    return map;
  }, [questions, categories]);

  const editingMerged = editingQuestion
    ? mergeQuestion(editingQuestion, overrides)
    : null;

  return (
    <div className={`app app--${job.theme}`}>
      <Header
        job={job}
        total={questions.length}
        activeJd={activeJd}
        jdCounts={jdCounts}
        onJdChange={handleJdChange}
        activeView={activeView}
        onViewChange={handleViewChange}
        commonCount={commonCount}
      />
      {activeView === "common" ? (
        <CommonQuestionsView onCountChange={setCommonCount} />
      ) : (
        <div className="layout">
          <Sidebar
            categories={categories}
            active={activeCategory}
            counts={countsByCategory}
            onSelect={setActiveCategory}
          />
          <main className="main">
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
                  <p>没有匹配的题目</p>
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
                </div>
              ) : (
                filtered.map((q, i) => (
                  <QuestionCard
                    key={q.id}
                    question={q}
                    categories={categories}
                    index={i + 1}
                    expanded={expandedId === q.id}
                    onToggle={() =>
                      setExpandedId((prev) => (prev === q.id ? null : q.id))
                    }
                    onEdit={() => {
                      const base = baseQuestions.find((b) => b.id === q.id);
                      if (base) setEditingQuestion(base);
                    }}
                  />
                ))
              )}
            </div>
          </main>
        </div>
      )}

      {editingMerged && (
        <QuestionEditModal
          question={editingMerged}
          categories={categories}
          onSave={handleSaveEdit}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}
