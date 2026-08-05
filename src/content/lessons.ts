export type LessonBlock =
  | {
      type: 'principles';
      title: string;
      items: string[];
    }
  | {
      type: 'scenario';
      title: string;
      setup: string;
      decision: string;
      avoid: string;
    }
  | {
      type: 'checklist';
      title: string;
      items: string[];
    }
  | {
      type: 'drill';
      title: string;
      goal: string;
      steps: string[];
    }
  | {
      type: 'matrix';
      title: string;
      rows: Array<{ state: string; read: string; action: string }>;
    }
  | {
      type: 'concept';
      title: string;
      /** HTML render sẵn từ Markdown (nội dung do team kiểm soát) — pattern giống set18-types.ts::abilityHtmlVi. */
      html: string;
    }
  | {
      type: 'pitfalls';
      title: string;
      items: string[];
    };

export type Lesson = {
  slug: string;
  title: string;
  module: string;
  shortTitle: string;
  summary: string;
  skill: string;
  duration: string;
  exercise: string;
  commonMistake: string;
  applyQuestions: string[];
  related: Array<{ label: string; href: string }>;
  blocks: LessonBlock[];
};

export { lessons, getLesson } from './lessons.generated';
