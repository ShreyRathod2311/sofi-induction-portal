#!/usr/bin/env node

/**
 * Configuration Helper Script
 * This script helps you configure your Supabase credentials
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SUPABASE_URL = 'https://hbydnuuzcdkcfimlwsyd.supabase.co';

console.log('\n🔧 SoFI Induction Portal - Configuration Setup\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('📍 Supabase Project URL:', SUPABASE_URL);
console.log('📍 Project ID: hbydnuuzcdkcfimlwsyd\n');
console.log('To get your Supabase Anon Key:');
console.log('1. Visit: https://supabase.com/dashboard/project/hbydnuuzcdkcfimlwsyd/settings/api');
console.log('2. Copy the "anon" public key\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

rl.question('Paste your Supabase Anon Key here: ', (anonKey) => {
  if (!anonKey || anonKey.trim().length < 20) {
    console.error('\n❌ Error: Invalid anon key. Please try again.\n');
    rl.close();
    process.exit(1);
  }

  const trimmedKey = anonKey.trim();

  // Update client.ts
  const clientPath = path.join(__dirname, 'src', 'integrations', 'supabase', 'client.ts');
  let clientContent = fs.readFileSync(clientPath, 'utf8');
  clientContent = clientContent.replace(
    'YOUR_SUPABASE_ANON_KEY_HERE',
    trimmedKey
  );
  fs.writeFileSync(clientPath, clientContent);
  console.log('✅ Updated: src/integrations/supabase/client.ts');

  // Update .env.local
  const envPath = path.join(__dirname, '.env.local');
  let envContent = fs.readFileSync(envPath, 'utf8');
  envContent = envContent.replace(
    'YOUR_SUPABASE_ANON_KEY_HERE',
    trimmedKey
  );
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Updated: .env.local');

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log('✨ Configuration complete!\n');
  console.log('Next steps:');
  console.log('1. Run database migrations:');
  console.log('   supabase db push');
  console.log('\n2. Start the dev server:');
  console.log('   npm run dev\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  rl.close();
});
