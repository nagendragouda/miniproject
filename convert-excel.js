const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read the Excel file
const filePath = path.join(__dirname, 'Education_Career_Pathways_Complete (1).xlsx');
const workbook = XLSX.readFile(filePath);

// Convert all sheets to JSON
const allData = {};
workbook.SheetNames.forEach(sheetName => {
  const worksheet = workbook.Sheets[sheetName];
  allData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
});

// Save to JSON file
const outputPath = path.join(__dirname, 'excel-data.json');
fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));

console.log(`Successfully converted Excel file to JSON`);
console.log(`Total sheets: ${workbook.SheetNames.length}`);
console.log(`Sheet names: ${workbook.SheetNames.join(', ')}`);
console.log(`\nData saved to: ${outputPath}`);
console.log(`\n--- Excel Data Preview ---`);
console.log(JSON.stringify(allData, null, 2));
