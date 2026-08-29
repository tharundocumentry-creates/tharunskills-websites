import fs from 'fs';
import path from 'path';

const portfolioDir = path.join(process.cwd(), 'public', 'portfolio');
const data = {};

// Structure we want:
// {
//   "3d animator": {
//     "animation stories": [ {name, url}, ... ],
//     "explainers": []
//   }
// }

function generate() {
  const categories = fs.readdirSync(portfolioDir).filter(f => fs.statSync(path.join(portfolioDir, f)).isDirectory());
  
  for (const category of categories) {
    data[category] = {};
    const catPath = path.join(portfolioDir, category);
    const subcategories = fs.readdirSync(catPath).filter(f => fs.statSync(path.join(catPath, f)).isDirectory());
    
    for (const sub of subcategories) {
      data[category][sub] = [];
      const subPath = path.join(catPath, sub);
      const files = fs.readdirSync(subPath)
        .filter(f => fs.statSync(path.join(subPath, f)).isFile())
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
      
      for (const file of files) {
        data[category][sub].push({
          name: file,
          url: `/portfolio/${category}/${sub}/${file}`
        });
      }
    }
  }
}

generate();

fs.writeFileSync(
  path.join(process.cwd(), 'src', 'portfolioData.json'),
  JSON.stringify(data, null, 2)
);
console.log('portfolioData.json generated successfully!');
