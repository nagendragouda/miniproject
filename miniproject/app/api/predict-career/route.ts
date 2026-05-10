import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { uid, email, profile, answers, questions } = data

    // Analyze the quiz answers with profile data
    const techComfort = Number(answers['4']) || 5
    const problemSolving = Number(answers['2']) || 5
    const motivation = answers['5'] || ''
    const interests = Array.isArray(answers['3']) ? answers['3'] : []
    const industries = Array.isArray(answers['7']) ? answers['7'] : []
    const learningAgility = Number(answers['9']) || 5
    const growthPath = answers['8'] || ''
    const salaryExpectation = answers['10'] || ''
    const workLifeBalance = Number(answers['6']) || 5

    const predictions: any[] = []

    // AI/ML Engineer - COMPREHENSIVE
    if (techComfort >= 7 && problemSolving >= 7) {
      predictions.push({
        title: 'AI/ML Engineer',
        matchScore: Math.min(95, Math.round(65 + (techComfort * 3) + (problemSolving * 2) + (learningAgility * 0.5))),
        salaryRange: '₹15-50 LPA',
        growthRate: '45% YoY',
        demand: 'Very High',
        reasoning: 'Your strong technical aptitude and problem-solving skills make you ideal for AI/ML roles',
        skills: ['Python', 'TensorFlow', 'Deep Learning', 'Data Analysis', 'SQL', 'Statistics', 'PyTorch', 'Scikit-learn'],
        timeToLearn: '6-12 months',
        description: 'Build intelligent systems and machine learning models that solve complex problems',
        completeOverview: 'AI/ML Engineering is one of the fastest-growing tech careers globally. As an AI/ML Engineer, you will develop, train, and deploy machine learning models that power recommendation systems, autonomous vehicles, natural language processing applications, and more. This role combines software engineering, mathematics, and domain expertise to solve real-world problems at scale. You\'ll work with cutting-edge technologies and be at the forefront of innovation.',
        skillsGap: [
          { skill: 'Python Programming', currentLevel: 'Beginner', requiredLevel: 'Advanced', gap: 'Must learn - most critical skill' },
          { skill: 'Statistics & Probability', currentLevel: 'Basic', requiredLevel: 'Advanced', gap: 'Essential foundation - 200+ hours' },
          { skill: 'Linear Algebra', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Math fundamentals required' },
          { skill: 'TensorFlow/PyTorch', currentLevel: 'None', requiredLevel: 'Advanced', gap: 'Framework expertise - 150+ hours' },
          { skill: 'Deep Learning', currentLevel: 'None', requiredLevel: 'Advanced', gap: 'Core ML skill - 200+ hours' },
          { skill: 'Data Preprocessing', currentLevel: 'None', requiredLevel: 'Advanced', gap: 'Critical practical skill - 100+ hours' },
          { skill: 'SQL Databases', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Data extraction - 50+ hours' },
          { skill: 'MLOps & Deployment', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Production skills - 100+ hours' }
        ],
        riskAssessment: {
          riskFactors: [
            'AI tools (ChatGPT, Claude) can automate junior-level work but strategic roles remain safe',
            'Continuous learning required - field evolves rapidly every 6 months',
            'Competition increasing as more engineers enter the field',
            'Some roles may be outsourced to lower-cost countries',
            'Emerging regulatory challenges around AI ethics and compliance'
          ],
          mitigationStrategies: [
            'Build deep specialization in specific domains (NLP, Computer Vision, Reinforcement Learning)',
            'Stay updated with latest research papers and preprints (follow arXiv)',
            'Contribute to open-source projects (GitHub visibility)',
            'Build personal brand through blog posts and speaking engagements',
            'Focus on applying ML to business problems (strategic thinking)',
            'Develop understanding of AI ethics and responsible AI',
            'Learn adjacent skills: MLOps, software engineering best practices, system design'
          ]
        },
        smartTips: [
          '🎓 Start with Andrew Ng\'s ML course and Fast.ai (free and highly respected)',
          '📊 Learn Python first - it\'s the lingua franca of ML (3 months minimum)',
          '📈 Build 5-10 projects on real datasets before applying for jobs',
          '🏆 Practice Kaggle competitions - recruiters notice competition rankings',
          '📚 Study statistics deeply - understand WHY algorithms work, not just HOW to code',
          '🔄 Learn in order: Python → Statistics → ML Basics → Neural Networks → Specialization',
          '🌐 Contribute to TensorFlow, PyTorch, or scikit-learn on GitHub',
          '💼 Focus on understanding business problems, not just algorithms',
          '⚙️ Learn MLOps and deployment early - critical differentiator for job readiness',
          '🤝 Network with ML engineers - attend conferences, online communities, local meetups'
        ],
        aiInsights: 'Your exceptional technical aptitude (score: ' + techComfort + '/10) combined with strong problem-solving (score: ' + problemSolving + '/10) and learning agility make AI/ML an ideal fit. Based on similar profiles, you can achieve job readiness in 6-12 months of consistent effort. The key is balancing theoretical understanding with practical projects. Your strong fundamentals will help you quickly grasp complex ML concepts.',
        marketAnalysis: {
          currentMarket: 'Explosive growth driven by ChatGPT, Generative AI, and enterprise AI adoption. Every company now wants AI capabilities.',
          jobOpenings: '250K+ openings annually in India, 1M+ globally (McKinsey reports highest hiring in tech)',
          competitionLevel: 'Medium-High (Very high demand but increasingly competitive due to bootcamp graduates)',
          marketTrend: '📈 Fastest growing tech sector globally with 45% YoY growth rate'
        },
        industryOverview: {
          industry: 'Artificial Intelligence & Machine Learning',
          majorPlayers: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'OpenAI', 'DeepMind', 'NVIDIA', 'Anthropic'],
          marketSize: '$500B+ globally (growing at 38% CAGR through 2030, projected to reach $1.8T)',
          innovations: ['Large Language Models (ChatGPT, GPT-4, Claude)', 'Diffusion Models (DALL-E, Stable Diffusion)', 'Autonomous Vehicles', 'Robotics & Manipulation', 'Real-time Voice AI']
        },
        careerMilestones: [
          { year: 1, milestone: 'Junior ML Engineer - Master frameworks, build first production models', salary: '₹8-15 LPA' },
          { year: 2, milestone: 'ML Engineer - Lead model development, optimize for production', salary: '₹15-25 LPA' },
          { year: 4, milestone: 'Senior ML Engineer - Design ML systems, mentor juniors, strategy', salary: '₹25-40 LPA' },
          { year: 6, milestone: 'ML Architect / Tech Lead - Define ML strategy, system design', salary: '₹40-60 LPA' },
          { year: 8, milestone: 'Principal ML Engineer - Industry-leading expertise, research', salary: '₹60-100 LPA' }
        ],
        opportunities: [
          '🚀 Launch AI startups and raise funding (highest upside potential)',
          '💡 Work on cutting-edge research at Google Brain, DeepMind, OpenAI, Anthropic',
          '🤖 Build autonomous systems (self-driving cars, robotics)',
          '💬 Develop LLM applications (chatbots, code generation tools)',
          '💼 High-paying freelance AI consulting (₹5000-20000+ per day)',
          '🌍 Work globally on projects with billions of users',
          '📱 Build AI-powered mobile and web applications',
          '🏢 Leadership roles as ML Engineering Manager, Director, or VP',
          '📊 Develop proprietary AI models for business advantage'
        ],
        requiredQualifications: [
          'B.Tech/M.Tech in CS, IT, Mathematics, Physics, or Electrical Engineering',
          'Strong programming skills (Python fluency essential)',
          'Solid foundation in Statistics, Linear Algebra, Calculus',
          'Portfolio with 5+ ML projects on GitHub (diverse domains)',
          'Understanding of neural networks and deep learning fundamentals',
          'Experience with TensorFlow or PyTorch frameworks'
        ],
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Tesla', 'NVIDIA', 'OpenAI', 'TCS AI Labs', 'Infosys']
      })
    }

    // Full-Stack Developer - COMPREHENSIVE
    if (techComfort >= 6 && interests.includes('Building software/products')) {
      predictions.push({
        title: 'Full-Stack Developer',
        matchScore: Math.min(92, Math.round(60 + (techComfort * 3) + problemSolving + (workLifeBalance * 0.3))),
        salaryRange: '₹12-40 LPA',
        growthRate: '30% YoY',
        demand: 'High',
        reasoning: 'Your technical interest and ability to solve problems align well with full-stack development',
        skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'DevOps', 'Docker', 'Git'],
        timeToLearn: '4-8 months',
        description: 'Create complete web applications from frontend to backend',
        completeOverview: 'Full-Stack Developers are the versatile builders of modern web applications. They work across the entire technology stack - from user interfaces to databases and deployment - and are highly valued for their ability to understand the complete product architecture. This path offers flexibility, high demand, excellent work-life balance options, and strong opportunities for entrepreneurship through SaaS products.',
        skillsGap: [
          { skill: 'Frontend (React/Vue/Angular)', currentLevel: 'Beginner', requiredLevel: 'Advanced', gap: 'Primary skill - 150+ hours' },
          { skill: 'Backend (Node.js/Python/Java)', currentLevel: 'Beginner', requiredLevel: 'Advanced', gap: 'Server-side expertise - 150+ hours' },
          { skill: 'SQL & NoSQL Databases', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Data persistence skills - 100+ hours' },
          { skill: 'REST APIs & GraphQL', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Integration essential - 80+ hours' },
          { skill: 'DevOps Basics', currentLevel: 'None', requiredLevel: 'Beginner', gap: 'Deployment knowledge - 60+ hours' },
          { skill: 'Git & Version Control', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Collaboration tool - 40+ hours' },
          { skill: 'Testing Frameworks', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Code quality assurance - 60+ hours' },
          { skill: 'System Design Basics', currentLevel: 'None', requiredLevel: 'Beginner', gap: 'Architecture thinking - 100+ hours' }
        ],
        riskAssessment: {
          riskFactors: [
            'AI coding assistants (GitHub Copilot, Cursor) are automating routine coding tasks',
            'No-code/Low-code platforms reducing demand for custom development',
            'Routine development roles more prone to automation than architectural roles',
            'Offshore outsourcing competition from India, Philippines, Eastern Europe',
            'Rapid technology evolution requiring continuous learning'
          ],
          mitigationStrategies: [
            'Specialize in emerging technologies (AI integration, Web3, Blockchain)',
            'Move towards system design and architecture roles',
            'Develop expertise in high-demand stacks (AI/ML integration)',
            'Build SaaS products for passive income and entrepreneurship',
            'Transition to Technical Leadership, CTO, or VP Engineering roles',
            'Focus on problem-solving and business impact, not just coding',
            'Develop domain expertise in specific industries (fintech, healthtech)',
            'Build products and portfolio that showcase strategic thinking'
          ]
        },
        smartTips: [
          '🎯 Start with one complete stack (MERN: MongoDB, Express, React, Node.js recommended)',
          '🏗️ Build 3-5 complete projects from scratch (NOT just tutorials)',
          '📊 Learn system design early - critical for advancement to senior roles',
          '⚙️ Master both frontend AND backend deeply before specializing',
          '🌐 Contribute to open-source projects to build credibility and learn',
          '✨ Focus on clean code, testing, and best practices from day 1',
          '💼 Consider freelancing on Upwork/Toptal to build real-world experience',
          '🚀 Build at least one SaaS product to understand end-to-end product development',
          '📚 Stay updated with new frameworks but master fundamentals deeply',
          '🤝 Learn to communicate with non-technical stakeholders'
        ],
        aiInsights: 'Your combination of technical interest and moderate-to-good technical comfort (score: ' + techComfort + '/10) makes Full-Stack an excellent starting point. You can become job-ready in 4-8 months and quickly transition to specialized roles (ML integration, DevOps, Architecture) or entrepreneurship within 2-3 years. Your problem-solving ability will help you debug complex issues across the stack.',
        marketAnalysis: {
          currentMarket: 'Stable demand with continuous evolution of tech stacks and frameworks',
          jobOpenings: '180K+ openings annually in India, 500K+ globally (most open tech jobs)',
          competitionLevel: 'High - Most common path but entry is easier than specialized roles',
          marketTrend: '📈 Stable with emerging opportunities in AI integration, Web3, and low-code platforms'
        },
        industryOverview: {
          industry: 'Web & Software Development',
          majorPlayers: ['Microsoft', 'Google', 'Amazon', 'Meta', 'Netflix', 'Airbnb', 'Stripe', 'Figma', 'Stripe'],
          marketSize: '$400B+ software development market globally',
          innovations: ['Serverless & Edge Computing', 'Low-Code/No-Code Platforms', 'AI-Assisted Development', 'Web3/Blockchain', 'JAMstack', 'Micro-frontend Architecture']
        },
        careerMilestones: [
          { year: 1, milestone: 'Junior Full-Stack Dev - Learn frameworks and build basic features', salary: '₹6-12 LPA' },
          { year: 2, milestone: 'Full-Stack Dev - Own complete features and applications', salary: '₹12-20 LPA' },
          { year: 4, milestone: 'Senior Full-Stack Dev - Architect solutions and mentor juniors', salary: '₹20-32 LPA' },
          { year: 6, milestone: 'Tech Lead / Engineering Manager - Lead teams and define strategy', salary: '₹32-50 LPA' },
          { year: 8, milestone: 'Principal Engineer / CTO - Define technology strategy for org', salary: '₹50-80 LPA' }
        ],
        opportunities: [
          '🚀 Launch your own SaaS product (high passive income potential)',
          '🌐 Build applications used by millions users globally',
          '💼 Freelance projects with high rates (₹2000-10000+ per day)',
          '🏆 Work at top tech companies and startups worldwide',
          '📱 Cross-platform development (web + mobile + desktop)',
          '🔗 Explore Web3 and blockchain application development',
          '👔 Transition to CTO, VP of Engineering, or engineering leadership',
          '💡 Build open-source projects with large communities',
          '🌍 Remote work opportunities globally'
        ],
        requiredQualifications: [
          'B.Tech/Diploma in CS/IT (or equivalent self-taught experience)',
          'Portfolio with 3-5 complete, deployed projects',
          'Strong problem-solving and debugging skills',
          'Willingness to continuously learn new technologies',
          'Understanding of basic system design principles',
          'Good communication and collaboration skills'
        ],
        topCompanies: ['Microsoft', 'Google', 'Amazon', 'Meta', 'Apple', 'Netflix', 'Uber', 'Airbnb', 'Zomato', 'Flipkart']
      })
    }

    // Data Scientist - COMPREHENSIVE
    if (interests.includes('Analyzing data') && problemSolving >= 7) {
      predictions.push({
        title: 'Data Scientist',
        matchScore: Math.min(90, Math.round(60 + (problemSolving * 3) + (techComfort * 2) + (learningAgility * 0.5))),
        salaryRange: '₹14-45 LPA',
        growthRate: '40% YoY',
        demand: 'Very High',
        reasoning: 'Your strong analytical skills and data interest position you perfectly for data science',
        skills: ['Python', 'SQL', 'Statistics', 'Machine Learning', 'Visualization', 'Pandas', 'Scikit-learn', 'Communication'],
        timeToLearn: '5-10 months',
        description: 'Extract insights from data and drive business decisions',
        completeOverview: 'Data Scientists bridge mathematics, programming, and business acumen to extract actionable insights from data. They use statistical analysis and machine learning to help organizations make data-driven decisions. This role is crucial across all industries as companies compete on their ability to leverage data. Data Scientists spend 70% on data preparation and exploration, 20% on modeling, and 10% on communication.',
        skillsGap: [
          { skill: 'Python Programming', currentLevel: 'Beginner', requiredLevel: 'Advanced', gap: 'Primary tool - 200+ hours' },
          { skill: 'SQL Querying', currentLevel: 'Basic', requiredLevel: 'Advanced', gap: 'Data extraction - 100+ hours' },
          { skill: 'Statistics & Probability', currentLevel: 'Basic', requiredLevel: 'Advanced', gap: 'Foundation - 250+ hours' },
          { skill: 'Machine Learning Algorithms', currentLevel: 'None', requiredLevel: 'Advanced', gap: 'Core expertise - 200+ hours' },
          { skill: 'Data Visualization', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Communication - 80+ hours' },
          { skill: 'Statistical Testing', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Hypothesis validation - 60+ hours' },
          { skill: 'Deep Learning Basics', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Advanced ML - 150+ hours' },
          { skill: 'Business Analytics', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Context understanding - 100+ hours' }
        ],
        riskAssessment: {
          riskFactors: [
            'AI/AutoML tools can automate routine analysis and model building',
            'Data analyst roles being consolidated with Data Science',
            'Growing preference for MLOps and Data Engineering over pure Data Science',
            'Requires continuous statistical and algorithmic learning',
            'Can become siloed if communication skills not developed',
            'Salary growth plateaus without transition to leadership or specialization'
          ],
          mitigationStrategies: [
            'Focus on storytelling and business impact, not just statistical accuracy',
            'Develop deep domain expertise in specific industries (healthcare, finance, retail)',
            'Learn MLOps and model deployment - critical for modern DS roles',
            'Specialize in emerging areas (causal inference, reinforcement learning, LLMs)',
            'Transition to Data Science Management or Chief Data Officer roles',
            'Build end-to-end data solutions, not just analyses',
            'Develop strong communication and presentation skills',
            'Learn A/B testing and experimentation design deeply',
            'Contribute to research and publish findings'
          ]
        },
        smartTips: [
          '📖 Master Python & SQL BEFORE diving into advanced ML (essential foundation)',
          '📚 Take Andrew Ng\'s ML course, Fast.ai course, and StatQuest with Josh Starmer',
          '🏆 Practice with real datasets on Kaggle (build portfolio)',
          '📊 Learn to tell stories with data - communication is 50% of the job',
          '🎯 Understand business metrics and ROI before starting analysis',
          '🔍 Learn to ask right questions BEFORE jumping to analysis',
          '📈 Build portfolio with 5-7 complete end-to-end projects',
          '📱 Learn data visualization deeply (Matplotlib, Seaborn, Plotly)',
          '🧮 Study statistics thoroughly - this is critical, not just fancy ML',
          '🤝 Learn to work with engineers and product teams - cross-functional skills'
        ],
        aiInsights: 'Your exceptional problem-solving ability (score: ' + problemSolving + '/10) combined with analytical interest makes you an ideal Data Scientist candidate. Unlike engineers, your skill set will likely only become more valuable as data becomes more critical. You can master core skills in 5-10 months and quickly advance to specialized and leadership roles. Your analytical mindset is a huge advantage.',
        marketAnalysis: {
          currentMarket: 'Explosive growth driven by data-driven business decisions and AI/ML adoption',
          jobOpenings: '200K+ openings annually in India, 600K+ globally (McKinsey says highest growth)',
          competitionLevel: 'Medium to High - Very high demand but growing talent pool from bootcamps',
          marketTrend: '📈 Accelerating growth in all sectors and geographies'
        },
        industryOverview: {
          industry: 'Data Science & Advanced Analytics',
          majorPlayers: ['Google', 'Amazon', 'Meta', 'Netflix', 'Uber', 'Microsoft', 'LinkedIn', 'Airbnb'],
          marketSize: '$600B+ big data analytics market globally',
          innovations: ['Real-time ML Pipelines', 'Federated Learning', 'AutoML Systems', 'Causal Inference', 'Explainable AI (XAI)', 'LLM Applications']
        },
        careerMilestones: [
          { year: 1, milestone: 'Junior Data Scientist - Learn tools and build first models', salary: '₹8-14 LPA' },
          { year: 2, milestone: 'Data Scientist - Own projects and deliver insights', salary: '₹14-24 LPA' },
          { year: 4, milestone: 'Senior Data Scientist - Lead projects and strategy', salary: '₹24-38 LPA' },
          { year: 6, milestone: 'Lead Data Scientist / Analytics Manager', salary: '₹38-55 LPA' },
          { year: 8, milestone: 'Principal Data Scientist / VP Analytics', salary: '₹55-90 LPA' }
        ],
        opportunities: [
          '💡 Solve critical business problems with data insights',
          '📊 Drive strategic decisions at executive level',
          '🏆 Compete in Kaggle competitions (prizes and recognition)',
          '🌍 Work on global scale solving real-world problems',
          '💼 High-paying consulting and freelance work',
          '🚀 Build AI products and startups',
          '📈 Become Chief Data Officer / Chief Analytics Officer',
          '🎓 Research positions at universities or labs',
          '🌐 Publish research papers in prestigious journals'
        ],
        requiredQualifications: [
          'B.Tech/M.Tech/MSc in CS, Mathematics, Statistics, Physics, or Engineering',
          'Strong programming skills (Python fluency essential)',
          'Solid statistics and probability foundation',
          'SQL and database knowledge',
          'Portfolio with 5-7 data science projects on GitHub',
          'Understanding of machine learning fundamentals'
        ],
        topCompanies: ['Amazon', 'Google', 'Microsoft', 'Meta', 'LinkedIn', 'Flipkart', 'Paytm', 'Swiggy', 'Zomato', 'PhonePe']
      })
    }

    // Product Manager - COMPREHENSIVE
    if (interests.includes('Building software/products') && motivation === 'Leadership opportunities') {
      predictions.push({
        title: 'Product Manager',
        matchScore: Math.min(88, Math.round(60 + (problemSolving * 2) + techComfort + (workLifeBalance * 0.2))),
        salaryRange: '₹14-40 LPA',
        growthRate: '35% YoY',
        demand: 'High',
        reasoning: 'Your interest in building products and leadership aspirations suit product management perfectly',
        skills: ['Product Strategy', 'User Research', 'Data Analysis', 'Communication', 'Prioritization', 'Roadmapping', 'Leadership', 'Metrics'],
        timeToLearn: '3-6 months',
        description: 'Lead product vision and strategy while working cross-functionally',
        completeOverview: 'Product Managers are the \"CEOs of their product,\" responsible for defining vision, strategy, and roadmap. They work across engineering, design, marketing, and sales to build products customers love. This is a high-impact role that combines business acumen, technology understanding, and user empathy. PMs influence company direction more than almost any other role.',
        skillsGap: [
          { skill: 'Product Strategy & Thinking', currentLevel: 'None', requiredLevel: 'Advanced', gap: 'Core PM skill - 120+ hours' },
          { skill: 'User Research & Interviews', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Understanding users - 80+ hours' },
          { skill: 'Data Analysis & Metrics', currentLevel: 'Basic', requiredLevel: 'Advanced', gap: 'Data-driven decisions - 100+ hours' },
          { skill: 'Roadmapping & Prioritization', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Planning skills - 60+ hours' },
          { skill: 'Competitive Analysis', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Market understanding - 50+ hours' },
          { skill: 'Go-to-Market Strategy', currentLevel: 'None', requiredLevel: 'Beginner', gap: 'Launch expertise - 60+ hours' },
          { skill: 'Communication & Storytelling', currentLevel: 'Intermediate', requiredLevel: 'Advanced', gap: 'Influence skill - 80+ hours' },
          { skill: 'Technical Basics', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Understand constraints - 40+ hours' }
        ],
        riskAssessment: {
          riskFactors: [
            'PM role highly dependent on company size and industry',
            'High stress role responsible for product success/failure',
            'Skills can become obsolete if not staying current with market trends',
            'Lower demand than engineering roles - fewer positions available',
            'Harder to transition back to engineering if PM role doesn\'t work out',
            'Success heavily dependent on company health and market conditions'
          ],
          mitigationStrategies: [
            'Build a strong portfolio of product decisions and outcomes',
            'Develop deep understanding of user needs and pain points',
            'Learn data analysis and metrics deeply - huge differentiator',
            'Network extensively in tech industry (invaluable for transitions)',
            'Specialize in high-demand domains (AI PM, ML PM, Infrastructure PM)',
            'Transition to specialized PM roles or strategy positions',
            'Become Head of Product or Chief Product Officer',
            'Develop parallel technical skills to stay relevant',
            'Build entrepreneurial mindset for startup opportunities'
          ]
        },
        smartTips: [
          '👨‍💼 Start as Associate PM (APM) at top tech companies for structured learning',
          '📋 Build a product portfolio: case studies of decisions you\'d make',
          '🎯 Practice user interviews and empathy mapping exercises',
          '📊 Learn SQL & data analysis (huge differentiator for PM roles)',
          '🤝 Contribute to open-source projects to understand user needs',
          '📖 Read: \"Inspired\", \"Empowered\", \"Cracking the PM Interview\" by Gayle',
          '🌐 Network with PMs extensively - understand their journey and challenges',
          '🎨 Understand design and user experience deeply',
          '💰 Learn business metrics and understand business model',
          '🔍 Focus on impact and outcomes, not just shipping features'
        ],
        aiInsights: 'Your combination of leadership aspirations and problem-solving ability makes you an excellent PM candidate. Unlike engineers who need 2-3 years, you can transition to PM within 3-6 months through structured learning and mentorship. Your understanding of user needs and ability to influence people are critical PM traits. The PM career path offers highest upside potential for equity and executive roles.',
        marketAnalysis: {
          currentMarket: 'Growing demand for skilled product leaders as companies realize PM is critical',
          jobOpenings: '120K+ PM roles in India, 300K+ globally',
          competitionLevel: 'High - Many people want PM roles but few understand what the role actually entails',
          marketTrend: '📈 Every company needs great PMs'
        },
        industryOverview: {
          industry: 'Product Management & Product Development',
          majorPlayers: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Uber', 'Airbnb', 'Stripe'],
          marketSize: '$300B+ product management influence globally',
          innovations: ['AI-Powered Personalization', 'Community-driven Products', 'Web3/Blockchain Products', 'Voice Interfaces', 'No-Code Platforms']
        },
        careerMilestones: [
          { year: 1, milestone: 'Associate PM - Learn product fundamentals and company context', salary: '₹10-16 LPA' },
          { year: 2, milestone: 'Product Manager - Own product area and feature decisions', salary: '₹16-28 LPA' },
          { year: 4, milestone: 'Senior PM - Lead product strategy and vision', salary: '₹28-40 LPA' },
          { year: 6, milestone: 'Group PM / Director of Product', salary: '₹40-60 LPA' },
          { year: 8, milestone: 'VP Product / Chief Product Officer', salary: '₹60-120 LPA' }
        ],
        opportunities: [
          '🎯 Shape product strategy and vision that affects millions',
          '💡 Lead cross-functional teams (engineers, designers, marketers)',
          '🚀 Launch breakthrough products with billions in impact',
          '👥 Build engaged user communities and loyal customers',
          '📈 Drive significant business growth and revenue',
          '🌐 Work on global products and platforms',
          '💰 High earning potential with significant stock options',
          '🏢 Transition to CEO or executive leadership roles'
        ],
        requiredQualifications: [
          'Any educational background acceptable (tech background helpful)',
          'Strong problem-solving and analytical skills',
          'Excellent communication and presentation abilities',
          'Deep passion for user experience and customer needs',
          'Business acumen and strategic thinking capability',
          'Experience making high-impact decisions'
        ],
        topCompanies: ['Google', 'Microsoft', 'Amazon', 'Meta', 'Apple', 'Uber', 'Airbnb', 'Swiggy', 'Zomato', 'Byju\'s']
      })
    }

    // Data Analyst - COMPREHENSIVE (fallback)
    if (predictions.length === 0 || (interests.includes('Analyzing data') && techComfort >= 5)) {
      predictions.push({
        title: 'Data Analyst',
        matchScore: Math.min(85, Math.round(55 + (problemSolving * 2) + (techComfort * 2) + (workLifeBalance * 0.2))),
        salaryRange: '₹8-25 LPA',
        growthRate: '28% YoY',
        demand: 'High',
        reasoning: 'Strong interest in data analysis makes this a solid career foundation',
        skills: ['SQL', 'Excel', 'Python', 'Tableau', 'Statistics', 'Power BI', 'Google Analytics', 'Data Visualization'],
        timeToLearn: '3-6 months',
        description: 'Turn data into actionable insights for business decisions',
        completeOverview: 'Data Analysts help organizations understand their data and make informed decisions. They query databases, create visualizations, and communicate insights to stakeholders. This role is the entry point to data careers and offers a stable, growing job market across all industries. Analysts spend 60% on data extraction and cleaning, 25% on analysis, and 15% on visualization and reporting.',
        skillsGap: [
          { skill: 'SQL Querying', currentLevel: 'Basic', requiredLevel: 'Advanced', gap: 'Core skill - 100+ hours' },
          { skill: 'Excel Advanced Functions', currentLevel: 'Intermediate', requiredLevel: 'Advanced', gap: 'Daily tool - 60+ hours' },
          { skill: 'Python Basics', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Automation - 80+ hours' },
          { skill: 'Tableau/Power BI', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Visualization - 60+ hours' },
          { skill: 'Statistics Basics', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Foundation - 80+ hours' },
          { skill: 'Business Analysis', currentLevel: 'None', requiredLevel: 'Beginner', gap: 'Context - 50+ hours' },
          { skill: 'Dashboard Creation', currentLevel: 'None', requiredLevel: 'Intermediate', gap: 'Communication - 60+ hours' },
          { skill: 'Report Writing', currentLevel: 'Basic', requiredLevel: 'Intermediate', gap: 'Storytelling - 40+ hours' }
        ],
        riskAssessment: {
          riskFactors: [
            'Routine reporting can be automated by AI tools and dashboards',
            'Competition from Data Scientists for advanced analysis projects',
            'Salary can plateau without moving to leadership or specialization',
            'Requires continuous skill updates (new tools, platforms)',
            'Emerging preference for self-service analytics reducing analyst roles',
            'Can become repetitive if not focusing on strategic analysis'
          ],
          mitigationStrategies: [
            'Transition to Data Science with ML skills (natural progression)',
            'Move into Analytics Management and leadership roles',
            'Specialize in specific domains (finance, marketing, operations, healthcare)',
            'Learn advanced visualization and storytelling skills',
            'Develop business intelligence and data warehouse expertise',
            'Learn Python and statistical analysis for advanced analytics',
            'Become Data Analytics Manager or Director of Analytics',
            'Focus on strategic insights, not routine reporting',
            'Learn about emerging tools (AI-powered analytics, self-service BI)'
          ]
        },
        smartTips: [
          '🎯 Master SQL first - it\'s 80% of the daily work as analyst',
          '📊 Learn Excel deeply (VLOOKUP, Pivot Tables, INDEX/MATCH are essential)',
          '🎓 Get certified in Tableau or Power BI (increases marketability)',
          '📈 Build a portfolio with 3-5 complete analysis projects',
          '📝 Learn to tell stories with data - this is VERY important',
          '💰 Understand business metrics and KPIs from day one',
          '🏆 Practice with real datasets on Kaggle',
          '🐍 Learn Python or R for advanced analysis (transition to Data Science)',
          '🔍 Ask the right questions BEFORE diving into analysis',
          '🤝 Develop communication skills - working with non-technical stakeholders'
        ],
        aiInsights: 'Your analytical interest (reflected in your quiz answers) makes this a great starting role. You can become job-ready in 3-6 months and can transition to Data Science or Analytics Management within 2-3 years. This is an excellent entry point to the data careers, with clear growth paths and high market demand.',
        marketAnalysis: {
          currentMarket: 'Strong demand across all sectors for data professionals',
          jobOpenings: '160K+ openings annually in India, 400K+ globally',
          competitionLevel: 'Medium - Growing field with increasing training programs',
          marketTrend: '📈 Steady growth as data becomes critical to business'
        },
        industryOverview: {
          industry: 'Business Analytics & Business Intelligence',
          majorPlayers: ['Amazon', 'Flipkart', 'Google', 'Microsoft', 'Facebook', 'Uber', 'McKinsey'],
          marketSize: '$350B+ analytics market globally',
          innovations: ['Self-service Analytics Platforms', 'AI-powered Analytics', 'Real-time Dashboards', 'Embedded Analytics', 'Automated Insights']
        },
        careerMilestones: [
          { year: 1, milestone: 'Junior Data Analyst - SQL and reporting basics', salary: '₹6-10 LPA' },
          { year: 2, milestone: 'Data Analyst - Build dashboards and deliver insights', salary: '₹10-16 LPA' },
          { year: 4, milestone: 'Senior Analyst - Create strategy and optimization', salary: '₹16-26 LPA' },
          { year: 6, milestone: 'Analytics Manager / Lead - Team leadership', salary: '₹26-38 LPA' },
          { year: 8, milestone: 'Director of Analytics', salary: '₹38-60 LPA' }
        ],
        opportunities: [
          '📊 Analyze business data to drive critical decisions',
          '💡 Identify trends and market opportunities',
          '🎯 Optimize marketing campaigns with data insights',
          '📈 Predict customer behavior and patterns',
          '💼 Business intelligence consulting (high rates)',
          '🏢 Work in finance, tech, retail, healthcare, and more',
          '👔 Transition to Analytics Management and leadership',
          '📚 Develop domain expertise in specific industries'
        ],
        requiredQualifications: [
          'B.Tech/BBA/Commerce background (or equivalent)',
          'SQL proficiency (essential for the role)',
          'Advanced Excel expertise',
          'Basic statistical knowledge',
          'Attention to detail and analytical mindset',
          'Clear communication ability'
        ],
        topCompanies: ['Amazon', 'Flipkart', 'Google', 'Microsoft', 'Meta', 'ICICI Bank', 'HDFC Bank', 'TCS', 'Accenture', 'Deloitte']
      })
    }

    // ── EDUCATION STAGE ADAPTATION ──
    const eduLevel = (profile?.education_level || '').toLowerCase()
    const is10th = eduLevel.includes('10') || eduLevel.includes('sslc') || eduLevel.includes('secondary')
    const is12th = eduLevel.includes('12') || eduLevel.includes('puc') || eduLevel.includes('intermediate') || eduLevel.includes('hsc')

    const adaptedPredictions = predictions.map(p => {
      let adaptedTitle = p.title
      let nextStep = ''

      if (is10th) {
        if (p.title.includes('AI') || p.title.includes('Engineer') || p.title.includes('Developer') || p.title.includes('Scientist')) {
          adaptedTitle = `Science Stream - PCM (Path to ${p.title})`
          nextStep = 'Class 11 & 12 (Science)'
        } else if (p.title.includes('Business') || p.title.includes('Manager') || p.title.includes('Analyst')) {
          adaptedTitle = `Commerce Stream (Path to ${p.title})`
          nextStep = 'Class 11 & 12 (Commerce)'
        } else {
          adaptedTitle = `Academic Stream (Path to ${p.title})`
          nextStep = 'Higher Secondary Education'
        }
      } else if (is12th) {
        if (p.title.includes('Engineer') || p.title.includes('Developer') || p.title.includes('AI')) {
          adaptedTitle = `B.Tech / BCA (Specialization in ${p.title})`
          nextStep = 'Undergraduate Degree'
        } else if (p.title.includes('Scientist') || p.title.includes('Analyst')) {
          adaptedTitle = `B.Sc / BCA (Path to ${p.title})`
          nextStep = 'Undergraduate Degree'
        } else if (p.title.includes('Manager') || p.title.includes('Business')) {
          adaptedTitle = `BBA / B.Com (Path to ${p.title})`
          nextStep = 'Undergraduate Degree'
        }
      }

      return {
        ...p,
        title: adaptedTitle,
        originalTitle: p.title,
        nextStepCategory: nextStep,
        educationStage: is10th ? 'after_10th' : is12th ? 'after_12th' : 'graduation'
      }
    })

    const sortedPredictions = adaptedPredictions
      .sort((a: any, b: any) => b.matchScore - a.matchScore)
      .slice(0, 4)

    return NextResponse.json({
      success: true,
      predictions: sortedPredictions,
      analysis: {
        techStrength: techComfort,
        problemSolvingAbility: problemSolving,
        learningCapacity: learningAgility,
        workPreferences: {
          balance: workLifeBalance,
          motivation: motivation,
          growthPath: growthPath
        }
      }
    })
  } catch (error) {
    console.error('Error predicting career:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate predictions' },
      { status: 500 }
    )
  }
}
