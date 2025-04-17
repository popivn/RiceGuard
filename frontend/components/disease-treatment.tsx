"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n/language-context"

interface DiseaseTreatmentProps {
  disease: string
  className?: string
}

export default function DiseaseTreatment({ disease, className }: DiseaseTreatmentProps) {
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [preventionInfo, setPreventionInfo] = useState<string | null>(null)
  const [treatmentInfo, setTreatmentInfo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'prevention' | 'treatment' | null>(null)

  const fetchDiseaseInfo = async (type: 'prevention' | 'treatment') => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/disease-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          disease,
          type,
        }),
      })

      const data = await response.json()
      
      if (type === 'prevention') {
        setPreventionInfo(data.information)
        setActiveTab('prevention')
      } else {
        setTreatmentInfo(data.information)
        setActiveTab('treatment')
      }
    } catch (error) {
      console.error('Error fetching disease information:', error)
      
      // Fallback text if API fails
      if (type === 'prevention') {
        setPreventionInfo(t('diseases.fallbackPrevention'))
        setActiveTab('prevention')
      } else {
        setTreatmentInfo(t('diseases.fallbackTreatment'))
        setActiveTab('treatment')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevention = () => {
    if (!preventionInfo) {
      fetchDiseaseInfo('prevention')
    } else {
      setActiveTab('prevention')
    }
  }

  const handleTreatment = () => {
    if (!treatmentInfo) {
      fetchDiseaseInfo('treatment')
    } else {
      setActiveTab('treatment')
    }
  }

  return (
    <div className={`space-y-4 ${className || ''}`}>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={activeTab === 'prevention' ? "default" : "outline"}
          className="flex-1"
          onClick={handlePrevention}
          disabled={isLoading}
        >
          {t('diseases.prevention')}
        </Button>
        <Button 
          variant={activeTab === 'treatment' ? "default" : "outline"}
          className="flex-1"
          onClick={handleTreatment}
          disabled={isLoading}
        >
          {t('diseases.treatment')}
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center p-6">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
        </div>
      )}

      {activeTab === 'prevention' && preventionInfo && !isLoading && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t('diseases.preventionFor', { disease })}</h3>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {preventionInfo}
          </div>
        </Card>
      )}

      {activeTab === 'treatment' && treatmentInfo && !isLoading && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-2">{t('diseases.treatmentFor', { disease })}</h3>
          <div className="text-muted-foreground whitespace-pre-wrap">
            {treatmentInfo}
          </div>
        </Card>
      )}
    </div>
  )
} 