import { useState, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import WordCount from "./WordCount";

interface HeadingInfo {
  id: string;
  level: number;
  title: string;
  content?: string;
}

interface EditorProps {
  onHeadingsUpdate: (headings: HeadingInfo[]) => void;
}

export default function Editor({ onHeadingsUpdate }: EditorProps) {
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("Untitled");
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const parseMarkdown = (text: string) => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = Array.from(text.matchAll(headingRegex));

    const headings: HeadingInfo[] = matches.map((match, index) => ({
      id: index.toString(),
      level: match[1].length,
      title: match[2],
    }));

    // Set the document title from the first h1 if it exists
    const firstH1 = headings.find((h) => h.level === 1);
    if (firstH1) {
      setFileName(firstH1.title);
    }

    return headings;
  };

  const handleContentChange = (value?: string) => {
    if (value === undefined) return;
    setContent(value);
    const newHeadings = parseMarkdown(value);
    setHeadings(newHeadings);
    onHeadingsUpdate(newHeadings);
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      setContent(text);
      const newHeadings = parseMarkdown(text);
      setHeadings(newHeadings);
      onHeadingsUpdate(newHeadings);
      setFileName(file.name.replace(/\.md$/, ""));
    } catch (error) {
      console.error("Error reading file:", error);
      alert("Error reading file. Please try again.");
    }
  };

  const handleOpenClick = () => {
    fileInputRef.current?.click();
  };

  // Update parent component with headings for outline
  useEffect(() => {
    // You can emit these headings to the parent component or use a state management solution
    console.log("Headings updated:", headings);
  }, [headings]);

  return (
    <div
      className="flex-1 h-screen overflow-auto bg-white"
      data-color-mode="light"
    >
      <div className="max-w-3xl mx-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="text-3xl font-mono focus:outline-none"
          />
          <button
            onClick={handleOpenClick}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-mono text-sm transition-colors"
          >
            Open File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <MDEditor
            value={content}
            onChange={handleContentChange}
            preview="edit"
            height={window.innerHeight - 250}
            className="w-full"
          />
        </div>

        <WordCount text={content} />
      </div>
    </div>
  );
}
