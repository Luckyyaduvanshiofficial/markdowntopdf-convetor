import { FileText, Download, Upload, Copy, Trash2, Code, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ControlPanelProps {
  filename: string;
  onFilenameChange: (name: string) => void;
  orientation: string;
  onOrientationChange: (value: string) => void;
  pageSize: string;
  onPageSizeChange: (value: string) => void;
  theme: string;
  onThemeChange: (value: string) => void;
  showLineNumbers: boolean;
  onLineNumbersChange: (value: boolean) => void;
  showGutter: boolean;
  onGutterChange: (value: boolean) => void;
  onGeneratePDF: () => void;
  onLoadExample: () => void;
  onCopy: () => void;
  onClear: () => void;
  onExportHTML: () => void;
  onExportMarkdown: () => void;
}

const themes = [
  { value: "classic", label: "Classic", icon: "📄" },
  { value: "modern", label: "Modern", icon: "🟩" },
  { value: "minimal", label: "Minimal", icon: "⚪" },
  { value: "dark", label: "Dark", icon: "🌙" },
  { value: "professional", label: "Professional (for resumes or reports)", icon: "👔" },
  { value: "playful", label: "Playful (for kids or creative writing)", icon: "🎨" },
  { value: "academic", label: "Academic (for papers or citations)", icon: "🎓" },
  { value: "elegant", label: "Elegant Serif (for literary documents)", icon: "📜" },
];

const ControlPanel = ({
  filename,
  onFilenameChange,
  orientation,
  onOrientationChange,
  pageSize,
  onPageSizeChange,
  theme,
  onThemeChange,
  showLineNumbers,
  onLineNumbersChange,
  showGutter,
  onGutterChange,
  onGeneratePDF,
  onLoadExample,
  onCopy,
  onClear,
  onExportHTML,
  onExportMarkdown,
}: ControlPanelProps) => {
  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Top Row - Main Actions */}
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={onGeneratePDF} className="gap-2">
          <FileText className="h-4 w-4" />
          Generate PDF
        </Button>
        <Button variant="outline" onClick={onLoadExample} className="gap-2">
          <Upload className="h-4 w-4" />
          Load Example
        </Button>
        
        <div className="flex items-center gap-4 ml-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="text-sm font-mono text-muted-foreground">123</span>
            <span className="text-sm">Line Numbers</span>
            <Switch
              checked={showLineNumbers}
              onCheckedChange={onLineNumbersChange}
            />
          </div>
          
          <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
            <span className="text-sm">↔</span>
            <span className="text-sm">Gutter</span>
            <Switch
              checked={showGutter}
              onCheckedChange={onGutterChange}
            />
          </div>
        </div>
      </div>

      {/* Second Row - Settings */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Label htmlFor="filename" className="text-sm font-medium whitespace-nowrap">
            Filename:
          </Label>
          <Input
            id="filename"
            value={filename}
            onChange={(e) => onFilenameChange(e.target.value)}
            className="w-40"
          />
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium whitespace-nowrap">Orientation:</Label>
          <Select value={orientation} onValueChange={onOrientationChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="portrait">Portrait</SelectItem>
              <SelectItem value="landscape">Landscape</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium whitespace-nowrap">Page Size:</Label>
          <Select value={pageSize} onValueChange={onPageSizeChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="letter">Letter</SelectItem>
              <SelectItem value="legal">Legal</SelectItem>
              <SelectItem value="a3">A3</SelectItem>
              <SelectItem value="a5">A5</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Third Row - Theme and Export */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Label className="text-sm font-medium">Theme</Label>
          <Select value={theme} onValueChange={onThemeChange}>
            <SelectTrigger className="w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  <span className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCopy} className="gap-2">
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          <Button variant="outline" size="sm" onClick={onClear} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button variant="outline" size="sm" onClick={onExportHTML} className="gap-2">
            <Code className="h-4 w-4" />
            HTML
          </Button>
          <Button variant="outline" size="sm" onClick={onExportMarkdown} className="gap-2">
            <FileDown className="h-4 w-4" />
            Markdown
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
