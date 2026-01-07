import { useState, useCallback, useEffect, useRef } from "react";
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

const STORAGE_KEY = "markdown-converter-content";
const SETTINGS_KEY = "markdown-converter-settings";

export const useMarkdownConverter = () => {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || "";
  });
  
  const [settings, setSettings] = useState<ConverterSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fall through to default
      }
    }
    return {
      filename: "document",
      orientation: "portrait",
      pageSize: "a4",
      theme: "professional",
      showLineNumbers: true,
      showGutter: false,
    };
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Autosave markdown content
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, markdown);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [markdown]);

  // Autosave settings
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

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
    localStorage.removeItem(STORAGE_KEY);
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

  const pasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      setMarkdown(prev => prev + text);
      toast.success("Pasted from clipboard!");
    } catch (err) {
      toast.error("Failed to paste from clipboard. Please allow clipboard access.");
    }
  }, []);

  const importFile = useCallback(() => {
    if (!fileInputRef.current) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".md,.txt,.markdown";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            setMarkdown(content);
            updateSetting("filename", file.name.replace(/\.(md|txt|markdown)$/, ""));
            toast.success(`Imported "${file.name}"`);
          };
          reader.readAsText(file);
        }
      };
      fileInputRef.current = input;
    }
    fileInputRef.current.click();
  }, [updateSetting]);

  const insertImage = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          const imageMarkdown = `\n![${file.name}](${base64})\n`;
          setMarkdown(prev => prev + imageMarkdown);
          toast.success(`Image "${file.name}" inserted!`);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }, []);

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
    img { max-width: 100%; height: auto; }
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

      // Build a printable clone of the *preview wrapper* (not the flex container),
      // otherwise `h-full` can collapse to 0 height and produce a blank PDF.
      const previewWrapper = (previewElement.firstElementChild as HTMLElement | null) ?? previewElement;
      const printableElement = previewWrapper.cloneNode(true) as HTMLElement;
      printableElement.classList.add("pdf-render-root");

      // Ensure the clone expands to full content height (no scrolling containers)
      const forceAutoLayout = (el: HTMLElement) => {
        el.classList.remove("h-full", "overflow-auto", "overflow-y-auto", "overflow-x-auto");
        el.style.height = "auto";
        el.style.maxHeight = "none";
        el.style.overflow = "visible";
      };

      forceAutoLayout(printableElement);
      printableElement.querySelectorAll<HTMLElement>(".h-full").forEach(forceAutoLayout);
      printableElement
        .querySelectorAll<HTMLElement>(".overflow-auto, .overflow-y-auto, .overflow-x-auto")
        .forEach(forceAutoLayout);

      // Page-break CSS (scoped to the cloned element only)
      const pdfStyle = document.createElement("style");
      pdfStyle.dataset.pdfStyle = "true";
      pdfStyle.textContent = `
        .pdf-render-root * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .pdf-render-root h1, .pdf-render-root h2, .pdf-render-root h3, .pdf-render-root h4, .pdf-render-root h5, .pdf-render-root h6 {
          page-break-after: avoid !important;
          break-after: avoid !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .pdf-render-root p, .pdf-render-root li, .pdf-render-root blockquote {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          orphans: 3;
          widows: 3;
        }
        .pdf-render-root table, .pdf-render-root pre, .pdf-render-root code, .pdf-render-root img {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .pdf-render-root tr {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .pdf-render-root thead {
          display: table-header-group;
        }
        .pdf-render-root .prose > * {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0.75rem !important;
        }
        .pdf-render-root .prose h1, .pdf-render-root .prose h2, .pdf-render-root .prose h3 {
          margin-top: 1rem !important;
          padding-top: 0.5rem !important;
        }
      `;
      document.head.appendChild(pdfStyle);

      // Temporarily add to DOM for rendering
      printableElement.style.position = "absolute";
      printableElement.style.left = "-9999px";
      printableElement.style.top = "0";
      printableElement.style.width = `${format[0] - 20}mm`;
      document.body.appendChild(printableElement);

      const options = {
        margin: [15, 15, 15, 15] as [number, number, number, number],
        filename: `${settings.filename}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          letterRendering: true,
          logging: false,
        },
        jsPDF: {
          unit: "mm" as const,
          format: format,
          orientation: settings.orientation as "portrait" | "landscape",
          compress: true,
        },
        pagebreak: {
          mode: ["avoid-all", "css", "legacy"],
          before: ".page-break-before",
          after: ".page-break-after",
          avoid: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "tr", "table", "pre", "blockquote", "img"],
        },
      };

      try {
        await html2pdf().set(options).from(printableElement).save();
      } finally {
        printableElement.remove();
        pdfStyle.remove();
      }
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
    pasteFromClipboard,
    importFile,
    insertImage,
    exportMarkdown,
    exportHTML,
    generatePDF,
  };
};
