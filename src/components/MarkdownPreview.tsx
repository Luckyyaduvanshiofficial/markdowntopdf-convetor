import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight, dracula, nord, atomDark, materialDark, materialLight, vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
  content: string;
  theme: string;
}

const themeStyles: Record<string, string> = {
  classic: "prose prose-slate max-w-none dark:prose-invert",
  modern: "prose prose-zinc max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-p:text-base dark:prose-invert",
  minimal: "prose max-w-none prose-headings:font-light prose-p:font-light dark:prose-invert",
  dark: "prose prose-invert max-w-none",
  professional: "prose max-w-none prose-headings:text-primary prose-p:leading-relaxed prose-headings:font-semibold dark:prose-invert",
  playful: "prose max-w-none prose-headings:text-primary prose-p:text-base dark:prose-invert",
  academic: "prose prose-lg max-w-none prose-headings:font-serif prose-p:font-serif prose-p:text-justify dark:prose-invert",
  elegant: "prose max-w-none prose-headings:font-serif prose-headings:italic prose-p:font-serif dark:prose-invert",
  ocean: "prose max-w-none prose-headings:text-blue-600 prose-a:text-blue-500 prose-strong:text-blue-700 dark:prose-invert dark:prose-headings:text-blue-400",
  forest: "prose max-w-none prose-headings:text-emerald-700 prose-a:text-emerald-600 prose-strong:text-emerald-800 dark:prose-invert dark:prose-headings:text-emerald-400",
  sunset: "prose max-w-none prose-headings:text-orange-600 prose-a:text-amber-500 prose-strong:text-orange-700 dark:prose-invert dark:prose-headings:text-orange-400",
  royal: "prose max-w-none prose-headings:text-purple-700 prose-a:text-purple-600 prose-strong:text-purple-800 dark:prose-invert dark:prose-headings:text-purple-400",
  rose: "prose max-w-none prose-headings:text-rose-600 prose-a:text-pink-500 prose-strong:text-rose-700 dark:prose-invert dark:prose-headings:text-rose-400",
  monochrome: "prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 dark:prose-invert",
};

const themeWrapperStyles: Record<string, string> = {
  classic: "bg-card",
  modern: "bg-card",
  minimal: "bg-card",
  dark: "bg-gray-900 text-gray-100",
  professional: "bg-card",
  playful: "bg-gradient-to-br from-accent/30 to-primary/10",
  academic: "bg-amber-50/50 dark:bg-card",
  elegant: "bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800",
  ocean: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/50 dark:to-cyan-950/50",
  forest: "bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50",
  sunset: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/50 dark:to-amber-950/50",
  royal: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50",
  rose: "bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/50 dark:to-pink-950/50",
  monochrome: "bg-gray-50 dark:bg-gray-900",
};

const codeThemes: Record<string, typeof oneDark> = {
  classic: oneLight,
  modern: vscDarkPlus,
  minimal: vs,
  dark: oneDark,
  professional: oneLight,
  playful: dracula,
  academic: oneLight,
  elegant: nord,
  ocean: materialLight,
  forest: nord,
  sunset: atomDark,
  royal: dracula,
  rose: materialLight,
  monochrome: vs,
};

const MarkdownPreview = ({ content, theme }: MarkdownPreviewProps) => {
  const proseClass = themeStyles[theme] || themeStyles.classic;
  const wrapperClass = themeWrapperStyles[theme] || themeWrapperStyles.classic;
  const codeTheme = codeThemes[theme] || oneLight;

  return (
    <div className={`h-full overflow-auto p-6 rounded-lg border border-border ${wrapperClass}`}>
      <div className={proseClass}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isInline = !match && !className;
              
              return !isInline && match ? (
                <SyntaxHighlighter
                  style={codeTheme}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={`${className} bg-muted px-1.5 py-0.5 rounded text-sm`} {...props}>
                  {children}
                </code>
              );
            },
            img({ src, alt, ...props }) {
              return (
                <img
                  src={src}
                  alt={alt}
                  className="max-w-full h-auto rounded-lg shadow-md"
                  {...props}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownPreview;
