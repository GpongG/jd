export type JdId = "h5-senior" | "frontend-dev";

export type Difficulty = "基础" | "进阶" | "高级";

export interface JobProfile {
  id: JdId;
  title: string;
  subtitle: string;
  badge: string;
  theme: "blue" | "violet";
  moduleLabel: string;
}

export interface Category {
  id: string;
  jdId: JdId;
  name: string;
  description: string;
  icon: string;
}

export interface Question {
  id: string;
  jdId: JdId;
  category: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  answer: string;
  keyPoints?: string[];
}

/** 题库录入时不带 jdId，汇总时注入 */
export type QuestionDraft = Omit<Question, "jdId">;

/** 常见面试题分类（独立于 JD） */
export interface CommonCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

/** 常见面试题 */
export interface CommonQuestion {
  id: string;
  category: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  answerHtml: string;
  keyPoints?: string[];
}

/** JD 题目本地编辑覆盖 */
export interface QuestionOverride {
  title?: string;
  answerHtml?: string;
  keyPoints?: string[];
  tags?: string[];
  difficulty?: Difficulty;
  category?: string;
}

export interface CommonBank {
  categories: CommonCategory[];
  questions: CommonQuestion[];
}
