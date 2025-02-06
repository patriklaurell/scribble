import { useState, useRef, useEffect } from "react";
import { useEssayStore } from "../store/essay";
import WordCount from "./WordCount";
import Preview from "./Preview";

interface HeadingInfo {
  id: string;
  level: number;
  title: string;
  lineNumber: number;
}

interface EditorProps {
  onHeadingsUpdate: (headings: HeadingInfo[]) => void;
}

export default function Editor({ onHeadingsUpdate }: EditorProps) {
  const { essay, loadMarkdown, getMarkdown } = useEssayStore();
  const [content, setContent] = useState(getMarkdown());
  const [isPreview, setIsPreview] = useState(true);
  const [filename, setFilename] = useState("Untitled");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update headings when essay changes
  useEffect(() => {
    const headings = essay.sections.map((section, index) => ({
      id: section.id,
      level: section.header.headerLevel! - 1,
      title: section.header.text,
      lineNumber: index,
    }));
    onHeadingsUpdate(headings);
  }, [essay, onHeadingsUpdate]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    loadMarkdown(newContent);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      loadMarkdown(text);
      setContent(getMarkdown());
      setFilename(file.name);
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    }
  };

  return (
    <div className="flex-1 h-screen overflow-auto bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <input
            type="text"
            value={filename}
            readOnly
            className="text-3xl font-mono focus:outline-none"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-sm transition-colors"
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-sm transition-colors"
            >
              Open File
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          {isPreview ? (
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="w-full h-[calc(100vh-250px)] font-mono text-lg p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <Preview previewable={essay} />
          )}
        </div>

        <WordCount text={content} />
      </div>
    </div>
  );
}
