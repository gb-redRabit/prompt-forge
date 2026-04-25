import fs from 'fs';
import path from 'path';

const sourceIcon = 'C:/Users/bejta/.gemini/antigravity/brain/fbb5a587-b3d3-40b2-a58c-3a0c74a119be/prompt_forge_icon_1777158193774.png';
const publicDir = 'd:/git/prompt-forge/public';

const targetFiles = [
  'icon-64x64.png',
  'icon-192x192.png',
  'icon-512x512.png',
  'favicon.png'
];

async function updateIcons() {
  if (!fs.existsSync(sourceIcon)) {
    console.error('Source icon not found at:', sourceIcon);
    return;
  }

  for (const file of targetFiles) {
    const targetPath = path.join(publicDir, file);
    try {
      fs.copyFileSync(sourceIcon, targetPath);
      console.log(`Updated: ${file}`);
    } catch (err) {
      console.error(`Failed to update ${file}:`, err);
    }
  }
  
  console.log('All icons updated successfully!');
}

updateIcons();
