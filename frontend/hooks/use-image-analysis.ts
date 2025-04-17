import { useState, useCallback } from "react"
import type React from "react"
import { generateExplanation, chatWithAssistant } from "../app/action/generate-explanation"

// Now we can use relative paths since Next.js will handle the proxy
// Removed the API_BASE_URL constant

export function useImageAnalysis(
  file: File | null,
  setHasNewResults: (value: boolean) => void,
  isChatOpen: boolean,
  chatEndRef: React.RefObject<HTMLDivElement>
) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [explanation, setExplanation] = useState("")
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [heatmapImage, setHeatmapImage] = useState<string | null>(null)
  const [loadingHeatmap, setLoadingHeatmap] = useState(false)
  const [detectionImage, setDetectionImage] = useState<string | null>(null)
  const [loadingDetection, setLoadingDetection] = useState(false)
  const [combinedHeatmap, setCombinedHeatmap] = useState<string | null>(null)
  const [loadingCombined, setLoadingCombined] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [chatInput, setChatInput] = useState("")
  const [isChatLoading, setIsChatLoading] = useState(false)

  const analyzeImage = useCallback(async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setResults(null)
    setExplanation("")
    setHeatmapImage(null)
    setDetectionImage(null)
    setCombinedHeatmap(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Send request to API through Next.js proxy
      const response = await fetch("/api/detect", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setResults(data)
      
      // Set hasNewResults to true if the chat isn't open
      if (!isChatOpen) {
        setHasNewResults(true)
      }

      // Generate explanation from server endpoint
      setLoadingExplanation(true)
      try {
        const diseaseName = data.mobilenet_classification?.class_name || "unknown"
        const explanationText = await generateExplanation(diseaseName)
        setExplanation(explanationText || "")
      } catch (err) {
        console.error("Failed to get explanation:", err)
      } finally {
        setLoadingExplanation(false)
      }

      // Generate heatmap
      setLoadingHeatmap(true)
      try {
        const heatmapResponse = await fetch("/api/detect_with_gradcam", {
          method: "POST",
          body: formData,
        })
        
        if (heatmapResponse.ok) {
          // For image responses, create a blob URL
          const blob = await heatmapResponse.blob()
          const heatmapUrl = URL.createObjectURL(blob)
          setHeatmapImage(heatmapUrl)
        }
      } catch (err) {
        console.error("Failed to generate heatmap:", err)
      } finally {
        setLoadingHeatmap(false)
      }

      // Generate detection image
      setLoadingDetection(true)
      try {
        const detectionResponse = await fetch("/api/detect_with_boxes", {
          method: "POST",
          body: formData,
        })
        
        if (detectionResponse.ok) {
          // For image responses, create a blob URL
          const blob = await detectionResponse.blob()
          const detectionUrl = URL.createObjectURL(blob)
          setDetectionImage(detectionUrl)
        }
      } catch (err) {
        console.error("Failed to generate detection image:", err)
      } finally {
        setLoadingDetection(false)
      }

      // Generate combined heatmap and detection
      setLoadingCombined(true)
      try {
        const combinedResponse = await fetch("/api/detect_with_combined_heatmap", {
          method: "POST",
          body: formData,
        })
        
        if (combinedResponse.ok) {
          // For image responses, create a blob URL
          const blob = await combinedResponse.blob()
          const combinedUrl = URL.createObjectURL(blob)
          setCombinedHeatmap(combinedUrl)
        }
      } catch (err) {
        console.error("Failed to generate combined view:", err)
      } finally {
        setLoadingCombined(false)
      }

    } catch (err) {
      console.error("Error analyzing image:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }, [file, isChatOpen, setHasNewResults])

  const handleChatSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!chatInput.trim() || !results) return

      // Add user message
      const userMessage = { role: "user", content: chatInput }
      setChatMessages((prev) => [...prev, userMessage])
      setChatInput("")
      setIsChatLoading(true)

      try {
        // Use server-side function to get the AI response
        const diseaseName = results.mobilenet_classification?.class_name || "unknown"
        const aiResponse = await chatWithAssistant(chatInput, diseaseName, explanation)
        
        setChatMessages((prev) => [...prev, { role: "assistant", content: aiResponse }])
        
        // Scroll to bottom of chat
        if (chatEndRef.current) {
          chatEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
      } catch (err) {
        console.error("Error in chat:", err)
        setChatMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, an error occurred. Please try again." },
        ])
      } finally {
        setIsChatLoading(false)
      }
    },
    [chatInput, results, explanation, chatEndRef]
  )

  return {
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
  }
} 