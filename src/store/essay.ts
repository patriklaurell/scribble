import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Essay } from "../lib/essay";

interface EssayStore {
  essay: Essay;
  loadMarkdown: (markdown: string) => void;
  getMarkdown: () => string;
}

export const useEssayStore = create<EssayStore>()(
  devtools(
    (set, get) => ({
      essay: new Essay(),

      loadMarkdown: (markdown: string) => {
        const essay = new Essay();
        essay.fromMarkdown(markdown);
        console.log("Essay structure:", {
          title: essay.title,
          sections: essay.sections.map((section) => ({
            id: section.id,
            header: section.header,
            paragraphs: section.paragraphs.map((p) => ({
              id: p.id,
              sentences: p.sentences.map((s) => ({
                text: s.text,
              })),
            })),
          })),
        });
        set({ essay }, false, "loadMarkdown");
      },

      getMarkdown: () => {
        return get().essay.toMarkdown();
      },
    }),
    {
      name: "Essay Store",
      serialize: {
        options: {
          circular: true,
          map: true,
        },
      },
    }
  )
);
