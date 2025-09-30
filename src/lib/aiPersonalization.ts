'use client'

import { geminiAI } from './geminiService'

interface UserWritingStyle {
  tone: string
  complexity: string
  pacing: string
  dialogueStyle: string
  experience: string
  favoriteGenres: string[]
  writingGoals: string[]
  interests: string[]
}

interface PersonalizedSuggestion {
  id: string
  type: string
  title: string
  content: string
  context: string
  priority: string
  personalization: {
    basedOnStyle: boolean
    styleElements: string[]
    genreRelevance: string[]
    goalAlignment: string[]
  }
}

export class AIPersonalizationService {
  private static instance: AIPersonalizationService

  static getInstance(): AIPersonalizationService {
    if (!AIPersonalizationService.instance) {
      AIPersonalizationService.instance = new AIPersonalizationService()
    }
    return AIPersonalizationService.instance
  }

  async generatePersonalizedSuggestion(
    context: string,
    userStyle: UserWritingStyle,
    suggestionType: string
  ): Promise<PersonalizedSuggestion> {
    const personalizedPrompt = this.buildPersonalizedPrompt(context, userStyle, suggestionType)
    
    try {
      const response = await geminiAI.generateGeneralSuggestion(personalizedPrompt)
      
      return {
        id: Date.now().toString(),
        type: suggestionType,
        title: this.generateSuggestionTitle(suggestionType, userStyle),
        content: response,
        context,
        priority: this.determinePriority(context, userStyle),
        personalization: {
          basedOnStyle: true,
          styleElements: this.extractStyleElements(userStyle),
          genreRelevance: userStyle.favoriteGenres,
          goalAlignment: userStyle.writingGoals
        }
      }
    } catch (error) {
      console.error('Error generating personalized suggestion:', error)
      return this.getFallbackSuggestion(context, suggestionType, userStyle)
    }
  }

  async generateContextualSuggestions(
    currentContent: string,
    userStyle: UserWritingStyle,
    contentType: string
  ): Promise<PersonalizedSuggestion[]> {
    const suggestions: PersonalizedSuggestion[] = []

    // Analyze content for different suggestion opportunities
    const analysis = await this.analyzeContent(currentContent, userStyle)
    
    // Generate suggestions based on analysis
    if (analysis.needsCharacterDevelopment) {
      suggestions.push(await this.generatePersonalizedSuggestion(
        `Character development opportunity in ${contentType}`,
        userStyle,
        'CHARACTER_SUGGESTION'
      ))
    }

    if (analysis.needsPlotDevelopment) {
      suggestions.push(await this.generatePersonalizedSuggestion(
        `Plot development opportunity in ${contentType}`,
        userStyle,
        'PLOT_DEVELOPMENT'
      ))
    }

    if (analysis.needsStyleImprovement) {
      suggestions.push(await this.generatePersonalizedSuggestion(
        `Style improvement opportunity in ${contentType}`,
        userStyle,
        'STYLE_IMPROVEMENT'
      ))
    }

    if (analysis.needsWorldBuilding) {
      suggestions.push(await this.generatePersonalizedSuggestion(
        `World building opportunity in ${contentType}`,
        userStyle,
        'WORLD_BUILDING'
      ))
    }

    return suggestions
  }

  private buildPersonalizedPrompt(
    context: string,
    userStyle: UserWritingStyle,
    suggestionType: string
  ): string {
    return `Based on this writing context: "${context}"

User's Writing Profile:
- Experience Level: ${userStyle.experience}
- Preferred Tone: ${userStyle.tone}
- Complexity Level: ${userStyle.complexity}
- Story Pacing: ${userStyle.pacing}
- Dialogue Style: ${userStyle.dialogueStyle}
- Favorite Genres: ${userStyle.favoriteGenres.join(', ')}
- Writing Goals: ${userStyle.writingGoals.join(', ')}
- Areas of Interest: ${userStyle.interests.join(', ')}

Generate a ${suggestionType} suggestion that:
- Matches their ${userStyle.tone} tone preference
- Aligns with their ${userStyle.complexity} complexity level
- Supports their writing goals: ${userStyle.writingGoals.join(', ')}
- Is relevant to their favorite genres: ${userStyle.favoriteGenres.join(', ')}
- Helps them improve in their areas of interest: ${userStyle.interests.join(', ')}

Make the suggestion specific, actionable, and personalized to their writing style and goals.`
  }

  private generateSuggestionTitle(type: string, userStyle: UserWritingStyle): string {
    const titles = {
      'WRITING_TIP': `Personalized Writing Tip for ${userStyle.tone} Style`,
      'CHARACTER_SUGGESTION': `Character Development for ${userStyle.favoriteGenres[0] || 'Your Genre'}`,
      'PLOT_DEVELOPMENT': `Plot Enhancement for ${userStyle.pacing} Pacing`,
      'WORLD_BUILDING': `World Building for ${userStyle.favoriteGenres[0] || 'Your Story'}`,
      'STYLE_IMPROVEMENT': `Style Refinement for ${userStyle.tone} Tone`
    }
    return titles[type as keyof typeof titles] || 'AI Writing Suggestion'
  }

  private determinePriority(context: string, userStyle: UserWritingStyle): string {
    // High priority for urgent writing goals
    if (userStyle.writingGoals.some(goal => 
      goal.includes('deadline') || goal.includes('urgent') || goal.includes('publish')
    )) {
      return 'HIGH'
    }

    // Medium priority for style improvements
    if (context.includes('style') || context.includes('tone') || context.includes('voice')) {
      return 'MEDIUM'
    }

    return 'LOW'
  }

  private extractStyleElements(userStyle: UserWritingStyle): string[] {
    return [
      userStyle.tone,
      userStyle.complexity,
      userStyle.pacing,
      userStyle.dialogueStyle
    ]
  }

  private async analyzeContent(content: string, userStyle: UserWritingStyle): Promise<{
    needsCharacterDevelopment: boolean
    needsPlotDevelopment: boolean
    needsStyleImprovement: boolean
    needsWorldBuilding: boolean
  }> {
    // Simple analysis based on content length and keywords
    const wordCount = content.split(' ').length
    const hasDialogue = content.includes('"') || content.includes("'")
    const hasCharacterNames = /[A-Z][a-z]+ [A-Z][a-z]+/.test(content)
    const hasWorldDetails = /(forest|mountain|city|kingdom|magic|technology)/i.test(content)

    return {
      needsCharacterDevelopment: wordCount > 200 && !hasCharacterNames,
      needsPlotDevelopment: wordCount > 500 && !hasDialogue,
      needsStyleImprovement: wordCount > 100 && userStyle.complexity === 'SIMPLE',
      needsWorldBuilding: wordCount > 300 && !hasWorldDetails
    }
  }

  private getFallbackSuggestion(
    context: string,
    suggestionType: string,
    userStyle: UserWritingStyle
  ): PersonalizedSuggestion {
    const fallbackContent = this.getFallbackContent(suggestionType, userStyle)
    
    return {
      id: Date.now().toString(),
      type: suggestionType,
      title: this.generateSuggestionTitle(suggestionType, userStyle),
      content: fallbackContent,
      context,
      priority: 'MEDIUM',
      personalization: {
        basedOnStyle: true,
        styleElements: this.extractStyleElements(userStyle),
        genreRelevance: userStyle.favoriteGenres,
        goalAlignment: userStyle.writingGoals
      }
    }
  }

  private getFallbackContent(type: string, userStyle: UserWritingStyle): string {
    const fallbacks = {
      'WRITING_TIP': `Consider enhancing your ${userStyle.tone.toLowerCase()} tone by adding more ${userStyle.complexity.toLowerCase()} details that align with your ${userStyle.favoriteGenres[0] || 'chosen'} genre.`,
      'CHARACTER_SUGGESTION': `Develop your characters by giving them ${userStyle.dialogueStyle.toLowerCase()} dialogue that reveals their ${userStyle.tone.toLowerCase()} personality.`,
      'PLOT_DEVELOPMENT': `Enhance your plot by adding ${userStyle.pacing.toLowerCase()}-paced scenes that advance your story toward your writing goals.`,
      'WORLD_BUILDING': `Build your world by adding details that support your ${userStyle.favoriteGenres[0] || 'story'} genre and align with your ${userStyle.tone.toLowerCase()} tone.`,
      'STYLE_IMPROVEMENT': `Improve your writing style by incorporating more ${userStyle.complexity.toLowerCase()} language that matches your ${userStyle.tone.toLowerCase()} voice.`
    }
    return fallbacks[type as keyof typeof fallbacks] || 'Consider adding more specific details to enhance your writing.'
  }
}

export const aiPersonalization = AIPersonalizationService.getInstance()
