import type { Category, JdId } from "../../types";
import { h5SeniorCategories } from "./h5-senior";
import { frontendDevCategories } from "./frontend-dev";

const byJd: Record<JdId, Category[]> = {
  "h5-senior": h5SeniorCategories,
  "frontend-dev": frontendDevCategories,
};

export function getCategories(jdId: JdId): Category[] {
  return byJd[jdId];
}

export function getAllCategories(): Category[] {
  return [...h5SeniorCategories, ...frontendDevCategories];
}
