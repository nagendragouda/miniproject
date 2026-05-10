// Comprehensive Education Progression & Roadmap Data
// Maps current education to next step with concrete, actionable milestones

export interface EducationLevel {
  level: string
  abbreviation: string
  nextLevels: string[]
  duration: string
  entranceExams?: string[]
}

export interface EducationTransition {
  from: string
  to: string
  duration: string
  keySkills: string[]
  tasks: Array<{
    title: string
    duration: string
    description: string
  }>
  resources: Array<{
    title: string
    type: string
    url?: string
  }>
  projects: Array<{
    title: string
    description: string
    duration: string
    difficulty: string
  }>
  commonMistakes: string[]
  timeline: {
    month1_2: string
    month3_6: string
    month7_12: string
  }
}

// ===== EDUCATION LEVELS =====
export const EDUCATION_LEVELS: Record<string, EducationLevel> = {
  '10th Grade': {
    level: '10th Grade',
    abbreviation: '10',
    nextLevels: ['11th & 12th Grade', 'Vocational Training'],
    duration: '1 year',
    entranceExams: ['Board Exams']
  },
  '12th Grade / PUC': {
    level: '12th Grade / PUC',
    abbreviation: '12',
    nextLevels: [
      'B.Tech',
      'B.Sc',
      'B.A',
      'B.Com',
      'Diploma',
      'Professional Courses'
    ],
    duration: '1 year (11th) + 1 year (12th)',
    entranceExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'NEET']
  },
  'Diploma': {
    level: 'Diploma',
    abbreviation: 'Diploma',
    nextLevels: ['B.Tech (Lateral Entry)', 'B.Sc', 'Jobs'],
    duration: '3 years',
    entranceExams: ['Board entrance']
  },
  'B.Tech': {
    level: 'B.Tech (Bachelor of Technology)',
    abbreviation: 'B.Tech',
    nextLevels: ['M.Tech', 'MBA', 'MS', 'Jobs', 'Professional Courses'],
    duration: '4 years',
    entranceExams: ['JEE', 'BITSAT', 'Gate (for M.Tech)']
  },
  'B.Sc': {
    level: 'B.Sc (Bachelor of Science)',
    abbreviation: 'B.Sc',
    nextLevels: ['M.Sc', 'M.Tech', 'Ph.D', 'Jobs'],
    duration: '3 years',
    entranceExams: []
  },
  'B.A': {
    level: 'B.A (Bachelor of Arts)',
    abbreviation: 'B.A',
    nextLevels: ['M.A', 'MBA', 'Jobs', 'Civil Services'],
    duration: '3 years',
    entranceExams: []
  },
  'B.Com': {
    level: 'B.Com (Bachelor of Commerce)',
    abbreviation: 'B.Com',
    nextLevels: ['M.Com', 'MBA', 'CA/CS/CMA', 'Jobs'],
    duration: '3 years',
    entranceExams: []
  },
  'M.Tech': {
    level: 'M.Tech (Master of Technology)',
    abbreviation: 'M.Tech',
    nextLevels: ['PhD', 'Jobs', 'Research'],
    duration: '2 years',
    entranceExams: ['GATE']
  },
  'MBA': {
    level: 'MBA (Master of Business Administration)',
    abbreviation: 'MBA',
    nextLevels: ['PhD', 'Jobs', 'Entrepreneurship'],
    duration: '2 years',
    entranceExams: ['CAT', 'GMAT', 'NMAT', 'XAT']
  },
  'M.A': {
    level: 'M.A (Master of Arts)',
    abbreviation: 'M.A',
    nextLevels: ['PhD', 'Jobs', 'Civil Services'],
    duration: '2 years',
    entranceExams: []
  },
}

// ===== EDUCATION TRANSITIONS =====
export const EDUCATION_TRANSITIONS: Record<string, EducationTransition> = {
  '10th-to-12th': {
    from: '10th Grade',
    to: '12th Grade / PUC',
    duration: '2 years (11th + 12th)',
    keySkills: [
      'Subject Specialization',
      'Board Exam Preparation',
      'Time Management',
      'Conceptual Understanding'
    ],
    tasks: [
      {
        title: 'Stream Selection',
        duration: '1 month',
        description: 'Evaluate interests and aptitude. Choose between Science (PCM/PCB), Commerce, or Humanities.'
      },
      {
        title: 'Curriculum Mastery',
        duration: '18 months',
        description: 'Complete 11th standard curriculum covering new subjects. Build strong foundation in all core subjects.'
      },
      {
        title: 'Advanced Topics (12th)',
        duration: '12 months',
        description: 'Study 12th standard advanced concepts. Deep dive into Physics, Chemistry, Mathematics/Biology, History, etc.'
      },
      {
        title: 'Board Exam Preparation',
        duration: '3-4 months',
        description: 'Intensive revision, solving previous papers, mock tests, and doubt clearance sessions.'
      },
      {
        title: 'Competitive Exam Coaching (Optional)',
        duration: 'Parallel with 12th',
        description: 'Start JEE/NEET coaching if planning for entrance exams for competitive colleges.'
      }
    ],
    resources: [
      {
        title: 'NCERT Textbooks',
        type: 'Official Curriculum',
        url: 'https://ncert.nic.in'
      },
      {
        title: 'Khan Academy',
        type: 'Free Video Lectures',
        url: 'https://www.khanacademy.org'
      },
      {
        title: 'Previous Year Board Papers',
        type: 'Practice Material'
      },
      {
        title: 'Coaching Centers (Optional)',
        type: 'Guidance & Mentoring'
      }
    ],
    projects: [
      {
        title: 'Science Fair Project',
        description: 'Create an experimental project showcasing physics, chemistry, or biology concepts.',
        duration: '2-3 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Research Essay',
        description: 'Write detailed essays on historical events or geographical topics to improve content knowledge.',
        duration: '3-4 weeks',
        difficulty: 'Beginner'
      },
      {
        title: 'Math Problem Solving',
        description: 'Maintain a notebook of challenging math problems and their solutions for revision.',
        duration: 'Ongoing',
        difficulty: 'Intermediate'
      }
    ],
    commonMistakes: [
      'Choosing stream based on peer pressure instead of personal interest',
      'Delaying entrance exam preparation until 12th',
      'Not maintaining consistency in studies',
      'Ignoring practical/lab components',
      'Over-relying on coaching without self-study'
    ],
    timeline: {
      month1_2: 'Complete 11th stream selection, get materials, start curriculum.',
      month3_6: 'Build strong foundation in all 11th subjects. Begin coaching if interested.',
      month7_12: 'Complete 11th, move to 12th curriculum. Continue coaching for entrance exams.'
    }
  },

  '12th-to-BTech': {
    from: '12th Grade / PUC',
    to: 'B.Tech (Engineering)',
    duration: '6 months - 1 year preparation + 4 years degree',
    keySkills: [
      'Advanced Mathematics',
      'Physics & Chemistry',
      'Problem Solving',
      'Engineering Fundamentals',
      'Competitive Exam Skills'
    ],
    tasks: [
      {
        title: 'Competitive Entrance Exam Prep',
        duration: '6-8 months',
        description: 'Prepare for JEE Main/Advanced, BITSAT, or other state entrance exams.'
      },
      {
        title: 'Take Entrance Exams',
        duration: '2-3 months',
        description: 'Appear for JEE Main (January, April), JEE Advanced (May), BITSAT, state exams.'
      },
      {
        title: 'College Selection & Counselling',
        duration: '1-2 months',
        description: 'Participate in counselling rounds. Select best college and specialization based on rank.'
      },
      {
        title: 'Engineering Fundamentals Refresher',
        duration: '1 month',
        description: 'Refresh basics before college starts. Prepare for first semester curriculum.'
      },
      {
        title: 'B.Tech Year 1: Core Concepts',
        duration: '12 months',
        description: 'Master engineering mathematics, physics, chemistry, and basic engineering across all branches.'
      }
    ],
    resources: [
      {
        title: 'JEE Main Official Website',
        type: 'Official Portal',
        url: 'https://jeemain.nta.ac.in'
      },
      {
        title: 'Unacademy / Vedantu',
        type: 'Online Coaching',
        url: 'https://www.unacademy.com'
      },
      {
        title: 'Previous Year JEE Papers',
        type: 'Practice Material'
      },
      {
        title: 'College Library Resources',
        type: 'Academic Materials'
      }
    ],
    projects: [
      {
        title: 'Physics Experiment Documentation',
        description: 'Document 3-4 significant physics experiments with theory and observations.',
        duration: '2 months',
        difficulty: 'Beginner'
      },
      {
        title: 'Math Problem Solving Repository',
        description: 'Create solutions manual for 200+ competitive exam math problems.',
        duration: '3 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Engineering Introduction Project',
        description: 'Simple engineering project like water rocket, bridge model, or circuit design.',
        duration: '1-2 months',
        difficulty: 'Intermediate'
      }
    ],
    commonMistakes: [
      'Starting entrance exam prep too late (start in 11th)',
      'Not choosing specialized coaching early',
      'Focusing only on JEE ignoring college marks',
      'Not practicing mock tests regularly',
      'Giving up after first attempt'
    ],
    timeline: {
      month1_2: 'Enroll in entrance exam coaching. Start systematic preparation.',
      month3_6: 'Complete coaching curriculum. Regular mock tests. Identify weak areas.',
      month7_12: 'Intensive revision. Multiple mock tests. Appear for exams. Results and counselling.'
    }
  },

  '12th-to-BSc': {
    from: '12th Grade / PUC',
    to: 'B.Sc (Science)',
    duration: '3-4 years',
    keySkills: [
      'Scientific Research',
      'Laboratory Skills',
      'Data Analysis',
      'Critical Thinking',
      'Academic Writing'
    ],
    tasks: [
      {
        title: 'College Admission',
        duration: '2-3 months',
        description: 'Apply to colleges. Participate in merit-based selection or entrance exams.'
      },
      {
        title: 'Specialization Selection',
        duration: '1 month',
        description: 'Choose between Physics, Chemistry, Biology, or Mathematics as specialization.'
      },
      {
        title: 'Year 1: Foundation Courses',
        duration: '12 months',
        description: 'Complete foundational courses in chosen subjects and general electives.'
      },
      {
        title: 'Year 2: Intermediate Concepts',
        duration: '12 months',
        description: 'Intermediate level coursework with increased practical/lab components.'
      },
      {
        title: 'Year 3: Advanced Studies & Research',
        duration: '12 months',
        description: 'Advanced topics, research projects, internships in research institutions.'
      }
    ],
    resources: [
      {
        title: 'NCERT Science Books',
        type: 'Textbooks',
        url: 'https://ncert.nic.in'
      },
      {
        title: 'Scientific Journals (JSTOR)',
        type: 'Research Papers',
        url: 'https://www.jstor.org'
      },
      {
        title: 'Laboratory Manual',
        type: 'Practical Guide'
      },
      {
        title: 'Coursera Science Courses',
        type: 'Online Learning',
        url: 'https://www.coursera.org'
      }
    ],
    projects: [
      {
        title: 'Laboratory Report Series',
        description: 'Comprehensive reports of 5+ lab experiments with analysis and conclusions.',
        duration: '3 months',
        difficulty: 'Beginner'
      },
      {
        title: 'Research Paper Summary',
        description: 'Read and summarize 10+ research papers in your specialization.',
        duration: '4-5 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Capstone Research Project',
        description: 'Conduct original research project supervised by faculty.',
        duration: '4-6 months',
        difficulty: 'Advanced'
      }
    ],
    commonMistakes: [
      'Not focusing on practicals and lab work',
      'Choosing subjects based on peer pressure',
      'Ignoring research skills development',
      'Not exploring internship opportunities',
      'Weak foundation in fundamentals'
    ],
    timeline: {
      month1_2: 'College admission and subject selection. Join college.',
      month3_6: 'First semester foundation courses. Understand lab procedures.',
      month7_12: 'Intermediate coursework. Active participation in lab work. Start thinking of specialization.'
    }
  },

  '12th-to-Commerce': {
    from: '12th Grade / PUC',
    to: 'B.Com (Bachelor of Commerce)',
    duration: '3 years',
    keySkills: [
      'Accounting',
      'Business Analysis',
      'Financial Knowledge',
      'Business Communication',
      'Digital Literacy'
    ],
    tasks: [
      {
        title: 'College Admission',
        duration: '2-3 months',
        description: 'Apply to commerce colleges based on merit or entrance exams.'
      },
      {
        title: 'Subject Registration',
        duration: '1 month',
        description: 'Enroll in B.Com program. Choose optional subjects/electives wisely.'
      },
      {
        title: 'Year 1: Business Fundamentals',
        duration: '12 months',
        description: 'Learn accounting basics, economics, business organization, financial management fundamentals.'
      },
      {
        title: 'Year 2: Advanced Accounting & Business',
        duration: '12 months',
        description: 'Advanced accounting, taxation, company law, cost accounting, financial reporting.'
      },
      {
        title: 'Year 3: Specialization & Internships',
        duration: '12 months',
        description: 'Choose specialization (Finance, Taxation, Accounting). Internships in firms/CA offices.'
      }
    ],
    resources: [
      {
        title: 'Official Accounting Standards',
        type: 'Reference Material'
      },
      {
        title: 'ICAI Learning Platform',
        type: 'Professional Institute',
        url: 'https://www.icai.org'
      },
      {
        title: 'Accounting Software (Tally, SAP)',
        type: 'Practical Tools'
      },
      {
        title: 'Business News (ET, Mint)',
        type: 'Current Events'
      }
    ],
    projects: [
      {
        title: 'Accounting Case Studies',
        description: 'Solve 10+ real-world accounting problems and case studies.',
        duration: '2 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Business Analysis Report',
        description: 'Analyze financial statements of 3-5 real companies and present findings.',
        duration: '3 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Internship Portfolio',
        description: 'Document internship experience and projects completed at CA/finance firm.',
        duration: '3 months',
        difficulty: 'Intermediate'
      }
    ],
    commonMistakes: [
      'Not learning accounting software like Tally',
      'Ignoring practical training opportunities',
      'Not pursuing CA/CS certification alongside B.Com',
      'Weak mathematical foundation',
      'Not understanding real business scenarios'
    ],
    timeline: {
      month1_2: 'College admission. Learn basic accounting principles.',
      month3_6: 'Complete Year 1 coursework. Learn accounting software.',
      month7_12: 'Year 2 advanced subjects. Start CA/CS foundation course.'
    }
  },

  'BTech-to-MTech': {
    from: 'B.Tech (Engineering)',
    to: 'M.Tech (Master of Technology)',
    duration: '6 months preparation + 2 years degree',
    keySkills: [
      'Research Methodology',
      'Advanced Technical Knowledge',
      'Project Management',
      'Academic Writing',
      'Specialization Expertise'
    ],
    tasks: [
      {
        title: 'GATE Exam Preparation',
        duration: '6-8 months',
        description: 'Prepare for GATE (Graduate Aptitude Test in Engineering) exam covering your B.Tech specialization.'
      },
      {
        title: 'GATE Exam & Result',
        duration: '2-3 months',
        description: 'Appear for GATE exam. Wait for results. Scores valid for 3 years.'
      },
      {
        title: 'Institute Selection & Counselling',
        duration: '1-2 months',
        description: 'Participate in COMET counselling. Select NIT/IIT based on score and preference.'
      },
      {
        title: 'M.Tech Year 1: Theory & Coursework',
        duration: '12 months',
        description: 'Advanced courses in specialization. Core concepts and emerging technologies.'
      },
      {
        title: 'M.Tech Year 2: Thesis & Research',
        duration: '12 months',
        description: 'Major thesis work. Original research contribution. Publication in conferences/journals.'
      }
    ],
    resources: [
      {
        title: 'GATE Official Website',
        type: 'Official Portal',
        url: 'https://gate.iitd.ac.in'
      },
      {
        title: 'NPTEL (Lectures)',
        type: 'Free Online Courses',
        url: 'https://nptel.ac.in'
      },
      {
        title: 'Research Paper Databases',
        type: 'Academic Resources',
        url: 'https://scholar.google.com'
      },
      {
        title: 'Institute Research Labs',
        type: 'On-Campus Facilities'
      }
    ],
    projects: [
      {
        title: 'GATE Problem Solutions',
        description: 'Solve 500+ GATE previous year problems categorized by topic.',
        duration: '3-4 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Literature Review',
        description: 'Comprehensive survey of 50+ research papers in chosen thesis topic.',
        duration: '2-3 months',
        difficulty: 'Advanced'
      },
      {
        title: 'Thesis Research Project',
        description: 'Conduct original research and publish findings in conferences/journals.',
        duration: '12 months',
        difficulty: 'Advanced'
      }
    ],
    commonMistakes: [
      'Starting GATE prep too close to exam date',
      'Not focusing on numerical problem solving',
      'Choosing specialization without research interest',
      'Not maintaining research lab experience during B.Tech',
      'Poor time management during thesis'
    ],
    timeline: {
      month1_2: 'Analyze B.Tech subjects. Identify weak areas. Join GATE coaching.',
      month3_6: 'Complete GATE syllabus. Weekly mock tests. Revision cycles.',
      month7_12: 'Intensive revision. Full-length mock tests. Exam appearance and results.'
    }
  },

  'BTech-to-MBA': {
    from: 'B.Tech (Engineering)',
    to: 'MBA (Master of Business Administration)',
    duration: '6-12 months preparation + 2 years degree',
    keySkills: [
      'Business Acumen',
      'Leadership',
      'Management Strategy',
      'Financial Literacy',
      'Communication'
    ],
    tasks: [
      {
        title: 'MBA Entrance Exam Prep',
        duration: '6-8 months',
        description: 'Prepare for CAT, GMAT, NMAT, or XAT. Focus on Quant, Verbal, and Logic.'
      },
      {
        title: 'Take MBA Entrance Exams',
        duration: '3-4 months',
        description: 'Appear for multiple MBA entrance exams. Apply to business schools.'
      },
      {
        title: 'College Selection & Interview Prep',
        duration: '2-3 months',
        description: 'Short-list colleges. Prepare for GD (Group Discussion) and PI (Personal Interview).'
      },
      {
        title: 'MBA Year 1: Core Management Courses',
        duration: '12 months',
        description: 'Finance, Marketing, Operations, HR, Strategy. Case study analysis. Industry visits.'
      },
      {
        title: 'MBA Year 2: Specialization & Internship',
        duration: '12 months',
        description: 'Choose specialization. Summer internship. Capstone project. Career placement.'
      }
    ],
    resources: [
      {
        title: 'MBA Admission Portal (NMAT, CAT)',
        type: 'Official Portal',
        url: 'https://www.cat.nta.ac.in'
      },
      {
        title: 'Veritas Prep / Manhattan Prep',
        type: 'Online Coaching',
        url: 'https://www.veritasprep.com'
      },
      {
        title: 'LinkedIn Learning',
        type: 'Management Skills',
        url: 'https://www.linkedin.com/learning'
      },
      {
        title: 'HBR (Harvard Business Review)',
        type: 'Case Studies & Articles',
        url: 'https://hbr.org'
      }
    ],
    projects: [
      {
        title: 'CAT Mock Test Series',
        description: 'Complete 20+ full-length mock tests and analyze performance.',
        duration: '4-6 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Business Case Study Analysis',
        description: 'Analyze and present solutions to 15+ business case studies.',
        duration: '2-3 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'MBA Capstone Project',
        description: 'Real-world business problem solving with company mentorship.',
        duration: '3-4 months',
        difficulty: 'Advanced'
      }
    ],
    commonMistakes: [
      'Taking just one entrance exam instead of multiple',
      'Weak communication and soft skills',
      'Not building work experience before MBA (if possible)',
      'Ignoring group discussion preparation',
      'Choosing MBA without clear career goal'
    ],
    timeline: {
      month1_2: 'Join MBA entrance coaching. Identify exam to appear.',
      month3_6: 'Complete syllabus. Weekly mock tests. Analyze mistakes.',
      month7_12: 'Intensive revision. Multiple exam attempts. Apply to colleges.'
    }
  },

  'BSc-to-MTech': {
    from: 'B.Sc (Science)',
    to: 'M.Tech (Master of Technology)',
    duration: '8-10 months preparation',
    keySkills: [
      'Engineering Basics',
      'Research Skills',
      'Technical Problem Solving',
      'Mathematics & Physics',
      'Computer Skills'
    ],
    tasks: [
      {
        title: 'Bridge Engineering Knowledge',
        duration: '2-3 months',
        description: 'Learn engineering fundamentals since B.Sc is non-engineering background.'
      },
      {
        title: 'GATE Preparation',
        duration: '6-8 months',
        description: 'Prepare for GATE (choose appropriate stream: Physics, Chemistry, or General).'
      },
      {
        title: 'GATE Exam',
        duration: '1 month',
        description: 'Appear for GATE exam. Score might be lower than B.Tech students but still eligible.'
      },
      {
        title: 'Counselling & Admission',
        duration: '1-2 months',
        description: 'Participate in COMET counselling. May get M.Tech in related stream.'
      },
      {
        title: 'M.Tech Year 1: Intensive Learning',
        duration: '12 months',
        description: 'Catch up on engineering fundamentals. Take foundational M.Tech courses.'
      }
    ],
    resources: [
      {
        title: 'GATE Preparation (Cross-stream)',
        type: 'Online Courses',
        url: 'https://gate.iitd.ac.in'
      },
      {
        title: 'Engineering Mathematics Books',
        type: 'Textbooks'
      },
      {
        title: 'NPTEL Engineering Courses',
        type: 'Free Learning',
        url: 'https://nptel.ac.in'
      },
      {
        title: 'Khan Academy (Engineering Basics)',
        type: 'Free Videos',
        url: 'https://www.khanacademy.org'
      }
    ],
    projects: [
      {
        title: 'Engineering Fundamentals Project',
        description: 'Create 3-4 projects demonstrating engineering concepts (circuit, model, design).',
        duration: '3 months',
        difficulty: 'Beginner'
      },
      {
        title: 'GATE Preparation Portfolio',
        description: 'Solve 300+ GATE problems. Maintain solutions notebook.',
        duration: '4-5 months',
        difficulty: 'Intermediate'
      },
      {
        title: 'Cross-stream Research Survey',
        description: 'Review 20+ research papers bridging science and engineering.',
        duration: '2-3 months',
        difficulty: 'Intermediate'
      }
    ],
    commonMistakes: [
      'Not focusing on engineering fundamentals early',
      'Underestimating GATE difficulty for non-engineering background',
      'Not networking with mentors in engineering field',
      'Weak mathematics preparation',
      'Expecting same college rankings as B.Tech students'
    ],
    timeline: {
      month1_2: 'Learn engineering basics. Understand GATE requirements.',
      month3_6: 'Systematic GATE preparation. Fill knowledge gaps.',
      month7_12: 'Advanced GATE topics. Mock tests and revision.'
    }
  },

  'graduation-to-Job': {
    from: 'Graduation (B.Tech/B.Sc/B.A/B.Com)',
    to: 'First Job/Career Position',
    duration: '3-12 months',
    keySkills: [
      'Technical Skills',
      'Soft Skills',
      'Resume Writing',
      'Interview Skills',
      'Networking',
      'Portfolio Building'
    ],
    tasks: [
      {
        title: 'Skills Assessment',
        duration: '1 month',
        description: 'Identify job market demands vs. your skills. Determine skill gaps.'
      },
      {
        title: 'Resume & LinkedIn Optimization',
        duration: '1-2 weeks',
        description: 'Create ATS-friendly resume. Build professional LinkedIn profile with projects.'
      },
      {
        title: 'Project Portfolio Development',
        duration: '2-3 months',
        description: 'Build 2-3 projects relevant to target role. Upload to GitHub. Document well.'
      },
      {
        title: 'Interview Preparation',
        duration: '2-3 months',
        description: 'Technical interview prep, behavioral questions, coding challenges.'
      },
      {
        title: 'Job Applications & Networking',
        duration: '3-6 months',
        description: 'Apply to 20-50 companies. Attend tech meetups. Network with professionals.'
      },
      {
        title: 'Final Interviews & Offer Negotiation',
        duration: '1-2 months',
        description: 'Technical and HR interviews. Offer evaluation and negotiation.'
      }
    ],
    resources: [
      {
        title: 'LeetCode / GeeksforGeeks',
        type: 'Coding Practice',
        url: 'https://leetcode.com'
      },
      {
        title: 'GitHub for Portfolio',
        type: 'Project Showcase',
        url: 'https://github.com'
      },
      {
        title: 'LinkedIn Job Portal',
        type: 'Job Search',
        url: 'https://www.linkedin.com/jobs'
      },
      {
        title: 'Interview Prep (InterviewBit)',
        type: 'Interview Training',
        url: 'https://www.interviewbit.com'
      }
    ],
    projects: [
      {
        title: 'Personal Project #1',
        description: 'Build relevant project showcasing core skills for target role.',
        duration: '4-6 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Personal Project #2',
        description: 'Build second project showing different aspects of your expertise.',
        duration: '4-6 weeks',
        difficulty: 'Intermediate'
      },
      {
        title: 'Freelance / Open-Source Contribution',
        description: 'Contribute to real open-source project or take freelance work.',
        duration: 'Ongoing',
        difficulty: 'Advanced'
      }
    ],
    commonMistakes: [
      'Weak resume and LinkedIn profile',
      'No portfolio projects to showcase',
      'Poor technical interview preparation',
      'Narrow job search (not enough applications)',
      'Not networking or attending industry events',
      'Overpricing yourself or underselling skills'
    ],
    timeline: {
      month1_2: 'Resume & LinkedIn optimization. Start portfolio projects.',
      month3_6: 'Complete 2-3 projects. Start applications and networking.',
      month7_12: 'Continuous applications and interviews. Final offer negotiation.'
    }
  }
}

// ===== HELPER FUNCTIONS =====
export function getEducationTransition(from: string, to: string): EducationTransition | null {
  const fromLower = from.toLowerCase()
  const toLower = to.toLowerCase()
  
  // Direct matching in EDUCATION_TRANSITIONS
  for (const [key, transition] of Object.entries(EDUCATION_TRANSITIONS)) {
    const keyLower = key.toLowerCase()
    const fromMatch = fromLower.includes('10th') ? keyLower.includes('10th') :
                      fromLower.includes('12th') || fromLower.includes('puc') ? keyLower.includes('12th') :
                      fromLower.includes('diploma') ? keyLower.includes('diploma') :
                      fromLower.includes('b.tech') || fromLower.includes('btech') ? keyLower.includes('b.tech') || keyLower.includes('btech') :
                      fromLower.includes('b.sc') || fromLower.includes('bsc') ? keyLower.includes('b.sc') || keyLower.includes('bsc') :
                      fromLower.includes('b.a') ? keyLower.includes('b.a') :
                      fromLower.includes('b.com') || fromLower.includes('bcom') ? keyLower.includes('b.com') || keyLower.includes('bcom') :
                      false
    
    const toMatch = toLower.includes('12th') || toLower.includes('puc') ? keyLower.includes('12th') :
                    toLower.includes('b.tech') || toLower.includes('btech') ? keyLower.includes('b.tech') || keyLower.includes('btech') :
                    toLower.includes('b.sc') || toLower.includes('bsc') ? keyLower.includes('b.sc') || keyLower.includes('bsc') :
                    toLower.includes('b.a') ? keyLower.includes('b.a') :
                    toLower.includes('b.com') || toLower.includes('bcom') ? keyLower.includes('b.com') || keyLower.includes('bcom') :
                    toLower.includes('m.tech') || toLower.includes('mtech') ? keyLower.includes('m.tech') || keyLower.includes('mtech') :
                    toLower.includes('mba') ? keyLower.includes('mba') :
                    toLower.includes('m.sc') || toLower.includes('msc') ? keyLower.includes('m.sc') || keyLower.includes('msc') :
                    toLower.includes('m.a') ? keyLower.includes('m.a') :
                    toLower.includes('phd') || toLower.includes('ph.d') ? keyLower.includes('phd') || keyLower.includes('ph.d') :
                    toLower.includes('job') || toLower.includes('career') ? keyLower.includes('job') || keyLower.includes('career') :
                    false
    
    if (fromMatch && toMatch) {
      return transition
    }
  }
  
  return null
}

export function getNextEducationSteps(currentEducation: string): string[] {
  const education = EDUCATION_LEVELS[currentEducation]
  return education?.nextLevels || []
}

export function generateEducationRoadmap(currentEducation: string, nextEducation: string, profile?: any) {
  const transition = getEducationTransition(currentEducation, nextEducation)
  
  if (!transition) {
    return null
  }

  return {
    title: `Your Path from ${currentEducation} to ${nextEducation}`,
    description: `A comprehensive, step-by-step journey from your current education level (${currentEducation}) to ${nextEducation}. Based on your profile interests and skills.`,
    transition: transition,
    estimatedDuration: transition.duration,
    keyMilestones: transition.tasks.map((t, i) => `${i + 1}. ${t.title}`),
    profileAligned: profile ? {
      interests: profile.interests || [],
      currentSkills: profile.skills || [],
      skillGaps: profile.gap?.missingSkills || []
    } : null
  }
}
