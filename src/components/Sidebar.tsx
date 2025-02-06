import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import OutlineSection from "./OutlineSection";

interface HeadingInfo {
  id: string;
  level: number;
  title: string;
  content?: string;
  isExpanded?: boolean;
}

interface SidebarProps {
  headings: HeadingInfo[];
  onHeadingClick?: (heading: HeadingInfo) => void;
}

export default function Sidebar({ headings, onHeadingClick }: SidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="w-80 border-r border-gray-200 h-screen p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-mono font-semibold">Outline</h2>
      </div>

      <div className="space-y-2">
        {headings.map((heading) => (
          <OutlineSection
            key={heading.id}
            title={heading.title}
            content={heading.content}
            isExpanded={expandedIds.has(heading.id)}
            onToggle={() => toggleExpand(heading.id)}
            onClick={() => onHeadingClick?.(heading)}
            indentLevel={heading.level - 1}
          />
        ))}
      </div>
    </div>
  );
}
