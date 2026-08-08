export type LessonBlock = (
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
    }
) & {
  /** Slug ổn định theo tiêu đề mục (sinh bởi convert-evergreen-lessons.mjs::slugifyVi),
   * dùng làm anchor deep-link — không đổi theo vị trí/thứ tự của block trong bài. */
  anchor: string;
};

export type LessonLevel = 'foundation' | 'intermediate' | 'advanced' | 'all';

export type Lesson = {
  slug: string;
  title: string;
  module: string;
  level: LessonLevel;
  shortTitle: string;
  summary: string;
  skill: string;
  duration: string;
  exercise: string;
  commonMistake: string;
  applyQuestions: string[];
  related: Array<{ label: string; href: string }>;
  /** Bài nền cần đọc trước — chỉ set ở bài `intermediate`/`advanced` thuộc một
   * chuỗi cơ bản→nâng cao có chủ ý (xem frontmatter `prerequisite:` trong
   * docs/evergreen). `null` nếu bài không thuộc chuỗi nào. */
  prerequisite: { label: string; href: string } | null;
  blocks: LessonBlock[];
};

export { lessons, getLesson } from './lessons.generated';
