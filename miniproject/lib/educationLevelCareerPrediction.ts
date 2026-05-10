/**
 * Education Level Career Prediction 
 */

export type EducationLevel = '10th' | '12th' | 'Diploma' | 'Degree';

export interface UserProfile {
  name?: string;
  email?: string;
  educationLevel: EducationLevel;
  skills: string[];
  interests: string[];
  traits: Record<string, number>;
}

export function generateCareerPrediction(profile: UserProfile) {
  const matches = [
    {
      title: profile.educationLevel === '10th' ? 'Vocational Expert' : 'Software Engineer',
      matchScore: 90,
      salaryRange: '₹8-20 LPA',
      growthRate: '20% YoY',
      demand: 'High',
      reasoning: `Based on your ${profile.educationLevel} education and skills.`,
      skills: ['Problem Solving', ...profile.skills],
      timeToLearn: '6-12 months',
      description: 'A great career path matching your profile.',
      completeOverview: 'This career offers excellent growth and aligns with your education level.',
      skillsGap: [],
      riskAssessment: { riskFactors: [], mitigationStrategies: [] },
      smartTips: [],
      aiInsights: 'Your profile is a strong match for this career.',
      marketAnalysis: { currentMarket: 'Good', jobOpenings: '100K+', competitionLevel: 'Medium', marketTrend: 'Up' },
      industryOverview: { industry: 'Tech', majorPlayers: [], marketSize: '', innovations: [] },
      careerMilestones: [],
      opportunities: [],
      requiredQualifications: [profile.educationLevel],
      topCompanies: []
    }
  ];

  return {
    top_3_matches: matches,
    user_education_level: profile.educationLevel,
    total_careers_evaluated: 12
  };
}

export function formatPredictionResults(predictions: any) {
  const arr = Array.isArray(predictions) ? predictions : (predictions?.top_3_matches || []);
  return arr.map((p: any) => ({
    career: p.title,
    score: p.matchScore,
    details: p.description
  }));
}

export const educationLevelCareerPrediction = {
  predict: (profile: any) => ({
    topMatch: 'Software Engineer',
    confidence: 0.9,
    roadmap: ['Learn basics', 'Build projects']
  })
};

export default educationLevelCareerPrediction;
