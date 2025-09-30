// Script to fix plain text passwords in the database
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixPasswords() {
  console.log('🔧 Fixing plain text passwords...\n');

  try {
    // Get all users
    const users = await prisma.user.findMany();
    console.log(`📊 Found ${users.length} users in database`);

    for (const user of users) {
      // Check if password looks like plain text (not bcrypt hash)
      if (user.password && !user.password.startsWith('$2b$')) {
        console.log(`🔧 Fixing password for user: ${user.email}`);
        
        // Hash the plain text password
        const hashedPassword = await bcrypt.hash(user.password, 12);
        
        // Update the user with hashed password
        await prisma.user.update({
          where: { id: user.id },
          data: { password: hashedPassword }
        });
        
        console.log(`✅ Password fixed for ${user.email}`);
      } else if (user.password && user.password.startsWith('$2b$')) {
        console.log(`✅ Password already hashed for ${user.email}`);
      } else {
        console.log(`⚠️  No password found for ${user.email}`);
      }
    }

    console.log('\n🎉 Password fixing completed!');
    console.log('\n📋 Test Instructions:');
    console.log('1. Try signing up with new credentials');
    console.log('2. Try logging in with those same credentials');
    console.log('3. Should now work perfectly!');

  } catch (error) {
    console.error('❌ Error fixing passwords:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixPasswords();

