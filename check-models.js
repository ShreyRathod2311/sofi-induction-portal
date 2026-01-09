// Quick script to check available Gemini models
import { readFileSync } from 'fs';

// Read .env.local file manually
const envContent = readFileSync('.env.local', 'utf-8');
const apiKeyLine = envContent.split('\n').find(line => line.startsWith('VITE_GEMINI_API_KEY='));
const apiKey = apiKeyLine.split('=')[1].trim();

async function listModels() {
  try {
    console.log('Fetching available models...\n');
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log('Available models:');
    console.log('='.repeat(60));
    
    data.models.forEach(model => {
      console.log(`\nModel ID: ${model.name.split('/').pop()}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Description: ${model.description}`);
      console.log(`Supports: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('-'.repeat(60));
    });
    
    console.log('\n✓ Use one of these model IDs in evaluationService.ts');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

listModels();
