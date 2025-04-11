"use server"

import OpenAI from "openai"

// Initialize the OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function generateExplanation(diseaseName: string): Promise<string> {
  try {
    // For "No specific disease areas detected"
    if (diseaseName === "no detection") {
      return "No specific disease patterns were detected in this image. This could mean the image doesn't contain recognizable disease patterns, the disease is at an early stage, or the image quality is affecting analysis. Consider consulting with a plant pathologist for proper diagnosis."
    }

    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a plant pathology expert specializing in citrus diseases. Provide concise, informative explanations about lemon diseases in 2-3 sentences. Include basic information about the disease and general treatment recommendations.",
        },
        {
          role: "user",
          content: `Explain the lemon disease "${diseaseName}" in 2-3 sentences, including what it is and basic treatment recommendations.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    })

    return response.choices[0].message.content || "No explanation available."
  } catch (error) {
    console.error("Error generating explanation:", error)
    return `${diseaseName}: A disease affecting lemon plants. Please consult with a plant pathologist for proper diagnosis and treatment.`
  }
}

export async function chatWithAssistant(
  userMessage: string,
  diseaseName: string,
  explanation: string,
): Promise<string> {
  try {
    // Use OpenAI client directly instead of AI SDK
    const response = await openaiClient.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant specializing in lemon plant diseases. 
          The user has uploaded an image of a lemon plant, and the system has detected the following disease: "${diseaseName}".
          Here's the explanation of the disease: "${explanation}".
          
          Answer the user's questions about lemon diseases, treatments, prevention methods, and related topics. 
          If the user asks about a different disease than what was detected, you can still provide information about it.
          
          Keep your responses concise, informative, and helpful. If you don't know something, admit it and suggest consulting a plant pathologist.`,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_tokens: 500,
      temperature: 0.7,
    })

    return response.choices[0].message.content || "I'm sorry, I couldn't generate a response. Please try again."
  } catch (error) {
    console.error("Error in chat:", error)
    return "I'm sorry, I encountered an error while processing your question. Please try again."
  }
}
