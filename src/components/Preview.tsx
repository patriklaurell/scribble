import React from "react";
import { Previewable } from "../lib/essay";

interface PreviewProps {
  previewable: Previewable;
}

export default function Preview({ previewable }: PreviewProps) {
  return (
    <div className="w-full min-h-[calc(100vh-250px)] p-8 border rounded-lg prose prose-slate max-w-none prose-headings:font-mono prose-h1:text-4xl prose-h2:text-2xl">
      {previewable.preview()}
    </div>
  );
}
