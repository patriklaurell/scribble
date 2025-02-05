import { useState } from "react";
import WordCount from "./WordCount";

export default function Editor() {
  const [content, setContent] = useState("");

  return (
    <div className="flex-1 h-screen overflow-auto">
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-3xl font-mono focus:outline-none"
            defaultValue="Sleep essay"
          />
        </div>
        
        <div className="prose prose-lg max-w-none">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-[calc(100vh-200px)] font-mono text-lg resize-none focus:outline-none"
          />
        </div>
        
        <WordCount text={content} />
      </div>
    </div>
  );
}