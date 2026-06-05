import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { sanitizeAnswerHtml } from "../utils/htmlAnswer";
import "./HtmlAnswer.css";

interface HtmlAnswerProps {
  html: string;
}

export function HtmlAnswer({ html }: HtmlAnswerProps) {
  const safe = sanitizeAnswerHtml(html);
  const containerRef = useRef<HTMLDivElement>(null);
  const highlightedRef = useRef("");

  useEffect(() => {
    const el = containerRef.current;
    if (!el || highlightedRef.current === safe) return;

    highlightedRef.current = safe;
    el.innerHTML = safe;

    el.querySelectorAll("[data-language]").forEach((block) => {
      const lang = block.getAttribute("data-language");
      if (lang && hljs.getLanguage(lang)) {
        const text = block.textContent ?? "";
        const result = hljs.highlight(text, { language: lang });
        block.innerHTML = result.value;
      }
    });
  }, [safe]);

  return (
    <div
      ref={containerRef}
      className="html-answer answer-content"
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
