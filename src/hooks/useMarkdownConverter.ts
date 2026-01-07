import { useState, useCallback } from "react";
import { toast } from "sonner";
import { exampleMarkdown } from "@/lib/exampleMarkdown";

interface ConverterSettings {
  filename: string;
  orientation: string;
  pageSize: string;
  theme: string;
  showLineNumbers: boolean;
  showGutter: boolean;
}

export const useMarkdownConverter = () => {
  const [markdown, setMarkdown] = useState("");
  const [settings, setSettings] = useState<ConverterSettings>({
    filename: "document",
    orientation: "portrait",
    pageSize: "a4",
    theme: "professional",
    showLineNumbers: true,
    showGutter: false,
  });

  const updateSetting = useCallback(<K extends keyof ConverterSettings>(
    key: K,
    value: ConverterSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const loadExample = useCallback(() => {
    setMarkdown(exampleMarkdown);
    toast.success("Example loaded successfully!");
  }, []);

  const clearContent = useCallback(() => {
    setMarkdown("");
    toast.success("Content cleared");
  }, []);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  }, [markdown]);

  const exportMarkdown = useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${settings.filename}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Markdown file downloaded!");
  }, [markdown, settings.filename]);

  const exportHTML = useCallback(() => {
    const previewElement = document.getElementById("markdown-preview");
    if (!previewElement) {
      toast.error("Preview not found");
      return;
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${settings.filename}</title>
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
    h1, h2, h3, h4, h5, h6 { margin-top: 1.5em; margin-bottom: 0.5em; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
    blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 1rem; color: #666; }
  </style>
</head>
<body>
${previewElement.innerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${settings.filename}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML file downloaded!");
  }, [settings.filename]);

  const generatePDF = useCallback(async () => {
    const previewElement = document.getElementById("markdown-preview");
    if (!previewElement) {
      toast.error("Preview not found");
      return;
    }

    if (!markdown.trim()) {
      toast.error("Please add some content first");
      return;
    }

    toast.loading("Generating PDF...");

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      
      const pageSizes: Record<string, [number, number]> = {
        a4: [210, 297],
        letter: [215.9, 279.4],
        legal: [215.9, 355.6],
        a3: [297, 420],
        a5: [148, 210],
      };

      const [width, height] = pageSizes[settings.pageSize] || pageSizes.a4;
      const format: [number, number] = settings.orientation === "landscape" ? [height, width] : [width, height];

      const options = {
        margin: 10,
        filename: `${settings.filename}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { 
          unit: "mm" as const, 
          format: format,
          orientation: settings.orientation as "portrait" | "landscape"
        },
      };

      await html2pdf().set(options).from(previewElement).save();
      toast.dismiss();
      toast.success("PDF generated successfully!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to generate PDF");
      console.error(err);
    }
  }, [markdown, settings]);

  return {
    markdown,
    setMarkdown,
    settings,
    updateSetting,
    loadExample,
    clearContent,
    copyToClipboard,
    exportMarkdown,
    exportHTML,
    generatePDF,
  };
};
