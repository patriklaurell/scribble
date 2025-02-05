import { useState } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import OutlineSection from "./OutlineSection";

interface OutlineItem {
  id: string;
  title: string;
  content?: string;
  isExpanded?: boolean;
}

export default function Sidebar() {
  const [outlineItems, setOutlineItems] = useState<OutlineItem[]>([
    { id: "1", title: "Why do we sleep?", isExpanded: true },
    { id: "2", title: "What causes us to sleep too much?", isExpanded: false },
    { id: "3", title: "Caffeine and sleep", content: "Caffeine has a half-life of 6-7 hours depending on you genetics...", isExpanded: true },
    { id: "4", title: "Blue light and circadian rhythm", isExpanded: false },
  ]);

  const toggleExpand = (id: string) => {
    setOutlineItems(items =>
      items.map(item =>
        item.id === id ? { ...item, isExpanded: !item.isExpanded } : item
      )
    );
  };

  return (
    <div className="w-80 border-r border-gray-200 h-screen p-4 bg-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-mono font-semibold">Outline</h2>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500">
              <path fill="currentColor" d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7zm0-2a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
            </svg>
          </button>
          <button className="p-1 hover:bg-gray-100 rounded">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-500">
              <path fill="currentColor" d="M11 7h2v2h-2V7zm0 4h2v6h-2v-6zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {outlineItems.map((item) => (
          <OutlineSection
            key={item.id}
            title={item.title}
            content={item.content}
            isExpanded={item.isExpanded}
            onToggle={() => toggleExpand(item.id)}
          />
        ))}
      </div>
      
      <button className="mt-4 flex items-center gap-2 text-accent hover:text-accent-hover transition-colors px-4 py-2 rounded-lg w-full">
        <Plus size={16} />
        <span className="font-mono text-sm">Create outline topic</span>
      </button>
    </div>
  );
}