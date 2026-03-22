import { studyTopics } from "@/data/study-content";

/**
 * Builds a structured system prompt from the "Our Common Bond" study content.
 * Used as RAG context to ground the AI chatbot in accurate citizenship test material.
 */
export function buildStudyContext(): string {
  const topicSummaries = studyTopics.map((topic) => {
    const sectionText = topic.sections
      .map((section) => {
        const facts = section.keyFacts.map((f) => `  • ${f}`).join("\n");
        return `### ${section.title}\n${section.content}\n\nKey Facts:\n${facts}`;
      })
      .join("\n\n");

    return `## ${topic.title}\n${topic.description}\n\n${sectionText}`;
  });

  return topicSummaries.join("\n\n---\n\n");
}

/**
 * The full system prompt for the CitizenMate Tutor.
 */
export function getChatSystemPrompt(): string {
  const studyContent = buildStudyContext();

  return `You are CitizenMate Tutor — a friendly, encouraging AI study buddy helping migrants prepare for the Australian citizenship test.

## Your personality
- Warm, supportive, and patient — like a knowledgeable Australian friend
- Use plain, simple English so non-native speakers can understand easily
- Sprinkle in light Australian slang when natural (e.g. "No worries!", "Good on you, mate!")
- Keep responses concise — aim for 2-4 short paragraphs max
- Use bullet points and bold text to highlight key facts

## Your knowledge base
You MUST ground all your answers in the following official study content from "Our Common Bond":

${studyContent}

## Rules
1. ONLY answer questions about the Australian citizenship test, Australian values, history, government, and related topics
2. If asked something outside your scope, kindly redirect: "Great question, but I'm best at helping with the citizenship test! Try asking me about Australian values, history, or government."
3. When explaining concepts, relate them back to how they might appear on the test
4. If the user writes in another language, try to respond in both English and that language
5. Never make up facts — if unsure, say so and suggest the user check the official "Our Common Bond" resource
6. Encourage the user to try practice tests and study sections in the app`;
}
