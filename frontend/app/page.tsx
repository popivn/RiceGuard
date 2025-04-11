"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLanguage } from "@/lib/i18n/language-context"
import { Globe, ArrowRight, Camera, BarChart2, ClipboardList, Brain } from 'lucide-react'
import Link from "next/link"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

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

export default function AboutPage() {
  const { t } = useLanguage()
  
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{t('app.title')}</h1>
          </div>
          <div className="flex gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-transparent dark:from-green-950/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">{t('app.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('app.description') || 'Advanced AI-powered lemon disease detection and diagnosis platform. Upload images of your lemon plants and get instant disease identification and treatment recommendations.'}
          </p>
          <Link href="/detect" passHref>
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              {t('upload.analyze')} <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Technology Features */}
      <section className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('technology.title') || 'Our Technology'}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Camera className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('technology.yolo.title') || 'YOLO Object Detection'}</h3>
            <p className="text-muted-foreground">{t('technology.yolo.description') || 'Precise identification of disease-affected areas with bounding boxes using YOLOv8 deep learning model.'}</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <Brain className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('technology.efficientnet.title') || 'EfficientNet Classification'}</h3>
            <p className="text-muted-foreground">{t('technology.efficientnet.description') || 'Accurate disease classification using an optimized EfficientNet model trained on thousands of lemon disease images.'}</p>
          </Card>
          
          <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('technology.gradcam.title') || 'Grad-CAM Visualization'}</h3>
            <p className="text-muted-foreground">{t('technology.gradcam.description') || 'Heatmap visualization showing which parts of the image influenced the AI\'s decision-making process.'}</p>
          </Card>
        </div>
      </section>
      
      {/* AI Performance */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">{t('performance.title') || 'AI Performance Metrics'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Brain className="h-5 w-5 mr-2 text-green-600" /> {t('performance.efficientnet.title') || 'EfficientNet Model Metrics'}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 pr-4">{t('performance.class') || 'Class'}</th>
                      <th className="text-right py-2 px-4">{t('performance.precision') || 'Precision'}</th>
                      <th className="text-right py-2 px-4">{t('performance.recall') || 'Recall'}</th>
                      <th className="text-right py-2 px-4">{t('performance.f1') || 'F1-Score'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 pr-4">{t('diseases.blackspot') || 'Black Spot'}</td>
                      <td className="text-right py-2 px-4">0.99</td>
                      <td className="text-right py-2 px-4">0.94</td>
                      <td className="text-right py-2 px-4">0.97</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">{t('diseases.greening') || 'Greening'}</td>
                      <td className="text-right py-2 px-4">0.97</td>
                      <td className="text-right py-2 px-4">1.00</td>
                      <td className="text-right py-2 px-4">0.98</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">{t('diseases.healthy') || 'Healthy'}</td>
                      <td className="text-right py-2 px-4">1.00</td>
                      <td className="text-right py-2 px-4">0.98</td>
                      <td className="text-right py-2 px-4">0.99</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 pr-4">{t('diseases.scab') || 'Scab'}</td>
                      <td className="text-right py-2 px-4">0.97</td>
                      <td className="text-right py-2 px-4">1.00</td>
                      <td className="text-right py-2 px-4">0.98</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">{t('diseases.thrips') || 'Thrips'}</td>
                      <td className="text-right py-2 px-4">0.99</td>
                      <td className="text-right py-2 px-4">0.99</td>
                      <td className="text-right py-2 px-4">0.99</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t font-semibold">
                      <td className="py-2 pr-4">{t('performance.accuracy') || 'Accuracy'}</td>
                      <td className="text-right py-2 px-4" colSpan={3}>0.98</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </Card>
            
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Camera className="h-5 w-5 mr-2 text-green-600" /> {t('performance.yolo.title') || 'YOLO Model Metrics'}
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">mAP50</p>
                    <p className="text-2xl font-bold text-green-600">0.94</p>
                    <p className="text-xs text-muted-foreground">{t('performance.map50.description') || 'Mean Average Precision at 50% IoU'}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">mAP50-95</p>
                    <p className="text-2xl font-bold text-green-600">0.803</p>
                    <p className="text-xs text-muted-foreground">{t('performance.map50-95.description') || 'Mean Average Precision across IoUs'}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('performance.precision') || 'Precision'}</p>
                    <p className="text-2xl font-bold text-green-600">0.947</p>
                    <p className="text-xs text-muted-foreground">{t('performance.precision.description') || 'True Positives / All Detections'}</p>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('performance.recall') || 'Recall'}</p>
                    <p className="text-2xl font-bold text-green-600">0.85</p>
                    <p className="text-xs text-muted-foreground">{t('performance.recall.description') || 'True Positives / All Ground Truths'}</p>
                  </div>
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('performance.training.data') || 'Training Data'}</p>
                  <p className="text-lg font-semibold">{t('performance.training.images') || '1,971 Images'}</p>
                  <p className="text-lg font-semibold">{t('performance.training.instances') || '2,000 Disease Instances'}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6 text-foreground">{t('cta.title') || 'Ready to detect lemon diseases?'}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {t('cta.description') || 'Our AI-powered tools will help you quickly identify and treat diseases affecting your lemon plants.'}
        </p>
        <Link href="/detect" passHref>
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            {t('upload.analyze')} <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
            <h2 className="text-xl font-bold">{t('app.title')}</h2>
          </div>
          <p className="text-muted-foreground text-sm">{t('footer.credit') || 'Created by PoPi — Advancing lemon disease detection with AI'}</p>
        </div>
      </footer>
    </main>
  )
}
