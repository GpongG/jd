import type {
  CommonBank,
  CommonCategory,
  CommonQuestion,
  Question,
  QuestionOverride,
} from "../types";

const OVERRIDES_KEY = "interview-question-overrides";
const COMMON_BANK_KEY = "interview-common-bank";

const DEFAULT_COMMON_CATEGORIES: CommonCategory[] = [
  {
    id: "common-js",
    name: "JavaScript",
    description: "语言基础、异步、闭包、原型",
    icon: "📜",
  },
  {
    id: "common-css",
    name: "CSS / 布局",
    description: "盒模型、Flex、响应式",
    icon: "🎨",
  },
  {
    id: "common-general",
    name: "综合",
    description: "手写题、场景题、软技能",
    icon: "💡",
  },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function loadOverrides(): Record<string, QuestionOverride> {
  return readJson(OVERRIDES_KEY, {});
}

export function saveOverride(
  questionId: string,
  override: QuestionOverride | null
): Record<string, QuestionOverride> {
  const all = loadOverrides();
  if (override === null) {
    delete all[questionId];
  } else {
    all[questionId] = { ...all[questionId], ...override };
  }
  writeJson(OVERRIDES_KEY, all);
  return all;
}

export function loadCommonBank(): CommonBank {
  const bank = readJson<CommonBank>(COMMON_BANK_KEY, {
    categories: [],
    questions: [],
  });
  if (bank.categories.length === 0) {
    return {
      categories: DEFAULT_COMMON_CATEGORIES,
      questions: bank.questions,
    };
  }
  return bank;
}

export function saveCommonBank(bank: CommonBank): void {
  writeJson(COMMON_BANK_KEY, bank);
}

export function mergeQuestion(
  base: Question,
  overrides: Record<string, QuestionOverride>
): Question & { answerHtml?: string } {
  const o = overrides[base.id];
  if (!o) return base;
  return {
    ...base,
    title: o.title ?? base.title,
    answer: o.answerHtml ? "" : base.answer,
    answerHtml: o.answerHtml,
    keyPoints: o.keyPoints ?? base.keyPoints,
    tags: o.tags ?? base.tags,
    difficulty: o.difficulty ?? base.difficulty,
    category: o.category ?? base.category,
  };
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export type { CommonQuestion, CommonCategory };
