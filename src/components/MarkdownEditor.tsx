import { useRef, useEffect } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  showLineNumbers: boolean;
  showGutter: boolean;
}

const MarkdownEditor = ({ value, onChange, showLineNumbers, showGutter }: MarkdownEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  
  const lines = value.split('\n');
  const lineCount = lines.length;

  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('scroll', handleScroll);
      return () => textarea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="flex h-full bg-card rounded-lg border border-border overflow-hidden">
      {showLineNumbers && (
        <div 
          ref={lineNumbersRef}
          className="flex flex-col bg-muted/50 text-muted-foreground text-sm font-mono py-3 px-2 select-none overflow-hidden border-r border-border"
          style={{ minWidth: '3rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-right leading-6 h-6">
              {i + 1}
            </div>
          ))}
        </div>
      )}
      {showGutter && (
        <div className="w-2 bg-primary/10 border-r border-border" />
      )}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 p-3 bg-transparent text-foreground font-mono text-sm resize-none focus:outline-none leading-6"
        placeholder="Enter your Markdown here..."
        spellCheck={false}
      />
    </div>
  );
};

export default MarkdownEditor;
