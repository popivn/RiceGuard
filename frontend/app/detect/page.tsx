"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Upload, X, Send, Bot, Loader2, MessageCircle, FileDown, Printer, Globe, ArrowLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateExplanation, chatWithAssistant } from "../action/generate-explanation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Simple inline language switcher component
function LanguageSwitcher() {
  const { language, changeLanguage, availableLanguages } = useLanguage()
  
  const languageNames: Record<string, string> = {
    en: "English",
    vi: "Tiếng Việt"
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={lang === language ? "font-bold bg-accent" : ""}
          >
            {languageNames[lang] || lang}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// PDF Export Button component
function PDFExportButton({ resultsData, explanation, imageDataURL }: {
  resultsData: any,
  explanation: string,
  imageDataURL: string | null
}) {
  const { t } = useLanguage()
  const [isPrinting, setIsPrinting] = useState(false)
  
  // Helper to format current date
  const formatDate = () => {
    const now = new Date()
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(now)
  }
  
  // Generate printable content
  const preparePrint = () => {
    setIsPrinting(true)
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups for this website')
      setIsPrinting(false)
      return
    }
    
    // Determine disease status
    const isEmptyDetection = !resultsData?.yolo_detections || resultsData.yolo_detections.length === 0
    const diagnosisName = isEmptyDetection 
      ? t('diagnosis.noDetection')
      : resultsData?.mobilenet_classification?.class_name || 'Unknown'
    const confidence = isEmptyDetection 
      ? '0' 
      : ((resultsData?.mobilenet_classification?.confidence || 0) * 100).toFixed(2)
      
    // Write HTML content to the print window
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${t('export.title')}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1, h2, h3 {
            color: #2e7d32;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .image-container {
            text-align: center;
            margin: 20px 0;
          }
          img {
            max-width: 100%;
            max-height: 300px;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 5px;
          }
          .info-box {
            background-color: #f5f5f5;
            border-left: 4px solid #2e7d32;
            padding: 15px;
            margin: 20px 0;
          }
          .warning-box {
            background-color: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 15px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 30px;
            border-top: 1px solid #eee;
            padding-top: 10px;
            font-size: 12px;
            text-align: center;
            color: #757575;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          table, th, td {
            border: 1px solid #ddd;
          }
          th, td {
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          @media print {
            body {
              padding: 0;
              margin: 0;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${t('export.title')}</h1>
          <p>${t('export.date', { date: formatDate() })}</p>
        </div>
        
        <div class="info-box">
          <h2>${diagnosisName}</h2>
          ${!isEmptyDetection ? `<p>${t('diagnosis.confidence', { value: confidence })}</p>` : ''}
        </div>
        
        <div class="image-container">
          ${imageDataURL ? `<img src="${imageDataURL}" alt="Analyzed Image" />` : '<p>No image available</p>'}
        </div>
        
        <h3>${t('diagnosis.details')}</h3>
        <p>${explanation}</p>
        
        ${isEmptyDetection ? `
        <div class="warning-box">
          <p><strong>${t('diagnosis.warning')}</strong> ${t('diagnosis.notAccurate')}</p>
          <p>${t('diagnosis.couldMean')}</p>
          <ul>
            <li>${t('diagnosis.reason1')}</li>
            <li>${t('diagnosis.reason2')}</li>
            <li>${t('diagnosis.reason3')}</li>
          </ul>
          <p>${t('diagnosis.consult')}</p>
        </div>
        ` : ''}
        
        ${!isEmptyDetection && resultsData?.yolo_detections ? `
        <h3>${t('results.detection')}</h3>
        <table>
          <tr>
            <th>Area</th>
            <th>Classification</th>
            <th>Confidence</th>
          </tr>
          ${resultsData.yolo_detections.map((det: any, i: number) => `
          <tr>
            <td>Area ${i+1}</td>
            <td>${det.class_name}</td>
            <td>${(det.confidence * 100).toFixed(2)}%</td>
          </tr>
          `).join('')}
        </table>
        ` : ''}
        
        <div class="footer">
          <p>Generated by Lemon Disease Detection System</p>
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 20px; background: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer;">
            ${t('export.print')}
          </button>
        </div>
      </body>
      </html>
    `)
    
    printWindow.document.close()
    setIsPrinting(false)
  }
  
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-1"
      onClick={preparePrint}
      disabled={isPrinting || !resultsData}
    >
      {isPrinting ? <Printer className="h-4 w-4 animate-spin" /> : <FileDown className="h-4 w-4" />}
      <span>{t('export.pdf')}</span>
    </Button>
  )
}

export default function DetectPage() {
  const { t } = useLanguage()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [explanation, setExplanation] = useState<string>("")
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null)
  const [loadingHeatmap, setLoadingHeatmap] = useState(false)
  const [detectionImage, setDetectionImage] = useState<string | null>(null)
  const [loadingDetection, setLoadingDetection] = useState(false)
  const [combinedHeatmap, setCombinedHeatmap] = useState<string | null>(null)
  const [loadingCombined, setLoadingCombined] = useState(false)
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{role: string, content: string}>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [hasNewResults, setHasNewResults] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResults(null)
      setError(null)
      setExplanation("")
      setHeatmapImage(null)
      setDetectionImage(null)
      setCombinedHeatmap(null)
      setChatMessages([])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      setFile(droppedFile)
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(droppedFile)
      setResults(null)
      setError(null)
      setExplanation("")
      setHeatmapImage(null)
      setDetectionImage(null)
      setCombinedHeatmap(null)
      setChatMessages([])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const clearFile = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setError(null)
    setExplanation("")
    setHeatmapImage(null)
    setDetectionImage(null)
    setCombinedHeatmap(null)
    setChatMessages([])
  }

  const analyzeImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setExplanation("")
    setHeatmapImage(null)
    setDetectionImage(null)
    setCombinedHeatmap(null)
    setChatMessages([])

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        console.error(`Server error: ${response.status}`)
        const errorText = await response.text()
        console.error("Response:", errorText)
        throw new Error(`Server responded with ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("API Response data:", data)

      // Validate response format
      if (!data.mobilenet_classification) {
        console.error("Invalid response format - missing mobilenet_classification:", data)
        throw new Error("Invalid response format from server")
      }

      setResults(data)
      
      // After successful analysis, fetch the visualization images
      fetchHeatmap()
      fetchDetectionImage()
      fetchCombinedHeatmap()
    } catch (err) {
      console.error("Error details:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  const fetchHeatmap = async () => {
    if (!file) return

    setLoadingHeatmap(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect_with_gradcam`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch heatmap: ${response.status}`)
      }

      // Get the response as a blob
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setHeatmapImage(imageUrl)
    } catch (err) {
      console.error("Error fetching heatmap:", err)
      // Don't set an error message here to avoid disrupting the main flow
    } finally {
      setLoadingHeatmap(false)
    }
  }

  const fetchDetectionImage = async () => {
    if (!file) return

    setLoadingDetection(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect_with_boxes`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch detection image: ${response.status}`)
      }

      // Get the response as a blob
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setDetectionImage(imageUrl)
    } catch (err) {
      console.error("Error fetching detection image:", err)
    } finally {
      setLoadingDetection(false)
    }
  }

  const fetchCombinedHeatmap = async () => {
    if (!file) return

    setLoadingCombined(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/detect_with_combined_heatmap`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch combined visualization: ${response.status}`)
      }

      // Get the response as a blob
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setCombinedHeatmap(imageUrl)
    } catch (err) {
      console.error("Error fetching combined visualization:", err)
    } finally {
      setLoadingCombined(false)
    }
  }

  // Helper function to get the appropriate color for disease status
  const getDiseaseStatusColor = (className: string) => {
    if (className === "healthy") return "text-green-600 dark:text-green-400"
    return "text-red-600 dark:text-red-400"
  }

  // Helper to determine if YOLO detection is empty
  const isEmptyYoloDetection = (results: any) => {
    return !results?.yolo_detections || results.yolo_detections.length === 0;
  }

  // Fetch explanation for the detected disease
  useEffect(() => {
    const fetchExplanation = async () => {
      if (!results) return;
      
      setLoadingExplanation(true);
      
      try {
        let diagnosisName;
        
        if (isEmptyYoloDetection(results)) {
          diagnosisName = "no detection";
        } else {
          diagnosisName = results.mobilenet_classification.class_name;
        }
        
        const explanationText = await generateExplanation(diagnosisName);
        setExplanation(explanationText);
      } catch (error) {
        console.error("Error fetching explanation:", error);
      } finally {
        setLoadingExplanation(false);
      }
    };
    
    fetchExplanation();
  }, [results]);
  
  // Scroll to bottom of chat when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);
  
  // Set notification indicator when new results are available
  useEffect(() => {
    if (results && !isChatOpen) {
      setHasNewResults(true);
    }
  }, [results, isChatOpen]);
  
  // Clear notification when chat is opened
  useEffect(() => {
    if (isChatOpen) {
      setHasNewResults(false);
    }
  }, [isChatOpen]);

  // Handle chat submission
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!chatInput.trim() || isChatLoading) return
    
    const userMessage = chatInput.trim()
    setChatInput("")
    
    // Add user message to chat
    setChatMessages(prev => [...prev, { role: "user", content: userMessage }])
    
    setIsChatLoading(true)
    
    try {
      // Get disease name from results
      let diseaseName = "unknown"
      if (results) {
        if (isEmptyYoloDetection(results)) {
          diseaseName = "no detection"
        } else {
          diseaseName = results.mobilenet_classification.class_name
        }
      }
      
      // Call the chat API
      const response = await chatWithAssistant(userMessage, diseaseName, explanation)
      
      // Add assistant response to chat
      setChatMessages(prev => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error in chat:", error)
      setChatMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm sorry, I encountered an error processing your request. Please try again." 
      }])
    } finally {
      setIsChatLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-6 px-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="ghost" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('app.title')}
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
            <h2 className="text-xl font-semibold mb-4">{t('app.upload')}</h2>

            {!preview ? (
              <div
                className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">{t('upload.drag')}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('upload.supports')}</p>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  aria-label="Upload lemon leaf image"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={preview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-auto rounded-lg object-contain max-h-[400px]"
                />
                <button
                  onClick={clearFile}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  aria-label="Remove image"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <Button className="w-full mt-4" disabled={!file || loading} onClick={analyzeImage}>
              {loading ? t('upload.analyzing') : t('upload.analyze')}
            </Button>

            {error && <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
          </Card>
        </div>

        <div>
          <Card className="p-4 h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{t('app.results')}</h2>
              {results && (
                <PDFExportButton 
                  resultsData={results} 
                  explanation={explanation} 
                  imageDataURL={preview}
                />
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-40 w-full" />
              </div>
            ) : results ? (
              <Tabs defaultValue="diagnosis">
                <TabsList className="w-full">
                  <TabsTrigger value="diagnosis" className="flex-1">
                    {t('results.diagnosis')}
                  </TabsTrigger>
                  <TabsTrigger value="detection" className="flex-1">
                    {t('results.detection')}
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" className="flex-1">
                    {t('results.heatmap')}
                  </TabsTrigger>
                  <TabsTrigger value="combined" className="flex-1">
                    {t('results.combined')}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diagnosis" className="space-y-4 mt-4">
                  {isEmptyYoloDetection(results) ? (
                    <div className="bg-muted p-4 rounded-lg">
                      <h3 className="font-medium text-lg">
                        {t('results.diagnosis')}: <span className="text-yellow-600 dark:text-yellow-400">{t('diagnosis.noDetection')}</span>
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t('diagnosis.noDetectionExplanation')}
                      </p>

                      <div className="mt-4">
                        <h3 className="font-medium mb-2">{t('diagnosis.details')}</h3>
                        {loadingExplanation ? (
                          <Skeleton className="h-16 w-full" />
                        ) : (
                          <p className="text-sm">{explanation}</p>
                        )}
                      </div>

                      <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md text-sm">
                        <p className="font-semibold">{t('diagnosis.warning')}</p>
                        <p>
                          {t('diagnosis.notAccurate')}
                        </p>
                        <p className="mt-2">{t('diagnosis.couldMean')}</p>
                        <ul className="list-disc ml-5 mt-1">
                          <li>{t('diagnosis.reason1')}</li>
                          <li>{t('diagnosis.reason2')}</li>
                          <li>{t('diagnosis.reason3')}</li>
                        </ul>
                        <p className="mt-2">{t('diagnosis.consult')}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-muted p-4 rounded-lg">
                        <h3 className="font-medium text-lg">
                          {t('results.diagnosis')}:{" "}
                          <span className={getDiseaseStatusColor(results.mobilenet_classification.class_name)}>
                            {results.mobilenet_classification.class_name}
                          </span>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t('diagnosis.confidence', { value: (results.mobilenet_classification.confidence * 100).toFixed(2) })}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-medium mb-2">{t('diagnosis.details')}</h3>
                        {loadingExplanation ? (
                          <Skeleton className="h-16 w-full" />
                        ) : (
                          <p className="text-sm">{explanation}</p>
                        )}
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="detection" className="mt-4">
                  {loadingDetection ? (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Skeleton className="h-64 w-full rounded-lg" />
                      <p className="mt-4 text-sm text-muted-foreground">{t('detection.processing')}</p>
                    </div>
                  ) : detectionImage ? (
                    <div className="relative">
                      <img 
                        src={detectionImage || "/placeholder.svg"} 
                        alt="YOLO Detection" 
                        className="w-full h-auto rounded-lg object-contain max-h-[400px]" 
                      />
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>{t('detection.boxes')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      {preview && (
                        <img src={preview || "/placeholder.svg"} alt="Lemon Leaf" className="w-full rounded-lg" />
                      )}
                      {results?.yolo_detections && results.yolo_detections.length > 0 ? (
                        results.yolo_detections.map((box: any, index: number) => (
                          <div
                            key={index}
                            className="absolute border-2 border-yellow-500 rounded-sm flex items-center justify-center"
                            style={{
                              left: `${box.box[0]}%`,
                              top: `${box.box[1]}%`,
                              width: `${box.box[2] - box.box[0]}%`,
                              height: `${box.box[3] - box.box[1]}%`,
                            }}
                          >
                            <span className="bg-yellow-500 text-xs text-black px-1 absolute -top-5 left-0">
                              {box.class_name} ({(box.confidence * 100).toFixed(0)}%)
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                          <div className="bg-card p-4 rounded-md shadow-md">
                            <p className="text-center font-medium">{t('detection.noAreas')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-sm mt-2 text-muted-foreground">
                    {!results?.yolo_detections || results.yolo_detections.length === 0
                      ? t('detection.noPatterns')
                      : t('detection.areasDetected', { count: results.yolo_detections.length })}
                  </p>
                </TabsContent>

                <TabsContent value="heatmap" className="mt-4">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">{t('heatmap.title')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('heatmap.explanation')}
                    </p>
                    
                    {loadingHeatmap ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <p className="mt-4 text-sm text-muted-foreground">{t('heatmap.generating')}</p>
                      </div>
                    ) : heatmapImage ? (
                      <div className="relative">
                        <img 
                          src={heatmapImage || "/placeholder.svg"} 
                          alt="Grad-CAM Heatmap" 
                          className="w-full h-auto rounded-lg object-contain max-h-[400px]" 
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>{t('heatmap.redAreas')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted p-8 rounded-lg text-center">
                        <p className="text-muted-foreground">{t('heatmap.notAvailable')}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="combined" className="mt-4">
                  <div className="text-center">
                    <h3 className="font-medium mb-2">{t('combined.title')}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {t('combined.explanation')}
                    </p>
                    
                    {loadingCombined ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Skeleton className="h-64 w-full rounded-lg" />
                        <p className="mt-4 text-sm text-muted-foreground">{t('combined.generating')}</p>
                      </div>
                    ) : combinedHeatmap ? (
                      <div className="relative">
                        <img 
                          src={combinedHeatmap || "/placeholder.svg"} 
                          alt="Combined Detection and Heatmap" 
                          className="w-full h-auto rounded-lg object-contain max-h-[400px]" 
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          <p>{t('combined.boxes')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-muted p-8 rounded-lg text-center">
                        <p className="text-muted-foreground">{t('combined.notAvailable')}</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <p>{t('results.none')}</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Floating Chat Button */}
      <div className="fixed bottom-4 right-4 z-50">
        {!isChatOpen ? (
          <div className="relative">
            <Button 
              onClick={() => setIsChatOpen(true)} 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-lg bg-green-600 hover:bg-green-700 transition-transform hover:scale-105"
            >
              <MessageCircle size={24} />
            </Button>
            {hasNewResults && (
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </div>
        ) : (
          <div className="bg-card text-card-foreground rounded-lg shadow-xl w-80 md:w-96 flex flex-col overflow-hidden border border-border animate-in zoom-in-90 slide-in-from-bottom-10 duration-200">
            <div className="bg-green-600 text-white p-3 flex justify-between items-center">
              <div className="flex items-center">
                <Bot size={20} className="mr-2" />
                <h2 className="font-medium">{t('app.assistant')}</h2>
              </div>
              <Button 
                onClick={() => setIsChatOpen(false)} 
                variant="ghost" 
                className="h-8 w-8 p-0 text-white hover:bg-green-700"
              >
                <X size={18} />
              </Button>
            </div>
            
            <ScrollArea className="p-3 h-80 flex-1">
              {chatMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-muted-foreground text-center p-4">
                  <div>
                    <Bot size={40} className="mx-auto mb-2 opacity-50" />
                    <p>{t('chat.startMessage')}</p>
                    
                    {results && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-medium">{t('chat.quickQuestions')}</p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setChatInput(t('chat.quickQuestion1', { disease: results.mobilenet_classification.class_name }));
                            }}
                          >
                            {t('chat.quickQuestion1Button')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setChatInput(t('chat.quickQuestion2', { disease: results.mobilenet_classification.class_name }));
                            }}
                          >
                            {t('chat.quickQuestion2Button')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setChatInput(t('chat.quickQuestion3', { disease: results.mobilenet_classification.class_name }));
                            }}
                          >
                            {t('chat.quickQuestion3Button')}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs"
                            onClick={() => {
                              setChatInput(t('chat.quickQuestion4', { disease: results.mobilenet_classification.class_name }));
                            }}
                          >
                            {t('chat.quickQuestion4Button')}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div 
                      key={index} 
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className={`${msg.role === 'user' ? 'ml-2' : 'mr-2'} h-8 w-8 ${msg.role === 'assistant' ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          {msg.role === 'assistant' ? <Bot size={16} /> : <div className="text-xs">You</div>}
                        </Avatar>
                        <div 
                          className={`p-3 rounded-lg ${
                            msg.role === 'user' 
                              ? 'bg-green-600 text-white rounded-tr-none' 
                              : 'bg-muted dark:bg-card border border-border rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start max-w-[80%]">
                        <Avatar className="mr-2 h-8 w-8 bg-green-100 dark:bg-green-900">
                          <Bot size={16} />
                        </Avatar>
                        <div className="p-3 rounded-lg bg-muted dark:bg-card border border-border rounded-tl-none">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}
            </ScrollArea>
            
            <div className="p-3 border-t border-border">
              <form onSubmit={handleChatSubmit} className="flex items-end gap-2">
                <Textarea 
                  placeholder={results ? t('chat.placeholder') : t('chat.analyzeFirst')} 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="resize-none min-h-[60px] bg-card dark:bg-card"
                  disabled={!results || isChatLoading}
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  className="h-[60px] w-[60px]"
                  disabled={!results || !chatInput.trim() || isChatLoading}
                >
                  {isChatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send />}
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 