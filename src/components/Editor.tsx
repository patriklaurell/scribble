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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex-1 h-screen overflow-hidden bg-white">
      <div className="h-full flex flex-col max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
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
              onClick={() => {
                const blob = new Blob([content], { type: "text/markdown" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-sm transition-colors"
            >
              Save
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

        <div className="prose prose-lg max-w-none flex-1 overflow-auto">
          {isPreview ? (
            <Preview
              previewable={essay}
              onClick={() => {
                setIsPreview(false);
                setTimeout(() => textareaRef.current?.focus(), 0);
              }}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              onBlur={() => setIsPreview(true)}
              placeholder="Start writing..."
              className="w-full h-full font-mono text-lg p-4 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>

        <div className="mt-4">
          <WordCount text={content} />
        </div>
      </div>
    </div>
  );
}
