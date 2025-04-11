"use client"

import { Button } from "@/components/ui/button"
import { FileDown, Printer } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"
import { useState } from "react"

interface PDFExportButtonProps {
  resultsData: any
  explanation: string
  imageDataURL: string | null
}

export function PDFExportButton({ resultsData, explanation, imageDataURL }: PDFExportButtonProps) {
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