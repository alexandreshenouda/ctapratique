const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../assets/documents.csv');
const outputPath = path.join(__dirname, '../html-site/data/documents.json');

try {
  // Lire le fichier CSV
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Extraire les headers et nettoyer les retours chariot
  const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, ''));
  
  // Parser les documents
  const documents = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    if (values.length >= headers.length) {
      const doc = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim().replace(/\r/g, '');
        if (value && value !== '') {
          doc[header] = value;
        }
      });
      documents.push(doc);
    }
  }
  
  // Créer l'output JSON
  const output = {
    documents: documents,
    metadata: {
      totalDocuments: documents.length,
      lastUpdated: new Date().toISOString(),
      version: '1.0.0'
    }
  };
  
  // Écrire le fichier JSON
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  
  console.log('✅ Documents JSON generated successfully!');
  console.log(`📄 Input: ${csvPath}`);
  console.log(`📄 Output: ${outputPath}`);
  console.log(`📊 Total documents: ${documents.length}`);
} catch (error) {
  console.error('❌ Error generating documents JSON:', error);
  process.exit(1);
}

