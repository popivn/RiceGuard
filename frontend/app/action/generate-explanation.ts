"use server"

import OpenAI from "openai"

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
})

export async function generateExplanation(diseaseName: string): Promise<string> {
  try {
    // For healthy leaves, return a simple message
    // if (diseaseName === "healthy") {
    //   return "The leaf appears to be healthy with no signs of disease or pest damage. Continue with regular care and monitoring."
    // }

    // For "No specific disease areas detected"
    if (diseaseName === "no detection") {
      return "No specific disease patterns were detected in this image. This could mean the image doesn't contain recognizable disease patterns, the disease is at an early stage, or the image quality is affecting analysis. Consider consulting with a plant pathologist for proper diagnosis."
    }

    const response = await openai.chat.completions.create({
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
