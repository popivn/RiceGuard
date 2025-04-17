"use client"

import { useState, useRef } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"

import { LanguageSwitcher } from "@/components/language-switcher"
import { PDFExportButton } from "@/components/pdf-export-button"
import ImageUploader from "@/components/image-uploader"
import ResultsDisplay from "@/components/results-display"
import ChatInterface from "@/components/chat-interface"
import { useImageAnalysis } from "@/hooks/use-image-analysis"

export default function DetectPage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasNewResults, setHasNewResults] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const {
    loading,
    results,
    error,
    explanation,
    loadingExplanation,
    heatmapImage,
    loadingHeatmap,
    detectionImage,
    loadingDetection,
    combinedHeatmap,
    loadingCombined,
    chatMessages,
    setChatMessages,
    chatInput,
    setChatInput,
    isChatLoading,
    analyzeImage,
    handleChatSubmit,
  } = useImageAnalysis(file, setHasNewResults, isChatOpen, chatEndRef)

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(selectedFile)
    setChatMessages([])
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setChatMessages([])
  }

  return (
    <main className="container mx-auto py-6 px-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("app.title")}
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">{t("app.upload")}</h2>

            <ImageUploader preview={preview} onFileChange={handleFileChange} onClearFile={clearFile} t={t} />

            <Button className="w-full mt-4" disabled={!file || loading} onClick={() => analyzeImage()}>
              {loading ? t("upload.analyzing") : t("upload.analyze")}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
                {error}
              </div>
            )}
          </Card>
        </div>

        <div>
          <Card className="p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t("app.results")}</h2>
              {results && <PDFExportButton resultsData={results} explanation={explanation} imageDataURL={preview} />}
            </div>

            <ResultsDisplay
              loading={loading}
              results={results}
              explanation={explanation}
              loadingExplanation={loadingExplanation}
              heatmapImage={heatmapImage}
              loadingHeatmap={loadingHeatmap}
              detectionImage={detectionImage}
              loadingDetection={loadingDetection}
              combinedHeatmap={combinedHeatmap}
              loadingCombined={loadingCombined}
              preview={preview}
              t={t}
            />
          </Card>
        </div>
      </div>

      <ChatInterface
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        hasNewResults={hasNewResults}
        setHasNewResults={setHasNewResults}
        chatMessages={chatMessages}
        chatInput={chatInput}
        setChatInput={setChatInput}
        isChatLoading={isChatLoading}
        handleChatSubmit={handleChatSubmit}
        results={results}
        chatEndRef={chatEndRef}
        t={t}
      />
    </main>
  )
}
