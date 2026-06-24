import { useState } from "react";
import { loadCommonBank } from "./storage/localStore";
import { Header } from "./components/Header";
import { CommonQuestionsView } from "./components/CommonQuestionsView";
import "./App.css";

export default function App() {
  const [commonCount, setCommonCount] = useState(
    () => loadCommonBank().questions.length
  );

  return (
    <div className="app">
      <Header commonCount={commonCount} />
      <CommonQuestionsView onCountChange={setCommonCount} />
    </div>
  );
}
