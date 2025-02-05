import { ChevronDown, ChevronRight } from "lucide-react";

interface OutlineSectionProps {
  title: string;
  content?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export default function OutlineSection({ title, content, isExpanded, onToggle }: OutlineSectionProps) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors text-left"
      >
        {isExpanded ? (
          <ChevronDown size={16} className="text-gray-400" />
        ) : (
          <ChevronRight size={16} className="text-gray-400" />
        )}
        <span className="font-mono text-sm">{title}</span>
      </button>
      
      {isExpanded && content && (
        <div className="px-4 py-2 text-sm text-gray-600 border-t bg-gray-50">
          {content}
        </div>
      )}
    </div>
  );
}