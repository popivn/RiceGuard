"use client"

import type React from "react"

import { Upload, X } from "lucide-react"

interface ImageUploaderProps {
  preview: string | null
  onFileChange: (file: File) => void
  onClearFile: () => void
  t: any
}

export default function ImageUploader({ preview, onFileChange, onClearFile, t }: ImageUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileChange(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      onFileChange(droppedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <>
      {!preview ? (
        <div
          className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:bg-muted/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById("file-upload")?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">{t("upload.drag")}</p>
          <p className="text-xs text-muted-foreground mt-1">{t("upload.supports")}</p>
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
            onClick={onClearFile}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            aria-label="Remove image"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  )
}
