import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import PdfParse from 'pdf-parse';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No resume provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = "";
    try {
      const pdfData = await PdfParse(buffer);
      resumeText = pdfData.text?.trim() || "";
    } catch (e: any) {
      resumeText = buffer.toString('utf8').replace(/[^\x20-\x7E\n]/g, '');
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ success: false, error: 'Could not extract text from the PDF' }, { status: 400 });
    }

    // Use OpenRouter to extract top job title and keywords to bypass Gemini API blocks
    const openRouterKey = process.env.OPENROUTER_API_KEY || '';
    const prompt = `You are an expert HR. Analyze this resume and extract the most likely target job title that the person should apply for, and a short list of 3 top technical skills.
    Respond strictly in JSON format like this: {"job_title": "Frontend Developer", "keywords": ["React", "TypeScript", "Tailwind"]}.
    Resume Text: ${resumeText.substring(0, 5000)}`;

    let aiData = { job_title: 'Software Developer', keywords: [] };
    
    try {
      const orResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3-8b-instruct:free',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });

      if (orResponse.ok) {
        const orData = await orResponse.json();
        const text = orData.choices[0].message.content;
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        if (jsonStart !== -1 && jsonEnd !== 0) {
          aiData = JSON.parse(text.substring(jsonStart, jsonEnd));
        }
      } else {
        console.warn('OpenRouter failed, falling back to default job title');
      }
    } catch (aiErr) {
      console.warn('AI Parsing error, using fallback:', aiErr);
    }

    const jobTitle = aiData.job_title || 'Developer';
    
    // Call Adzuna API
    const rawKey = process.env.ADZUNA_APP_KEY || 'ad31f8fe49040d715dd9d7ac676430a4';
    const appId = process.env.ADZUNA_APP_ID || 'af563a82'; // Correct App ID provided by user
    
    // Search strictly in India (in) as requested
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${appId}&app_key=${rawKey}&results_per_page=15&what=${encodeURIComponent(jobTitle)}`;
    
    let jobs = [];
    
    try {
      const adzunaRes = await fetch(adzunaUrl);
      if (adzunaRes.ok) {
        const adzunaData = await adzunaRes.json();
        jobs = adzunaData.results || [];
      } else {
        throw new Error('Adzuna Auth Failed');
      }
    } catch (apiError) {
      console.warn('Adzuna API failed, falling back to Remotive Free API...', apiError);
      // Fallback to Remotive Public API (No Auth Required)
      const remotiveUrl = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(jobTitle)}&limit=15`;
      const remotiveRes = await fetch(remotiveUrl);
      if (remotiveRes.ok) {
        const remotiveData = await remotiveRes.json();
        // Map Remotive to Adzuna format so frontend works seamlessly
        jobs = (remotiveData.jobs || []).slice(0, 15).map((job: any) => ({
          id: job.id,
          redirect_url: job.url,
          title: job.title,
          company: { display_name: job.company_name },
          category: { label: job.category },
          location: { display_name: job.candidate_required_location },
          salary_min: null,
          salary_max: null,
          description: job.description
        }));
      } else {
        return NextResponse.json({ 
          success: false, 
          error: `Both Adzuna and Fallback APIs failed. Please check your Adzuna App ID and Key.` 
        }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      jobs: jobs,
      extractedTitle: jobTitle,
      keywords: aiData.keywords
    });

  } catch (err: any) {
    console.error('Job hunt error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
