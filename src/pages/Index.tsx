import { FileText } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarkdownEditor from "@/components/MarkdownEditor";
import MarkdownPreview from "@/components/MarkdownPreview";
import ControlPanel from "@/components/ControlPanel";
import DocumentStats from "@/components/DocumentStats";
import { useMarkdownConverter } from "@/hooks/useMarkdownConverter";

const Index = () => {
  const {
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
  } = useMarkdownConverter();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Markdown to PDF Converter - Fast, Flexible, and Free
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Create beautiful PDFs from your Markdown content
          </p>
          <p className="text-muted-foreground max-w-4xl mx-auto">
            Modern AI tools like ChatGPT and other chat interfaces let users export conversations in Markdown format with a single click. 
            This app takes that Markdown—along with any embedded HTML—and transforms it into clean, professional documents you can share, archive, or publish.
          </p>
        </div>

        {/* Control Panel */}
        <ControlPanel
          filename={settings.filename}
          onFilenameChange={(value) => updateSetting("filename", value)}
          orientation={settings.orientation}
          onOrientationChange={(value) => updateSetting("orientation", value)}
          pageSize={settings.pageSize}
          onPageSizeChange={(value) => updateSetting("pageSize", value)}
          theme={settings.theme}
          onThemeChange={(value) => updateSetting("theme", value)}
          showLineNumbers={settings.showLineNumbers}
          onLineNumbersChange={(value) => updateSetting("showLineNumbers", value)}
          showGutter={settings.showGutter}
          onGutterChange={(value) => updateSetting("showGutter", value)}
          onGeneratePDF={generatePDF}
          onLoadExample={loadExample}
          onCopy={copyToClipboard}
          onClear={clearContent}
          onExportHTML={exportHTML}
          onExportMarkdown={exportMarkdown}
          onPaste={pasteFromClipboard}
          onImportFile={importFile}
          onInsertImage={insertImage}
        />

        {/* Editor and Preview */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ minHeight: "500px" }}>
          {/* Editor */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold text-foreground">Markdown Editor</h2>
            </div>
            <div className="flex-1">
              <MarkdownEditor
                value={markdown}
                onChange={setMarkdown}
                showLineNumbers={settings.showLineNumbers}
                showGutter={settings.showGutter}
              />
              <div className="mt-2">
                <DocumentStats content={markdown} />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2 px-2">
              <div className="h-3 w-3 rounded-full bg-accent-foreground" />
              <h2 className="text-sm font-semibold text-foreground">Live Preview</h2>
            </div>
            <div id="markdown-preview" className="flex-1">
              <MarkdownPreview
                content={markdown || "*Start typing in the editor to see a preview...*"}
                theme={settings.theme}
              />
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Whether you're organizing ideas, preserving insights, or preparing content for clients, this tool makes it effortless.
          </p>
          <p className="text-muted-foreground mt-2">
            Don't know Markdown? Check out our{" "}
            <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Markdown Cheat Sheet
            </a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
