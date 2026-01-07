import { FileText, Clock, Type, Hash } from "lucide-react";

interface DocumentStatsProps {
  content: string;
}

const DocumentStats = ({ content }: DocumentStatsProps) => {
  const words = content.trim() ? content.trim().split(/\s+/).filter(word => word.length > 0).length : 0;
  const characters = content.length;
  const charactersNoSpaces = content.replace(/\s/g, '').length;
  const lines = content ? content.split('\n').length : 0;
  
  // Average reading speed: 200-250 words per minute
  const readingTimeMinutes = Math.ceil(words / 200);
  const readingTime = readingTimeMinutes < 1 ? "< 1 min" : `${readingTimeMinutes} min`;

  return (
    <div className="flex flex-wrap items-center gap-4 px-3 py-2 bg-muted/50 rounded-lg border border-border text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Type className="h-3.5 w-3.5" />
        <span><strong className="text-foreground">{words.toLocaleString()}</strong> words</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Hash className="h-3.5 w-3.5" />
        <span><strong className="text-foreground">{characters.toLocaleString()}</strong> chars</span>
      </div>
      <div className="flex items-center gap-1.5">
        <FileText className="h-3.5 w-3.5" />
        <span><strong className="text-foreground">{lines.toLocaleString()}</strong> lines</span>
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        <span><strong className="text-foreground">{readingTime}</strong> read</span>
      </div>
    </div>
  );
};

export default DocumentStats;
