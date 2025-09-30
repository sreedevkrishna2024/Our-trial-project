import { z } from 'zod'

// AI Generation Schema
export const aiGenerationSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  prompt: z.string().optional(),
  genre: z.string().optional(),
  theme: z.string().optional(),
  character1: z.string().optional(),
  character2: z.string().optional(),
  context: z.string().optional(),
  role: z.string().optional(),
  userId: z.string().optional(),
  storyId: z.string().optional(),
  userMessage: z.string().optional(),
  storyContext: z.string().optional(),
  chapterNumber: z.number().optional(),
  previousChapter: z.string().optional(),
  focusArea: z.string().optional(),
  text: z.string().optional(),
  setting: z.string().optional(),
  additionalDetails: z.string().optional()
})

// User Schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

// Story Schema
export const storySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  genre: z.string().min(1, 'Genre is required'),
  status: z.string().optional().default('DRAFT'),
  isPublic: z.boolean().optional().default(false),
  wordCount: z.number().optional().default(0),
  targetWordCount: z.number().optional(),
  coverImage: z.string().optional(),
  tags: z.string().optional(),
  metadata: z.string().optional()
})

// Character Schema
export const characterSchema = z.object({
  name: z.string().min(1, 'Character name is required'),
  role: z.string().optional(),
  age: z.number().optional(),
  description: z.string().optional(),
  personality: z.string().optional(),
  backstory: z.string().optional(),
  appearance: z.string().optional(),
  relationships: z.string().optional()
})

// Plot Schema
export const plotSchema = z.object({
  title: z.string().min(1, 'Plot title is required'),
  description: z.string().optional(),
  content: z.string().optional(),
  type: z.string().min(1, 'Plot type is required'),
  order: z.number().optional()
})

// Dialogue Schema
export const dialogueSchema = z.object({
  content: z.string().min(1, 'Dialogue content is required'),
  character1: z.string().min(1, 'Character 1 is required'),
  character2: z.string().min(1, 'Character 2 is required'),
  context: z.string().optional(),
  tone: z.string().optional()
})

// World Building Schema
export const worldBuildingSchema = z.object({
  name: z.string().min(1, 'World name is required'),
  description: z.string().min(1, 'World description is required'),
  genre: z.string().min(1, 'Genre is required'),
  setting: z.string().min(1, 'Setting is required'),
  timePeriod: z.string().optional(),
  magicSystem: z.string().optional(),
  technologyLevel: z.string().optional(),
  politicalSystem: z.string().optional(),
  culture: z.string().optional(),
  geography: z.string().optional(),
  history: z.string().optional(),
  rules: z.string().optional(),
  characters: z.string().optional()
})

// Chat Session Schema
export const chatSessionSchema = z.object({
  title: z.string().min(1, 'Chat session title is required'),
  messages: z.string().min(1, 'Messages are required')
})

// AI Suggestion Schema
export const aiSuggestionSchema = z.object({
  type: z.string().min(1, 'Suggestion type is required'),
  title: z.string().min(1, 'Suggestion title is required'),
  content: z.string().min(1, 'Suggestion content is required'),
  context: z.string().optional(),
  isRead: z.boolean().optional().default(false),
  isDismissed: z.boolean().optional().default(false),
  priority: z.string().optional().default('MEDIUM'),
  metadata: z.string().optional()
})

// Onboarding Data Schema
export const onboardingDataSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  questionType: z.string().min(1, 'Question type is required'),
  metadata: z.string().optional()
})

// Voice Profile Schema
export const voiceProfileSchema = z.object({
  name: z.string().min(1, 'Voice profile name is required'),
  tone: z.string().optional(),
  pace: z.string().optional(),
  vocabulary: z.string().optional(),
  sentenceStructure: z.string().optional(),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
  sample: z.string().min(1, 'Sample text is required')
})

// World Development Schema
export const worldDevelopmentSchema = z.object({
  worldId: z.string().min(1, 'World ID is required'),
  query: z.string().min(1, 'Query is required'),
  developmentType: z.string().min(1, 'Development type is required'),
  content: z.string().min(1, 'Content is required'),
  context: z.string().optional(),
  suggestions: z.string().optional()
})

// World Embedding Schema
export const worldEmbeddingSchema = z.object({
  worldId: z.string().min(1, 'World ID is required'),
  content: z.string().min(1, 'Content is required'),
  embedding: z.string().min(1, 'Embedding is required'),
  type: z.string().min(1, 'Type is required'),
  section: z.string().min(1, 'Section is required'),
  subsection: z.string().optional(),
  importance: z.number().min(0).max(1).optional().default(0.5)
})

// Chapter Schema
export const chapterSchema = z.object({
  title: z.string().min(1, 'Chapter title is required'),
  content: z.string().optional(),
  wordCount: z.number().optional().default(0),
  order: z.number().min(0, 'Order must be non-negative'),
  isPublished: z.boolean().optional().default(false)
})

// Writing Session Schema
export const writingSessionSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  wordCount: z.number().optional().default(0),
  duration: z.number().optional(),
  type: z.string().min(1, 'Session type is required')
})

// Comment Schema
export const commentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
  isPublic: z.boolean().optional().default(true)
})

// Like Schema
export const likeSchema = z.object({
  // No additional fields needed for likes
})

// Story Idea Schema
export const storyIdeaSchema = z.object({
  title: z.string().min(1, 'Story idea title is required'),
  concept: z.string().min(1, 'Story concept is required'),
  genre: z.string().min(1, 'Genre is required'),
  themes: z.string().optional(),
  characters: z.string().optional(),
  conflict: z.string().optional(),
  setting: z.string().optional(),
  potential: z.string().optional().default('medium')
})

// Saved Character Schema
export const savedCharacterSchema = z.object({
  name: z.string().min(1, 'Character name is required'),
  role: z.string().min(1, 'Character role is required'),
  age: z.number().optional(),
  description: z.string().min(1, 'Character description is required'),
  personality: z.string().optional(),
  backstory: z.string().optional(),
  motivation: z.string().optional(),
  appearance: z.string().optional(),
  skills: z.string().optional(),
  flaws: z.string().optional(),
  relationships: z.string().optional()
})

// Saved Plot Schema
export const savedPlotSchema = z.object({
  title: z.string().min(1, 'Plot title is required'),
  description: z.string().min(1, 'Plot description is required'),
  plotPoints: z.string().min(1, 'Plot points are required'),
  genre: z.string().optional(),
  theme: z.string().optional(),
  structure: z.string().optional()
})

// Saved Dialogue Schema
export const savedDialogueSchema = z.object({
  title: z.string().min(1, 'Dialogue title is required'),
  content: z.string().min(1, 'Dialogue content is required'),
  characters: z.string().min(1, 'Characters are required'),
  setting: z.string().optional(),
  mood: z.string().optional(),
  genre: z.string().optional()
})

// User Onboarding Data Schema
export const userOnboardingDataSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
  questionType: z.string().min(1, 'Question type is required'),
  metadata: z.string().optional()
})

// Export all schemas
export const schemas = {
  aiGeneration: aiGenerationSchema,
  user: userSchema,
  story: storySchema,
  character: characterSchema,
  plot: plotSchema,
  dialogue: dialogueSchema,
  worldBuilding: worldBuildingSchema,
  chatSession: chatSessionSchema,
  aiSuggestion: aiSuggestionSchema,
  onboardingData: onboardingDataSchema,
  voiceProfile: voiceProfileSchema,
  worldDevelopment: worldDevelopmentSchema,
  worldEmbedding: worldEmbeddingSchema,
  chapter: chapterSchema,
  writingSession: writingSessionSchema,
  comment: commentSchema,
  like: likeSchema,
  storyIdea: storyIdeaSchema,
  savedCharacter: savedCharacterSchema,
  savedPlot: savedPlotSchema,
  savedDialogue: savedDialogueSchema,
  userOnboardingData: userOnboardingDataSchema
}