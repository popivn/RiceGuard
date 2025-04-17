"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DiseaseTreatment from "@/components/disease-treatment"

interface ResultsDisplayProps {
  loading: boolean
  results: any
  explanation: string
  loadingExplanation: boolean
  heatmapImage: string | null
  loadingHeatmap: boolean
  detectionImage: string | null
  loadingDetection: boolean
  combinedHeatmap: string | null
  loadingCombined: boolean
  preview: string | null
  t: any
}

export default function ResultsDisplay({
  loading,
  results,
  explanation,
  loadingExplanation,
  heatmapImage,
  loadingHeatmap,
  detectionImage,
  loadingDetection,
  combinedHeatmap,
  loadingCombined,
  preview,
  t,
}: ResultsDisplayProps) {
  // Helper function to get the appropriate color for disease status
  const getDiseaseStatusColor = (className: string) => {
    if (className === "healthy") return "text-green-600 dark:text-green-400"
    return "text-red-600 dark:text-red-400"
  }

  // Helper to determine if YOLO detection is empty
  const isEmptyYoloDetection = (results: any) => {
    return !results?.yolo_detections || results.yolo_detections.length === 0
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>{t("results.none")}</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="diagnosis">
      <TabsList className="w-full">
        <TabsTrigger value="diagnosis" className="flex-1">
          {t("results.diagnosis")}
        </TabsTrigger>
        <TabsTrigger value="detection" className="flex-1">
          {t("results.detection")}
        </TabsTrigger>
        <TabsTrigger value="heatmap" className="flex-1">
          {t("results.heatmap")}
        </TabsTrigger>
        <TabsTrigger value="combined" className="flex-1">
          {t("results.combined")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="diagnosis" className="space-y-4 mt-4">
        {isEmptyYoloDetection(results) ? (
          <div className="bg-muted p-4 rounded-lg">
            <h3 className="font-medium text-lg">
              {t("results.diagnosis")}:{" "}
              <span className="text-yellow-600 dark:text-yellow-400">{t("diagnosis.noDetection")}</span>
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{t("diagnosis.noDetectionExplanation")}</p>

            <div className="mt-4">
              <h3 className="font-medium mb-2">{t("diagnosis.details")}</h3>
              {loadingExplanation ? <Skeleton className="h-16 w-full" /> : <p className="text-sm">{explanation}</p>}
            </div>

            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-md text-sm">
              <p className="font-semibold">{t("diagnosis.warning")}</p>
              <p>{t("diagnosis.notAccurate")}</p>
              <p className="mt-2">{t("diagnosis.couldMean")}</p>
              <ul className="list-disc ml-5 mt-1">
                <li>{t("diagnosis.reason1")}</li>
                <li>{t("diagnosis.reason2")}</li>
                <li>{t("diagnosis.reason3")}</li>
              </ul>
              <p className="mt-2">{t("diagnosis.consult")}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium text-lg">
                {t("results.diagnosis")}:{" "}
                <span className={getDiseaseStatusColor(results.mobilenet_classification.class_name)}>
                  {results.mobilenet_classification.class_name}
                </span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t("diagnosis.confidence", { value: (results.mobilenet_classification.confidence * 100).toFixed(2) })}
              </p>
            </div>

            <div>
              <h3 className="font-medium mb-2">{t("diagnosis.details")}</h3>
              {loadingExplanation ? <Skeleton className="h-16 w-full" /> : <p className="text-sm">{explanation}</p>}
            </div>

            <DiseaseTreatment 
              disease={results.mobilenet_classification.class_name} 
              className="mt-6" 
            />
          </>
        )}
      </TabsContent>

      <TabsContent value="detection" className="mt-4">
        {loadingDetection ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Skeleton className="h-64 w-full rounded-lg" />
            <p className="mt-4 text-sm text-muted-foreground">{t("detection.processing")}</p>
          </div>
        ) : detectionImage ? (
          <div className="relative">
            <img
              src={detectionImage || "/placeholder.svg"}
              alt="YOLO Detection"
              className="w-full h-auto rounded-lg object-contain max-h-[400px]"
            />
            <div className="mt-2 text-sm text-muted-foreground">
              <p>{t("detection.boxes")}</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            {preview && <img src={preview || "/placeholder.svg"} alt="Lemon Leaf" className="w-full rounded-lg" />}
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
                  <p className="text-center font-medium">{t("detection.noAreas")}</p>
                </div>
              </div>
            )}
          </div>
        )}
        <p className="text-sm mt-2 text-muted-foreground">
          {!results?.yolo_detections || results.yolo_detections.length === 0
            ? t("detection.noPatterns")
            : t("detection.areasDetected", { count: results.yolo_detections.length })}
        </p>
      </TabsContent>

      <TabsContent value="heatmap" className="mt-4">
        <div className="text-center">
          <h3 className="font-medium mb-2">{t("heatmap.title")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("heatmap.explanation")}</p>

          {loadingHeatmap ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Skeleton className="h-64 w-full rounded-lg" />
              <p className="mt-4 text-sm text-muted-foreground">{t("heatmap.generating")}</p>
            </div>
          ) : heatmapImage ? (
            <div className="relative">
              <img
                src={heatmapImage || "/placeholder.svg"}
                alt="Grad-CAM Heatmap"
                className="w-full h-auto rounded-lg object-contain max-h-[400px]"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{t("heatmap.redAreas")}</p>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-8 rounded-lg text-center">
              <p className="text-muted-foreground">{t("heatmap.notAvailable")}</p>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="combined" className="mt-4">
        <div className="text-center">
          <h3 className="font-medium mb-2">{t("combined.title")}</h3>
          <p className="text-sm text-muted-foreground mb-4">{t("combined.explanation")}</p>

          {loadingCombined ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Skeleton className="h-64 w-full rounded-lg" />
              <p className="mt-4 text-sm text-muted-foreground">{t("combined.generating")}</p>
            </div>
          ) : combinedHeatmap ? (
            <div className="relative">
              <img
                src={combinedHeatmap || "/placeholder.svg"}
                alt="Combined Detection and Heatmap"
                className="w-full h-auto rounded-lg object-contain max-h-[400px]"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                <p>{t("combined.boxes")}</p>
              </div>
            </div>
          ) : (
            <div className="bg-muted p-8 rounded-lg text-center">
              <p className="text-muted-foreground">{t("combined.notAvailable")}</p>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}
