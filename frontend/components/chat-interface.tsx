"use client"

import type React from "react"
import { Bot, Loader2, MessageCircle, Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"

interface ChatInterfaceProps {
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
  hasNewResults: boolean
  setHasNewResults: (hasNew: boolean) => void
  chatMessages: Array<{ role: string; content: string }>
  chatInput: string
  setChatInput: (input: string) => void
  isChatLoading: boolean
  handleChatSubmit: (e: React.FormEvent) => Promise<void>
  results: any
  chatEndRef: React.RefObject<HTMLDivElement>
  t: any
}

export default function ChatInterface({
  isChatOpen,
  setIsChatOpen,
  hasNewResults,
  chatMessages,
  chatInput,
  setChatInput,
  isChatLoading,
  handleChatSubmit,
  results,
  chatEndRef,
  t,
}: ChatInterfaceProps) {
  if (!isChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
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
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl w-[320px] md:w-[450px] lg:w-[500px] flex flex-col overflow-hidden border border-border animate-in zoom-in-90 slide-in-from-bottom-10 duration-200 max-h-[85vh]">
        <div className="bg-green-600 text-white p-3 flex justify-between items-center">
          <div className="flex items-center">
            <Bot size={20} className="mr-2" />
            <h2 className="font-medium">{t("app.assistant")}</h2>
          </div>
          <Button
            onClick={() => setIsChatOpen(false)}
            variant="ghost"
            className="h-8 w-8 p-0 text-white hover:bg-green-700"
          >
            <X size={18} />
          </Button>
        </div>

        <ScrollArea className="p-3 flex-1 h-[50vh] max-h-[600px] min-h-[300px] overflow-y-auto">
          {chatMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-center p-4">
              <div>
                <Bot size={40} className="mx-auto mb-2 opacity-50" />
                <p>{t("chat.startMessage")}</p>

                {results && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">{t("chat.quickQuestions")}</p>
                    <div className="grid grid-cols-2 gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => {
                          setChatInput(
                            t("chat.quickQuestion1", { disease: results.mobilenet_classification.class_name }),
                          )
                        }}
                      >
                        {t("chat.quickQuestion1Button")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => {
                          setChatInput(
                            t("chat.quickQuestion2", { disease: results.mobilenet_classification.class_name }),
                          )
                        }}
                      >
                        {t("chat.quickQuestion2Button")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => {
                          setChatInput(
                            t("chat.quickQuestion3", { disease: results.mobilenet_classification.class_name }),
                          )
                        }}
                      >
                        {t("chat.quickQuestion3Button")}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => {
                          setChatInput(
                            t("chat.quickQuestion4", { disease: results.mobilenet_classification.class_name }),
                          )
                        }}
                      >
                        {t("chat.quickQuestion4Button")}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <Avatar
                      className={`${msg.role === "user" ? "ml-2" : "mr-2"} h-8 w-8 ${msg.role === "assistant" ? "bg-green-100 dark:bg-green-900" : "bg-gray-200 dark:bg-gray-700"}`}
                    >
                      {msg.role === "assistant" ? <Bot size={16} /> : <div className="text-xs">You</div>}
                    </Avatar>
                    <div
                      className={`p-3 rounded-lg break-words whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-green-600 text-white rounded-tr-none"
                          : "bg-muted dark:bg-card border border-border rounded-tl-none"
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
              placeholder={results ? t("chat.placeholder") : t("chat.analyzeFirst")}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="resize-none min-h-[60px] max-h-[150px] bg-card dark:bg-card"
              disabled={!results || isChatLoading}
              maxLength={1000}
              rows={3}
            />
            <Button
              type="submit"
              size="icon"
              className="h-[60px] w-[60px] flex-shrink-0"
              disabled={!results || !chatInput.trim() || isChatLoading}
            >
              {isChatLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send />}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
