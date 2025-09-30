import { GoogleGenerativeAI } from '@google/generative-ai'
import { v4 as uuidv4 } from 'uuid'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCeCGWdqbht2nPKHtWa3HFm4CK2qBiGQTw')
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

interface StoryIdea {
  id: string
  title: string
  logline: string
  genre: string
  theme: string
  characters: string[]
  conflict: string
  setting: string
  tone: string
}

interface Character {
  id: string
  name: string
  role: string
  age: number
  description: string
  personality: string[]
  backstory: string
  appearance: string
  motivation: string
  relationships: string[]
}

interface VoiceAnalysis {
  tone: string
  pace: string
  vocabulary: string
  sentenceStructure: string
  themes: string[]
  strengths: string[]
  suggestions: string[]
  readabilityScore: number
  emotionalTone: string
  complexityLevel: string
}

class GeminiAIService {
  private static instance: GeminiAIService

  static getInstance(): GeminiAIService {
    if (!GeminiAIService.instance) {
      GeminiAIService.instance = new GeminiAIService()
    }
    return GeminiAIService.instance
  }

  private async generateWithGemini(prompt: string): Promise<string> {
    try {
      // Add humanization instructions to all prompts
      const humanizedPrompt = `${prompt}

      IMPORTANT: Write in a natural, conversational tone as if you're a creative writing expert sharing insights with a fellow writer. Use varied sentence structures, personal insights, and engaging language. Avoid AI-like phrases, repetitive patterns, or overly formal language. Make it feel like genuine creative advice from an experienced writer. Keep suggestions short, direct, and actionable.`
      
      const result = await model.generateContent(humanizedPrompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Gemini API Error:', error)
      throw new Error('Failed to generate content with Gemini AI')
    }
  }

  async generateStoryIdea(genre: string = 'fantasy', theme: string = 'adventure'): Promise<string> {
    const prompt = `Generate a creative and unique story idea for a ${genre} story with the theme of ${theme}. 

Please provide a detailed response in the following JSON format:
{
  "title": "Compelling story title",
  "logline": "One-sentence summary of the story",
  "genre": "${genre}",
  "theme": "${theme}",
  "characters": ["Character 1 name and brief description", "Character 2 name and brief description", "Character 3 name and brief description"],
  "conflict": "Main conflict or challenge in the story",
  "setting": "Where and when the story takes place",
  "tone": "The overall mood and atmosphere"
}

Make it creative, original, and engaging. Focus on unique concepts that haven't been overused.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response
    } catch (error) {
      console.error('Error generating story idea:', error)
      // Fallback story idea
      return `**The Memory Garden**
      
A botanist discovers a garden where each plant represents a different memory, and must navigate the dangerous terrain of forgotten recollections to save her lost love.

**Genre:** ${genre}
**Theme:** ${theme}

**Characters:**
- Dr. Elena Rivers - Memory botanist
- Marcus Chen - Lost love trapped in memories  
- The Memory Keeper - Mysterious guardian

**Conflict:** Elena must choose between saving Marcus and preserving the balance of the memory ecosystem.

**Setting:** Hidden garden in the mountains, present day
**Tone:** Mystical and romantic`
    }
  }

  async generatePlotOutline(genre: string, theme: string): Promise<string[]> {
    const prompt = `I'm working on a ${genre} story and need help structuring the plot around the theme of ${theme}.

    Please create a compelling 7-point story structure that feels natural and engaging. Write as if you're a story consultant helping a fellow writer develop their narrative. Structure it like this:

    # **STORY STRUCTURE**
    *A ${genre} tale exploring ${theme}*

    ## **The Journey Ahead**
    Here's how the story unfolds:

    1. **The Hook** - The moment that grabs readers and sets everything in motion
    2. **Setting the Stage** - Introducing the world and characters we'll follow
    3. **The First Challenge** - The initial obstacle that tests our protagonist
    4. **The Big Reveal** - A major twist or discovery that changes everything
    5. **The Darkest Hour** - When all seems lost and hope fades
    6. **The Final Battle** - The climactic confrontation that decides everything
    7. **New Beginnings** - How our characters have grown and what's changed

    Make each point feel like a natural part of the story's flow. Write with passion and insight, as if you're sharing the blueprint for an amazing story. Focus on emotional beats and character growth, not just plot mechanics.

    Return this as a clean numbered list that flows naturally.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.split('\n').filter(line => line.trim().match(/^\d+\./))
    } catch (error) {
      console.error('Error generating plot outline:', error)
      return [
        "1. Hook: Protagonist discovers a mysterious object that changes their world",
        "2. Setup: Introduction to the world and key characters",
        "3. First Plot Point: First major obstacle appears",
        "4. Midpoint: A shocking revelation changes everything",
        "5. Second Plot Point: The darkest moment - all seems lost",
        "6. Climax: Final confrontation with the main antagonist",
        "7. Resolution: Protagonist's growth and new world order"
      ]
    }
  }

  async generateDialogue(character1: string, character2: string, context: string): Promise<string> {
    const prompt = `Write a natural, engaging dialogue between ${character1} and ${character2} in the context of: ${context}

Requirements:
- Make it sound natural and authentic
- Each character should have a distinct voice
- Include subtext and emotional depth
- Show character relationships and dynamics
- Make it advance the story or reveal character traits
- Format as:
${character1}: "dialogue here"
${character2}: "dialogue here"

Write 6-10 exchanges that feel real and meaningful.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating dialogue:', error)
      return `${character1}: "I never expected to see you here."
${character2}: "Life has a way of bringing us together when we least expect it."
${character1}: "After everything that happened..."
${character2}: "Maybe that's exactly why we need to talk."
${character1}: "What if talking makes it worse?"
${character2}: "What if staying silent makes it impossible to move forward?"`
    }
  }

  async generateCharacter(role: string, genre: string): Promise<string> {
    const prompt = `I'm developing a character for my ${genre} story and need help creating someone compelling and realistic. This character will serve as a ${role}.

    Please create a well-rounded character that feels like a real person. Write as if you're a character development expert sharing insights about someone you know well. Structure it like this:

    # **CHARACTER NAME**
    *${role} in a ${genre} story*

    ## **👤 Who They Are**
    - **Age**: How old they are and why it matters
    - **Role**: What they do in the story
    - **Status**: Their place in the world

    ## **🎭 What Makes Them Tick**
    Their personality and inner workings:
    - **Core Traits**: The 3-5 things that define them
    - **What They're Good At**: Their natural talents
    - **Where They Struggle**: Their weaknesses and blind spots
    - **Little Quirks**: The small things that make them unique

    ## **📖 Their Journey So Far**
    The experiences that shaped them:
    - **Growing Up**: Their childhood and formative years
    - **Turning Points**: The moments that changed everything
    - **Where They Are Now**: Their current situation and how they got there

    ## **👁️ How They Look**
    Their physical presence:
    - **First Impression**: What people notice about them
    - **Standout Features**: What makes them memorable
    - **Personal Style**: How they dress and carry themselves
    - **Body Language**: How they move and express themselves

    ## **🎯 What Drives Them**
    Their motivations and desires:
    - **Main Goal**: What they're trying to achieve
    - **Other Wants**: Secondary objectives
    - **What Scares Them**: Their deepest fears
    - **What They Stand For**: Their core values

    ## **🤝 The People in Their Life**
    Their relationships:
    - **Family**: Parents, siblings, relatives
    - **Close Friends**: Their inner circle
    - **Rivals**: People they clash with
    - **Mentors**: Those who guide them

    Write this character as if you're introducing a real person to a friend. Use natural, conversational language that shows you understand them deeply. Make them feel authentic and three-dimensional, with both strengths and flaws.

    Also provide the structured data in JSON format for the application:
    {
      "name": "Character name",
      "role": "${role}",
      "age": 25,
      "description": "Physical appearance and basic personality",
      "personality": ["trait1", "trait2", "trait3", "trait4"],
      "backstory": "Detailed background and history",
      "appearance": "Detailed physical description",
      "motivation": "What drives this character",
      "relationships": ["Relationship 1", "Relationship 2"]
    }`

    try {
      const response = await this.generateWithGemini(prompt)
      return response
    } catch (error) {
      console.error('Error generating character:', error)
      return `**Alex Rivera**
*${role} in a ${genre} story*

**👤 Who They Are**
- **Age**: 28 years old
- **Role**: ${role}
- **Status**: Determined individual with hidden depths

**🎭 What Makes Them Tick**
- **Core Traits**: Brave, Curious, Stubborn, Loyal
- **What They're Good At**: Overcoming challenges, inspiring others
- **Where They Struggle**: Trusting others, asking for help
- **Little Quirks**: Always moving, expressive eyes

**📖 Their Journey So Far**
- **Growing Up**: Challenging circumstances but never gave up
- **Turning Points**: Moments that shaped their determination
- **Where They Are Now**: Ready to prove themselves

**👁️ How They Look**
- **First Impression**: Medium height, expressive eyes
- **Standout Features**: Determined expression, always in motion
- **Personal Style**: Practical and functional

**🎯 What Drives Them**
- **Main Goal**: To prove that anyone can overcome their circumstances
- **Motivation**: Inspiring others through their own journey
- **What Scares Them**: Failing those who believe in them

**🤝 The People in Their Life**
- **Mentor**: Someone who guided them
- **Close Friend**: Their most trusted companion`
    }
  }

  async analyzeWritingStyle(text: string): Promise<VoiceAnalysis> {
    const prompt = `Analyze the following writing sample for its style, voice, and technical elements:

"${text}"

Please provide a comprehensive analysis in JSON format:
{
  "tone": "Overall tone of the writing",
  "pace": "Pacing and rhythm",
  "vocabulary": "Vocabulary level and complexity",
  "sentenceStructure": "Variety and complexity of sentence structures",
  "themes": ["theme1", "theme2", "theme3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "readabilityScore": 75,
  "emotionalTone": "Primary emotional quality",
  "complexityLevel": "Simple/Intermediate/Advanced"
}

Be specific and constructive in your analysis. Focus on what works well and provide actionable suggestions for improvement.`

    try {
      const response = await this.generateWithGemini(prompt)
      
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Could not parse JSON from response')
      }
    } catch (error) {
      console.error('Error analyzing writing style:', error)
      return {
        tone: 'Conversational',
        pace: 'Moderate',
        vocabulary: 'Accessible',
        sentenceStructure: 'Varied',
        themes: ['Growth', 'Identity'],
        strengths: ['Character development', 'Dialogue'],
        suggestions: ['Consider adding more sensory details', 'Try varying sentence length for rhythm'],
        readabilityScore: 75,
        emotionalTone: 'Hopeful',
        complexityLevel: 'Intermediate'
      }
    }
  }

  async generateChatResponse(userMessage: string, context?: string): Promise<string> {
    const prompt = `You are an expert writing assistant and creative writing coach. A writer has asked: "${userMessage}"

${context ? `Context: ${context}` : ''}

Provide helpful, encouraging, and specific advice about writing. Be conversational but professional. If they're asking about story ideas, character development, plot structure, dialogue, or any other writing topic, give them practical, actionable advice.

Keep your response concise but comprehensive (2-3 paragraphs max).`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating chat response:', error)
      return "I'm here to help with your writing! That's a great question about writing. Could you tell me more about what specific aspect you'd like to work on? I can help with story ideas, character development, plot structure, dialogue, and much more."
    }
  }

  async generateStoryChapter(storyContext: string, chapterNumber: number, previousChapter?: string): Promise<string> {
    const prompt = `Write Chapter ${chapterNumber} of a story with the following context:

Story Context: ${storyContext}

${previousChapter ? `Previous Chapter Summary: ${previousChapter}` : ''}

Write a complete chapter that:
- Advances the plot naturally
- Develops characters
- Maintains consistent tone and style
- Includes dialogue, action, and description
- Ends with a hook or development that makes readers want to continue

Make it engaging and well-paced. Aim for approximately 1000-1500 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating story chapter:', error)
      return "Chapter generation is temporarily unavailable. Please try again later."
    }
  }

  async improveText(text: string, focusArea: string): Promise<string> {
    const prompt = `Improve the following text with a focus on ${focusArea}:

"${text}"

Please provide an improved version that:
- Maintains the original meaning and voice
- Enhances the specified focus area
- Improves flow, clarity, and impact
- Makes the writing more engaging

Return only the improved text, no explanations.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error improving text:', error)
      return text // Return original text if improvement fails
    }
  }

  // New AI Suggestion Methods
  async generateWritingTip(context: string): Promise<string> {
    const prompt = `Review this writing: "${context}"

    Give one specific, actionable tip that would improve it most. Be direct and helpful. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating writing tip:', error)
      return "Consider adding more sensory details to make your writing more immersive and engaging."
    }
  }

  async generateCharacterSuggestion(context: string): Promise<string> {
    const prompt = `Character: "${context}"

    Suggest one specific way to make them more compelling. Be direct and practical. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating character suggestion:', error)
      return "Consider giving your character an internal conflict that contrasts with their external goals."
    }
  }

  async generatePlotSuggestion(context: string): Promise<string> {
    const prompt = `Plot: "${context}"

    Suggest one specific way to strengthen it. Be direct and actionable. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating plot suggestion:', error)
      return "Consider adding an unexpected complication that forces your protagonist to adapt their approach."
    }
  }

  async generateWorldBuildingSuggestion(context: string): Promise<string> {
    const prompt = `World: "${context}"

    Suggest one specific way to make it more immersive. Be direct and practical. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating world-building suggestion:', error)
      return "Consider how your world's unique features affect everyday life and social structures."
    }
  }

  async generateStyleImprovement(context: string): Promise<string> {
    const prompt = `Writing style: "${context}"

    Suggest one specific improvement. Be direct and actionable. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating style improvement:', error)
      return "Try varying your sentence structure to create better rhythm and flow in your writing."
    }
  }

  async generateGeneralSuggestion(context: string): Promise<string> {
    const prompt = `Writing: "${context}"

    Give one specific improvement tip. Be direct and helpful. Keep it under 50 words.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating general suggestion:', error)
      return "Consider adding more specific details to make your writing more vivid and engaging."
    }
  }

  async generateWorldBuilding(context: string, genre: string, setting: string): Promise<any> {
    const prompt = `I'm working on a creative writing project and need help developing a rich, immersive fictional world. Based on this concept: "${context}"

    Genre: ${genre}
    Setting: ${setting}

    Please create a detailed world that feels authentic and lived-in. Write as if you're a passionate world-builder sharing your creation, using natural language and personal insights. Structure it like this:

    # **WORLD NAME**
    *A compelling tagline that captures the essence*

    ## **🌍 The World at a Glance**
    Paint a vivid picture of this world in 3-4 paragraphs. Describe the geography, atmosphere, and what makes it unique. Write with passion and detail, as if you've lived there.

    ## **⚡ How Magic Works Here**
    Explain the magic system naturally, as if describing something real:
    - **The Source**: Where magic comes from
    - **The Rules**: How it actually works in practice
    - **The Cost**: What it takes to use magic
    - **Who Can Use It**: The practitioners and their methods

    ## **👑 Power and Politics**
    Describe the government and power structures:
    - **Who's in Charge**: The current leadership
    - **How It Works**: The political structure
    - **The Laws**: What's legal and what isn't
    - **Current Tensions**: What's brewing politically

    ## **🏛️ Daily Life and Culture**
    Show how people actually live:
    - **What They Value**: Core beliefs and principles
    - **How They Celebrate**: Important traditions
    - **What They Believe**: Religious and spiritual practices
    - **How They Communicate**: Languages and customs
    - **What They Eat**: Cuisine and dining culture

    ## **🗺️ The Land Itself**
    Describe the physical world:
    - **The Climate**: Weather patterns and seasons
    - **The Terrain**: Mountains, forests, cities, etc.
    - **What's Valuable**: Important resources
    - **What's Dangerous**: Perilous areas to avoid

    ## **📚 The Story So Far**
    Tell the world's history like a story:
    - **The Beginning**: How it all started
    - **Major Events**: The big moments that shaped everything
    - **Recent Times**: What's happened lately
    - **Right Now**: The current situation

    ## **👥 The People Who Matter**
    Introduce the key characters:
    - **The Leader**: Who's in charge and why
    - **The Rebel**: Someone fighting the system
    - **The Wise One**: Keeper of ancient knowledge
    - **The Protector**: Guardian of the realm
    - **The Mystic**: Keeper of hidden secrets

    ## **📜 The Rules That Matter**
    The fundamental laws that govern this world:
    1. **How magic affects the world**
    2. **The social order and hierarchy**
    3. **Technology and its limits**
    4. **Nature and the environment**
    5. **Death and what comes after**
    6. **Love and relationships**
    7. **Knowledge and its power**

    ## **⚔️ The Conflicts Brewing**
    What tensions exist:
    - **Internal Struggles**: Problems within the world
    - **External Threats**: Dangers from outside
    - **Ideological Wars**: Clashes of belief
    - **Resource Conflicts**: Fights over valuable materials

    ## **🎭 The Heart of the Story**
    The deeper meaning:
    - **Main Theme**: The central message
    - **Supporting Themes**: Other important ideas
    - **Symbols**: What represents what
    - **The Feel**: The emotional atmosphere

    Write this as if you're a creative writer sharing your world-building process. Use natural, engaging language that flows well. Make it feel personal and authentic, like you've really thought deeply about this world.

    Also provide the structured data in JSON format for the application:

{
  "name": "World Name",
  "description": "Comprehensive world overview (2-3 paragraphs)",
  "genre": "${genre}",
  "setting": "${setting}",
  "timePeriod": "Specific time period with details",
  "technologyLevel": "Detailed technology description",
  "magicSystem": {
    "type": "Type of magic system",
    "rules": ["Rule 1", "Rule 2", "Rule 3"],
    "limitations": ["Limitation 1", "Limitation 2"],
    "sources": "Where magic comes from",
    "practitioners": "Who can use magic and how"
  },
  "politicalSystem": {
    "type": "Government type",
    "structure": "Detailed political structure",
    "leaders": "Who rules and how",
    "laws": ["Law 1", "Law 2", "Law 3"],
    "conflicts": "Current political tensions"
  },
  "culture": {
    "values": ["Core value 1", "Core value 2", "Core value 3"],
    "traditions": ["Tradition 1", "Tradition 2"],
    "religions": ["Religion 1", "Religion 2"],
    "languages": ["Language 1", "Language 2"],
    "art": "Artistic expressions and styles",
    "food": "Cuisine and dining customs"
  },
  "geography": {
    "climate": "Climate description",
    "terrain": "Landscape features",
    "regions": [
      {
        "name": "Region 1",
        "description": "Region details",
        "notableFeatures": ["Feature 1", "Feature 2"]
      }
    ],
    "resources": ["Resource 1", "Resource 2", "Resource 3"],
    "dangers": ["Danger 1", "Danger 2"]
  },
  "history": {
    "timeline": [
      {
        "era": "Era name",
        "period": "Time period",
        "events": ["Event 1", "Event 2"],
        "significance": "Why this era matters"
      }
    ],
    "majorEvents": ["Event 1", "Event 2", "Event 3"],
    "currentSituation": "What's happening now"
  },
  "rules": [
    "Fundamental world rule 1",
    "Fundamental world rule 2",
    "Fundamental world rule 3",
    "Fundamental world rule 4",
    "Fundamental world rule 5"
  ],
  "characters": [
    {
      "id": "1",
      "name": "Character Name",
      "role": "Character role",
      "description": "Detailed character description",
      "motivation": "Primary motivation",
      "appearance": "Physical description",
      "backstory": "Character background",
      "relationships": ["Relationship 1", "Relationship 2"],
      "skills": ["Skill 1", "Skill 2"],
      "flaws": ["Flaw 1", "Flaw 2"],
      "goals": ["Goal 1", "Goal 2"]
    }
  ],
  "locations": [
    {
      "name": "Location Name",
      "type": "Location type",
      "description": "Detailed location description",
      "significance": "Why this location matters",
      "inhabitants": "Who lives here",
      "notableFeatures": ["Feature 1", "Feature 2"]
    }
  ],
  "conflicts": [
    {
      "name": "Conflict Name",
      "type": "Type of conflict",
      "description": "Conflict details",
      "parties": ["Party 1", "Party 2"],
      "stakes": "What's at risk",
      "resolution": "How it might be resolved"
    }
  ],
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "tone": "Overall tone and atmosphere",
  "inspiration": "What inspired this world"
}

Make it rich, detailed, and internally consistent. Each section should be comprehensive and interconnected. Make sure that it is formatted well, easy to read, and suitable for use in storytelling or game design. Give the output as paragraphs with spaces in between, use bold characters and underlining when necessary.`

    try {
      const response = await this.generateWithGemini(prompt)
      // Try to parse as JSON, fallback to structured text
      try {
        return JSON.parse(response)
      } catch {
        // If not JSON, create structured object from text
        return {
          name: "Generated World",
          description: response,
          genre: genre,
          setting: setting,
          timePeriod: "Medieval",
          magicSystem: "Elemental magic system",
          technologyLevel: "Medieval",
          politicalSystem: "Monarchy",
          culture: "Traditional society",
          geography: "Diverse landscapes",
          history: "Ancient civilizations",
          rules: ["Magic follows natural laws", "Technology is limited by era"],
          characters: [
            {
              id: "1",
              name: "The Protagonist",
              role: "Hero",
              description: "A brave soul seeking adventure",
              motivation: "To protect what they love",
              relationships: ["Mentor", "Companion"],
              appearance: "Determined eyes, weathered hands",
              backstory: "Raised in humble beginnings"
            }
          ]
        }
      }
    } catch (error) {
      console.error('Error generating world building:', error)
      return {
        name: "Fallback World",
        description: context,
        genre: genre,
        setting: setting,
        timePeriod: "Medieval",
        magicSystem: "Elemental magic system",
        technologyLevel: "Medieval",
        politicalSystem: "Monarchy",
        culture: "Traditional society",
        geography: "Diverse landscapes",
        history: "Ancient civilizations",
        rules: ["Magic follows natural laws", "Technology is limited by era"],
        characters: [
          {
            id: "1",
            name: "The Protagonist",
            role: "Hero",
            description: "A brave soul seeking adventure",
            motivation: "To protect what they love",
            relationships: ["Mentor", "Companion"],
            appearance: "Determined eyes, weathered hands",
            backstory: "Raised in humble beginnings"
          }
        ]
      }
    }
  }

  // Advanced World Building AI Methods
  async generateWorldTimeline(worldContext: string, timeSpan: string): Promise<any> {
    const prompt = `Create a detailed timeline for this world: "${worldContext}"

Time span: ${timeSpan}

Generate 8-12 major historical events including:
- Political upheavals
- Cultural developments
- Technological/magical breakthroughs
- Natural disasters
- Wars and conflicts
- Religious movements
- Economic changes

Each event should have:
- Year/date
- Title
- Description
- Importance level (low/medium/high/critical)
- Category (political/cultural/technological/magical/natural/military)

Return as a structured array of timeline events.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackTimeline()
      }
    } catch (error) {
      console.error('Error generating timeline:', error)
      return this.getFallbackTimeline()
    }
  }

  async generateWorldMap(worldContext: string, mapType: string): Promise<any> {
    const prompt = `Create a detailed map for this world: "${worldContext}"

Map type: ${mapType}

Generate 10-15 locations including:
- Major cities and towns
- Important landmarks
- Natural features (mountains, rivers, forests)
- Dangerous areas
- Sacred sites
- Trade routes

Each location should have:
- Name
- Type (city/town/village/landmark/region/dungeon/temple)
- Coordinates (x, y)
- Description
- Population (if applicable)
- Ruler (if applicable)
- Resources available

Return as a structured array of map locations.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackMap()
      }
    } catch (error) {
      console.error('Error generating map:', error)
      return this.getFallbackMap()
    }
  }

  async generateWorldLanguages(worldContext: string, languageCount: number = 3): Promise<any> {
    const prompt = `Create ${languageCount} distinct languages for this world: "${worldContext}"

For each language, generate:
- Name
- Speakers (which cultures/races speak it)
- Script/writing system
- Complexity level (simple/moderate/complex)
- 5-8 sample phrases with translations
- Basic grammar rules
- Cultural significance

Make each language unique and fitting for the world's context.

Return as a structured array of languages.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackLanguages()
      }
    } catch (error) {
      console.error('Error generating languages:', error)
      return this.getFallbackLanguages()
    }
  }

  async generateWorldReligions(worldContext: string, religionCount: number = 2): Promise<any> {
    const prompt = `Create ${religionCount} distinct religions for this world: "${worldContext}"

For each religion, generate:
- Name
- Followers (which cultures/races practice it)
- Core beliefs (5-7 key tenets)
- Religious practices and rituals
- Deities or divine figures (3-5)
- Holy texts or scriptures
- Influence on society and politics

Make each religion unique and internally consistent.

Return as a structured array of religions.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackReligions()
      }
    } catch (error) {
      console.error('Error generating religions:', error)
      return this.getFallbackReligions()
    }
  }

  async generateWorldCultures(worldContext: string, cultureCount: number = 3): Promise<any> {
    const prompt = `Create ${cultureCount} distinct cultures for this world: "${worldContext}"

For each culture, generate:
- Name
- Description
- Core values (5-7 key principles)
- Traditions and customs
- Art forms and expressions
- Music and entertainment
- Food and cuisine
- Clothing and fashion
- Social structure

Make each culture unique and detailed.

Return as a structured array of cultures.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackCultures()
      }
    } catch (error) {
      console.error('Error generating cultures:', error)
      return this.getFallbackCultures()
    }
  }

  async generateWorldConflicts(worldContext: string, conflictCount: number = 3): Promise<any> {
    const prompt = `Create ${conflictCount} distinct conflicts for this world: "${worldContext}"

For each conflict, generate:
- Name
- Type (war/political/religious/economic/cultural)
- Parties involved
- Description of the conflict
- Current status (ongoing/resolved/escalating/dormant)
- Impact level (local/regional/global)
- Historical context
- Potential resolution

Make conflicts realistic and interconnected.

Return as a structured array of conflicts.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackConflicts()
      }
    } catch (error) {
      console.error('Error generating conflicts:', error)
      return this.getFallbackConflicts()
    }
  }

  async generateWorldLocations(worldContext: string, locationCount: number = 5): Promise<any> {
    const prompt = `Create ${locationCount} distinct locations for this world: "${worldContext}"

For each location, generate:
- Name
- Type (city/forest/mountain/desert/ocean/plains/tundra/jungle)
- Climate description
- Available resources
- Dangers and threats
- Inhabitants (who lives there)
- Detailed description
- Cultural significance

Make each location unique and atmospheric.

Return as a structured array of locations.`

    try {
      const response = await this.generateWithGemini(prompt)
      try {
        return JSON.parse(response)
      } catch {
        return this.getFallbackLocations()
      }
    } catch (error) {
      console.error('Error generating locations:', error)
      return this.getFallbackLocations()
    }
  }

  // Fallback data generators
  private getFallbackTimeline() {
    return [
      {
        id: "1",
        year: "Year 0",
        title: "The Great Founding",
        description: "The first civilization establishes itself in the fertile valleys",
        importance: "critical",
        category: "cultural"
      },
      {
        id: "2",
        year: "Year 150",
        title: "The Mage Wars",
        description: "A devastating conflict between different magical schools",
        importance: "high",
        category: "magical"
      }
    ]
  }

  private getFallbackMap() {
    return [
      {
        id: "1",
        name: "Capital City",
        type: "city",
        coordinates: { x: 50, y: 50 },
        description: "The bustling capital of the realm",
        population: 100000,
        ruler: "King Aldric",
        resources: ["trade", "magic", "crafts"]
      }
    ]
  }

  private getFallbackLanguages() {
    return [
      {
        id: "1",
        name: "Common Tongue",
        speakers: ["Humans", "Elves"],
        script: "Latin-based",
        complexity: "moderate",
        samplePhrases: ["Hello", "Thank you", "Goodbye"],
        grammar: "Subject-Verb-Object structure"
      }
    ]
  }

  private getFallbackReligions() {
    return [
      {
        id: "1",
        name: "The Light Faith",
        followers: ["Humans"],
        beliefs: ["Goodness", "Justice", "Mercy"],
        practices: ["Prayer", "Charity"],
        deities: ["The Light One"],
        holyTexts: ["The Book of Light"]
      }
    ]
  }

  private getFallbackCultures() {
    return [
      {
        id: "1",
        name: "The Northern Folk",
        description: "Hardy people of the mountains",
        values: ["Honor", "Strength", "Loyalty"],
        traditions: ["Coming of age rituals"],
        art: ["Stone carving", "Metalwork"],
        music: ["War drums", "Hunting songs"],
        food: ["Game meat", "Root vegetables"],
        clothing: ["Fur cloaks", "Leather armor"]
      }
    ]
  }

  private getFallbackConflicts() {
    return [
      {
        id: "1",
        name: "The Border Wars",
        type: "war",
        parties: ["Northern Kingdom", "Southern Empire"],
        description: "Ongoing territorial disputes",
        status: "ongoing",
        impact: "regional"
      }
    ]
  }

  private getFallbackLocations() {
    return [
      {
        id: "1",
        name: "The Whispering Woods",
        type: "forest",
        climate: "Temperate with magical properties",
        resources: ["Magical herbs", "Ancient trees"],
        dangers: ["Wild beasts", "Lost spirits"],
        inhabitants: ["Forest elves", "Wild animals"],
        description: "A mystical forest where the trees seem to speak"
      }
    ]
  }

  // RAG-powered world development methods
  async generateCharacterDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop a character for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed character development including:
- Character background and history
- Personality traits and motivations
- Relationships with other characters
- Skills and abilities
- Character arc potential
- How they fit into the world's culture and society

Make it consistent with the existing world and engaging for storytelling.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating character development:', error)
      return `Character Development: Based on your query "${query}", here's a character that fits well into your world's context. This character should have clear motivations, interesting relationships, and potential for growth throughout your story.`
    }
  }

  async generateLocationDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop a location for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed location development including:
- Physical description and geography
- Climate and environmental features
- Inhabitants and culture
- Notable landmarks and features
- Resources and dangers
- Historical significance
- How it connects to other locations

Make it consistent with the existing world and rich with storytelling potential.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating location development:', error)
      return `Location Development: Based on your query "${query}", here's a location that enhances your world. This place should have unique characteristics, interesting inhabitants, and connections to your world's broader narrative.`
    }
  }

  async generateCulturalDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop cultural aspects for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed cultural development including:
- Social structures and hierarchies
- Traditions and customs
- Religious beliefs and practices
- Art, music, and literature
- Food and cuisine
- Clothing and fashion
- Language and communication
- Values and moral codes

Make it consistent with the existing world and culturally rich.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating cultural development:', error)
      return `Cultural Development: Based on your query "${query}", here are cultural elements that deepen your world. These traditions, beliefs, and practices should feel authentic and interconnected with your world's history and geography.`
    }
  }

  async generateHistoricalDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop historical events for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed historical development including:
- Key historical events and their causes
- Important figures and their impact
- Wars, conflicts, and their consequences
- Cultural and technological developments
- Timeline of significant events
- How history affects the present
- Historical mysteries and legends

Make it consistent with the existing world and historically rich.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating historical development:', error)
      return `Historical Development: Based on your query "${query}", here are historical events that shape your world. These events should have clear causes and consequences, and help explain how your world reached its current state.`
    }
  }

  async generateMagicSystemDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop the magic system for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed magic system development including:
- How magic works and its source
- Who can use magic and how they learn
- Different types of magic and their applications
- Limitations and costs of magic
- Magical creatures and entities
- Magical artifacts and their significance
- How magic affects society and politics
- Magical laws and regulations

Make it consistent with the existing world and internally logical.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating magic system development:', error)
      return `Magic System Development: Based on your query "${query}", here's how magic works in your world. The system should have clear rules, interesting limitations, and meaningful impact on your world's society and culture.`
    }
  }

  async generatePoliticalDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop political systems for this ${genre} world:

World Context: ${context}

User Query: "${query}"

Provide detailed political development including:
- Government structure and leadership
- Political parties and factions
- Laws and legal systems
- International relations and diplomacy
- Political conflicts and tensions
- Power struggles and intrigue
- How politics affects everyday life
- Political history and evolution

Make it consistent with the existing world and politically complex.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating political development:', error)
      return `Political Development: Based on your query "${query}", here are political elements that add depth to your world. The political system should feel realistic and have clear implications for your characters and story.`
    }
  }

  async generateGeneralWorldDevelopment(query: string, context: string, genre: string): Promise<string> {
    const prompt = `Based on this world context and user query, develop your ${genre} world further:

World Context: ${context}

User Query: "${query}"

Provide comprehensive world development including:
- How this development fits into the existing world
- Connections to other world elements
- Potential story implications
- New details that enhance the world
- Suggestions for further development
- How this affects characters and locations

Make it consistent with the existing world and expand it meaningfully.`

    try {
      const response = await this.generateWithGemini(prompt)
      return response.trim()
    } catch (error) {
      console.error('Error generating general world development:', error)
      return `World Development: Based on your query "${query}", here are ways to expand and deepen your world. This development should feel natural and enhance the overall richness of your fictional universe.`
    }
  }
}

export const geminiAI = GeminiAIService.getInstance()
export type { StoryIdea, Character, VoiceAnalysis }
