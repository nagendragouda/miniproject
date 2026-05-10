/**
 * Mock Education Level Guidance
 * Restored to fix build/runtime errors after file loss
 */

export type EducationLevel = '10th' | 'PUC' | 'Graduation';

export function generateEducationLevelGuidance(level: EducationLevel, score: any, topCareers?: any[]) {
  console.log('Using mock generateEducationLevelGuidance');
  return {
    type: level === '10th' ? 'STREAM_GUIDANCE' : level === 'PUC' ? 'DEGREE_GUIDANCE' : 'CAREER_GUIDANCE',
    educationLevel: level,
    recommendedStream: 'Science (PCMC)',
    whyThisStream: 'Your logical score is high.',
    steps: {
      step1: 'Complete current level',
      step2: 'Choose relevant stream/degree',
      step3: 'Build projects',
      step4: 'Apply for internships'
    },
    finalCareerOptions: topCareers ? topCareers.map(c => c.name) : ['Software Engineer', 'Data Scientist']
  };
}

export function formatGuidanceForUI(guidance: any) {
  return `### Guidance for ${guidance.educationLevel}\n\nBased on your profile, we recommend focusing on **${guidance.recommendedStream || 'your current path'}**. \n\n**Next Steps:**\n1. ${guidance.steps.step1}\n2. ${guidance.steps.step2}`;
}
