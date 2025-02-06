import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";

interface HeadingInfo {
  id: string;
  level: number;
  title: string;
  lineNumber: number;
}

export default function Index() {
  const [headings, setHeadings] = useState<HeadingInfo[]>([]);

  const handleHeadingsUpdate = (newHeadings: HeadingInfo[]) => {
    setHeadings(newHeadings);
  };

  const handleHeadingClick = (heading: HeadingInfo) => {
    // TODO: Implement scrolling to section
    console.log("Clicked heading:", heading);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar headings={headings} onHeadingClick={handleHeadingClick} />
      <Editor onHeadingsUpdate={handleHeadingsUpdate} />
    </div>
  );
}
