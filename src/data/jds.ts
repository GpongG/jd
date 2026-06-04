import type { JobProfile } from "../types";

export const jobProfiles: JobProfile[] = [
  {
    id: "h5-senior",
    title: "H5 高级开发工程师",
    subtitle: "海外移动 H5 社交 · 高并发 · Hybrid · RTC · 弱网优化",
    badge: "高级岗 · 7年+",
    theme: "blue",
    moduleLabel: "7 大技术模块",
  },
  {
    id: "frontend-dev",
    title: "前端开发工程师",
    subtitle: "PC/移动社交 · Vue/React · jQuery/Bootstrap · Webpack 工程化",
    badge: "中级岗 · 3年+",
    theme: "violet",
    moduleLabel: "9 大技术模块",
  },
];

export function getJobProfile(jdId: string): JobProfile {
  return jobProfiles.find((j) => j.id === jdId) ?? jobProfiles[0];
}
