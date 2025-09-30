const { PrismaClient } = require('@prisma/client')

async function checkDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔍 Checking Database Contents...\n')
    
    // Check users
    const users = await prisma.user.findMany()
    console.log('👥 Users:', users.length)
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.subscriptionTier}`)
    })
    
    // Check stories
    const stories = await prisma.story.findMany()
    console.log('\n📚 Stories:', stories.length)
    stories.forEach(story => {
      console.log(`  - "${story.title}" (${story.genre}) - ${story.wordCount} words`)
    })
    
    // Check AI generations
    const generations = await prisma.aIGeneration.findMany()
    console.log('\n🤖 AI Generations:', generations.length)
    generations.forEach(gen => {
      console.log(`  - ${gen.type}: ${gen.generatedContent?.substring(0, 50)}...`)
    })
    
    // Check story ideas
    const storyIdeas = await prisma.storyIdea.findMany()
    console.log('\n💡 Story Ideas:', storyIdeas.length)
    storyIdeas.forEach(idea => {
      console.log(`  - "${idea.title}" (${idea.genre})`)
    })
    
    // Check saved characters
    const characters = await prisma.savedCharacter.findMany()
    console.log('\n👤 Saved Characters:', characters.length)
    characters.forEach(char => {
      console.log(`  - ${char.name} (${char.role})`)
    })
    
    // Check saved plots
    const plots = await prisma.savedPlot.findMany()
    console.log('\n📖 Saved Plots:', plots.length)
    plots.forEach(plot => {
      console.log(`  - "${plot.title}"`)
    })
    
    // Check saved dialogues
    const dialogues = await prisma.savedDialogue.findMany()
    console.log('\n💬 Saved Dialogues:', dialogues.length)
    dialogues.forEach(dialogue => {
      console.log(`  - "${dialogue.title}"`)
    })
    
    console.log('\n✅ Database check completed!')
    
  } catch (error) {
    console.error('❌ Database check failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
