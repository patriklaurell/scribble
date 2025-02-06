/** @jsxImportSource react */
import { createElement, type ReactElement } from "react";

export interface Editable {
  toMarkdown(): string;
  fromMarkdown(text: string): void;
}

export interface Previewable {
  getChildren(): Previewable[];
  preview(): ReactElement;
}

export class EssaySentence implements Editable, Previewable {
  constructor(public text: string) {}

  toMarkdown(): string {
    return this.text;
  }

  fromMarkdown(text: string): void {
    this.text = text.trim();
  }

  getChildren(): Previewable[] {
    return [];
  }

  preview(): ReactElement {
    return createElement("span", null, `${this.text} `);
  }
}

export class EssayParagraph implements Editable, Previewable {
  constructor(public id: string, public sentences: EssaySentence[] = []) {}

  toMarkdown(): string {
    return this.sentences.map((s) => s.toMarkdown()).join(" ");
  }

  getChildren(): Previewable[] {
    return this.sentences;
  }

  preview(): ReactElement {
    return createElement(
      "p",
      { className: "mb-4 leading-relaxed" },
      this.sentences.map((sentence, index) => sentence.preview())
    );
  }

  fromMarkdown(text: string): void {
    // Split into sentences using regex
    const sentenceRegex = /[^.!?]+(?:[.!?](?:[ \n]|$))/g;
    const sentences = text.match(sentenceRegex) || [text];

    this.sentences = sentences
      .filter((s) => s.trim())
      .map((s) => {
        const sentence = new EssaySentence(s.trim());
        return sentence;
      });
  }
}

export class EssayHeader implements Editable, Previewable {
  constructor(public text: string, public headerLevel: 1 | 2 | 3 | 4 | 5 | 6) {}

  toMarkdown(): string {
    return `${"#".repeat(this.headerLevel)} ${this.text}`;
  }

  getChildren(): Previewable[] {
    return [];
  }

  preview(): ReactElement {
    return createElement(`h${this.headerLevel}`, null, this.text);
  }

  fromMarkdown(text: string): void {
    const headingMatch = text.match(/^(#{1,6})\s+(.+)$/);
    this.text = headingMatch![2].trim();
    this.headerLevel = headingMatch![1].length as 1 | 2 | 3 | 4 | 5 | 6;
  }
}

export class EssaySection implements Editable, Previewable {
  constructor(
    public id: string,
    public header: EssayHeader,
    public paragraphs: EssayParagraph[] = []
  ) {}

  toMarkdown(): string {
    const headerMd = this.header.toMarkdown();
    const paragraphsMd = this.paragraphs
      .map((p) => p.toMarkdown())
      .join("\n\n");
    return `${headerMd}\n\n${paragraphsMd}`;
  }

  getChildren(): Previewable[] {
    return [this.header, ...this.paragraphs];
  }

  preview(): ReactElement {
    return createElement("div", { className: "space-y-4" }, [
      this.header.preview(),
      ...this.paragraphs.map((paragraph, index) => paragraph.preview()),
    ]);
  }

  fromMarkdown(text: string): void {
    const lines = text.split("\n");
    let currentParagraph = new EssayParagraph(String(0));
    this.paragraphs = [];

    lines.forEach((line, i) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        if (currentParagraph.sentences.length > 0) {
          this.paragraphs.push(currentParagraph);
          currentParagraph = new EssayParagraph(String(this.paragraphs.length));
        }
        return;
      }

      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headingMatch && i === 0) {
        this.header.fromMarkdown(line);
      } else {
        currentParagraph.fromMarkdown(line);
      }
    });

    if (currentParagraph.sentences.length > 0) {
      this.paragraphs.push(currentParagraph);
    }
  }
}

export class Essay implements Editable, Previewable {
  constructor(
    public title: string = "Untitled",
    public sections: EssaySection[] = []
  ) {}

  toMarkdown(): string {
    const titleMd = `# ${this.title}`;
    const sectionsMd = this.sections.map((s) => s.toMarkdown()).join("\n\n");
    return `${titleMd}\n\n${sectionsMd}`;
  }

  getChildren(): Previewable[] {
    return this.sections;
  }

  preview(): ReactElement {
    return createElement("div", { className: "space-y-8" }, [
      createElement("h1", null, this.title),
      ...this.sections.map((section, index) => section.preview()),
    ]);
  }

  fromMarkdown(text: string): void {
    const lines = text.split("\n");
    let currentSection: EssaySection | null = null;
    this.sections = [];
    let sectionText = "";

    lines.forEach((line, i) => {
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        // Save previous section if exists
        if (currentSection && sectionText) {
          currentSection.fromMarkdown(sectionText);
          this.sections.push(currentSection);
          sectionText = "";
        }

        const level = headingMatch[1].length;
        if (level === 1) {
          this.title = headingMatch[2].trim();
        } else {
          const header = new EssayHeader(
            headingMatch[2].trim(),
            level as 1 | 2 | 3 | 4 | 5 | 6
          );
          currentSection = new EssaySection(
            String(this.sections.length),
            header
          );
        }
      } else {
        if (currentSection) {
          sectionText += line + "\n";
        }
      }
    });

    // Save last section
    if (currentSection && sectionText) {
      currentSection.fromMarkdown(sectionText);
      this.sections.push(currentSection);
    }
  }
}
