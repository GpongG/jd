import type { JdId, Question, QuestionDraft } from "../../types";
import { frameworkQuestions } from "./framework";
import { hybridQuestions } from "./hybrid";
import { rtcQuestions } from "./rtc";
import { networkQuestions } from "./network";
import { performanceQuestions } from "./performance";
import { engineeringQuestions } from "./engineering";
import { leadershipQuestions } from "./leadership";
import { frontendDevQuestions } from "./frontend-dev";

function withJd(jdId: JdId, drafts: QuestionDraft[]): Question[] {
  return drafts.map((q) => ({ ...q, jdId }));
}

const h5SeniorDrafts: QuestionDraft[] = [
  ...frameworkQuestions,
  ...hybridQuestions,
  ...rtcQuestions,
  ...networkQuestions,
  ...performanceQuestions,
  ...engineeringQuestions,
  ...leadershipQuestions,
];

const questionsByJd: Record<JdId, Question[]> = {
  "h5-senior": withJd("h5-senior", h5SeniorDrafts),
  "frontend-dev": withJd("frontend-dev", frontendDevQuestions),
};

export function getQuestions(jdId: JdId): Question[] {
  return questionsByJd[jdId];
}

export function getQuestionCount(jdId: JdId): number {
  return questionsByJd[jdId].length;
}
