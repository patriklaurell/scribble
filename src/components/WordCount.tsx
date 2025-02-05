interface WordCountProps {
  text: string;
}

export default function WordCount({ text }: WordCountProps) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-white border rounded-full px-4 py-2 shadow-sm">
      <span className="font-mono text-sm text-gray-500">{wordCount} words</span>
    </div>
  );
}