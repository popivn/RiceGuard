"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
  }

  const analyzeImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

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
    } catch (err) {
      console.error("Error details:", err)
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Chest X-Ray Analysis</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4">Upload X-Ray Image</h2>

            {!preview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag and drop or click to upload</p>
                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG</p>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  aria-label="Upload X-Ray image" 
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
              {loading ? "Analyzing..." : "Analyze Image"}
            </Button>

            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}
          </Card>
        </div>

        <div>
          <Card className="p-4 h-full">
            <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>

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
                    Diagnosis
                  </TabsTrigger>
                  <TabsTrigger value="detection" className="flex-1">
                    Detection
                  </TabsTrigger>
                  <TabsTrigger value="heatmap" className="flex-1">
                    Heatmap
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="diagnosis" className="space-y-4 mt-4">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="font-medium text-lg">
                      Diagnosis:{" "}
                      <span className={results.mobilenet_classification.class_name.includes("1") ? "text-red-600" : "text-green-600"}>
                        {results.mobilenet_classification.class_name.includes("1") ? "Pneumonia" : "Normal"}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Confidence: {(results.mobilenet_classification.confidence * 100).toFixed(2)}%
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Findings:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li className="text-sm">
                        {results.mobilenet_classification.class_name.includes("1") 
                          ? "Possible lung infiltrates detected" 
                          : "No significant findings detected"}
                      </li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="detection" className="mt-4">
                  <div className="relative">
                    {preview && <img src={preview || "/placeholder.svg"} alt="X-Ray" className="w-full rounded-lg" />}
                    {results.yolo_detections.map((box: any, index: number) => (
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
                    ))}
                  </div>
                  <p className="text-sm mt-2 text-gray-500">{results.yolo_detections.length} object(s) detected</p>
                </TabsContent>

                <TabsContent value="heatmap" className="mt-4">
                  {preview && (
                    <div>
                      <img
                        src={preview || "/placeholder.svg"}
                        alt="X-Ray"
                        className="w-full rounded-lg"
                      />
                      <p className="text-sm mt-2 text-gray-500">
                        X-Ray image (heatmap visualization not available)
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>Upload and analyze an image to see results</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}

