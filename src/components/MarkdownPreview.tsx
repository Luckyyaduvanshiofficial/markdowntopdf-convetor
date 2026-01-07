import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPreviewProps {
  content: string;
  theme: string;
}

const themeStyles: Record<string, string> = {
  classic: "prose prose-slate max-w-none",
  modern: "prose prose-zinc max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-base",
  minimal: "prose max-w-none prose-headings:font-light prose-p:font-light",
  dark: "prose prose-invert max-w-none bg-secondary text-secondary-foreground",
  professional: "prose max-w-none prose-headings:text-primary prose-p:leading-relaxed prose-headings:font-semibold",
  playful: "prose max-w-none prose-headings:text-primary prose-p:text-base",
  academic: "prose prose-lg max-w-none prose-headings:font-serif prose-p:font-serif prose-p:text-justify",
  elegant: "prose max-w-none prose-headings:font-serif prose-headings:italic prose-p:font-serif",
};

const themeWrapperStyles: Record<string, string> = {
  classic: "bg-card",
  modern: "bg-card",
  minimal: "bg-card",
  dark: "bg-secondary",
  professional: "bg-card",
  playful: "bg-accent",
  academic: "bg-card",
  elegant: "bg-card",
};

const MarkdownPreview = ({ content, theme }: MarkdownPreviewProps) => {
  const proseClass = themeStyles[theme] || themeStyles.classic;
  const wrapperClass = themeWrapperStyles[theme] || themeWrapperStyles.classic;

  return (
    <div className={`h-full overflow-auto p-6 rounded-lg border border-border ${wrapperClass}`}>
      <div className={proseClass}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPreview;
