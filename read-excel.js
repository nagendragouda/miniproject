const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

try {
  const filePath = path.join(__dirname, 'Education_Career_Pathways_Complete (1).xlsx');
  console.log('Reading file:', filePath);
  
  const workbook = XLSX.readFile(filePath);
  console.log('Sheet names:', workbook.SheetNames);
  
  // Get all sheets data
  const allData = {};
  workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    allData[sheetName] = data;
    console.log(`\n=== ${sheetName} ===`);
    console.log(JSON.stringify(data, null, 2).substring(0, 2000));
  });
  
  // Save to JSON
  fs.writeFileSync(path.join(__dirname, 'excel-data.json'), JSON.stringify(allData, null, 2));
  console.log('\n✅ Data saved to excel-data.json');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
