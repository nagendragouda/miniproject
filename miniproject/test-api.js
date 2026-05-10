const http = require('http');

console.log('Testing API endpoints...\n');

// Test 1: GET /api/quiz/past-results
console.log('=== TEST 1: GET /api/quiz/past-results ===');
const options1 = {
  hostname: 'localhost',
  port: 3001,
  path: '/api/quiz/past-results',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req1 = http.request(options1, (res) => {
  console.log(\Status: \\);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      try {
        const jsonData = JSON.parse(data);
        console.log('Response (JSON):');
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('Response (Raw - first 500 chars):');
        console.log(data.substring(0, 500));
      }
    }
    testPostEndpoint();
  });
});

req1.on('error', (error) => {
  console.error('Error:', error);
});

req1.end();

function testPostEndpoint() {
  console.log('\n\n=== TEST 2: POST /api/quiz/submit ===');
  
  const payload = {
    responses: [
      {"questionId": "1", "answer": "Collaborative team environment", "question": "Work environment", "type": "multiple_choice"},
      {"questionId": "3", "answer": ["Creating and designing", "Building and coding"], "question": "Engaging activities", "type": "multi_select"}
    ],
    personalInfo: {
      interests: ["Creating and designing", "Building and coding"],
      skills: ["JavaScript", "Problem Solving"],
      experience: "beginner"
    }
  };
  
  const postData = JSON.stringify(payload);
  
  const options2 = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/quiz/submit',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  const req2 = http.request(options2, (res) => {
    console.log(\Status: \\);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const jsonData = JSON.parse(data);
        console.log('Response (JSON):');
        console.log(JSON.stringify(jsonData, null, 2));
      } catch (e) {
        console.log('Response (Raw - first 500 chars):');
        console.log(data.substring(0, 500));
      }
    });
  });
  
  req2.on('error', (error) => {
    console.error('Error:', error);
  });
  
  req2.write(postData);
  req2.end();
}
