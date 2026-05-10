#!/usr/bin/env python
# -*- coding: utf-8 -*-

import re

# Read the current file
with open('offline-translations-complete.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the position of the hindi translations start and the corrupted section
hindi_start = content.find('export const hindiTranslations')
if hindi_start == -1:
    print("Could not find hindiTranslations")
else:
    # Find the next export statement after hindiTranslations
    next_export = content.find('export const', hindi_start + 1)
    
    # Get everything before hindi
    before_hindi = content[:hindi_start]
    
    # Get everything after the next export
    after_hindi = content[next_export:]
    
    # Create clean hindi translations
    clean_hindi = """export const hindiTranslations: TranslationData = {
  about: {
    pageTitle: 'हमारे बारे में',
    team: 'हमारी टीम',
    timeline: 'हमारी यात्रा',
    features: 'हम क्या प्रदान करते हैं',
    stats: {
      students: 'निर्देशित छात्र',
      successRate: 'सफलता दर',
      careerPaths: 'करियर पथ',
      rating: 'उपयोगकर्ता रेटिंग',
    }
  },

  entrance: {
    pageTitle: 'CareerGuide में आपका स्वागत है',
    heroTitle: 'अपना सही करियर पथ खोजें',
    heroSubtitle: 'AI-संचालित करियर पूर्वानुमान, व्यक्तिगत शिक्षण पथ और विशेषज्ञ मार्गदर्शन।',
    topCareerRecommendations: '🌟 शीर्ष करियर सिफारिशें',
    mostInDemandCareers: 'उच्च मांग वाले करियर उच्च विकास संभावना के साथ',
    discoverYourFuture: 'अपना भविष्य खोजें',
    unlockYourPotential: 'अपनी क्षमता अनलॉक करें',
    aiPoweredRecommendations: 'AI-संचालित सिफारिशें',
    personalizedLearningPaths: 'व्यक्तिगत शिक्षण पथ',
    expertGuidance: 'विशेषज्ञ मार्गदर्शन',
    tailoredForYou: 'आपके लिए तैयार',
    aiPowered: 'AI चालित',
    lightningFast: 'विजली तेज',
    personalized: 'व्यक्तिगत',
    topItCareer: 'शीर्ष IT करियर',
    topNonItCareer: 'शीर्ष गैर-IT करियर',
    salary: 'वेतन',
    growth: 'विकास',
    demand: 'मांग',
    futureScope: 'भविष्य दायरा',
    viewFullDetails: 'पूरा विवरण देखें',
    itCareers: 'IT करियर',
    nonItCareers: 'गैर-IT करियर',
    options: 'विकल्प',
  },

  careers: {
    pageTitle: 'करियर',
    subtitle: 'खुली स्थितियां',
    description: 'अपने अगले अवसर को खोजें',
    openPositions: 'खुली स्थितियां',
    filterBy: 'फ़िल्टर करें',
    department: 'विभाग',
    location: 'स्थान',
    positionsFound: 'स्थितियां मिलीं',
    jobType: 'नौकरी का प्रकार',
    fullTime: 'पूर्ण समय',
    partTime: 'अंशकालीन',
    contract: 'अनुबंध',
    requirements: 'आवश्यकताएं',
    benefits: 'लाभ',
    applyNow: 'अब आवेदन करें',
    viewJobDetails: 'नौकरी विवरण देखें',
    perAnnum: 'प्रति वर्ष',
    noPosotionsFound: 'कोई स्थिति नहीं मिली',
    perks: {
      title: 'हमसे जुड़ने के कारण',
    }
  },

  aiRoadmap: {
    pageTitle: 'AI करियर रोडमैप',
    pageSubtitle: 'AI विश्लेषण द्वारा संचालित अपने भविष्य के करियर की खोज करें',
    discoverYourFutureCareer: 'आपके भविष्य के करियर की खोज करें',
    advancedAIPoweredQuiz: 'उन्नत AI-संचालित क्विज़',
    findCareersMatchYourProfile: 'अपनी प्रोफ़ाइल से मेल खाने वाले करियर खोजें',
    getPersonalizedCareerInsights: 'व्यक्तिगत करियर अंतर्दृष्टि प्राप्त करें',
    careerProfileInsights: 'आपकी करियर प्रोफ़ाइल अंतर्दृष्टि',
    basedOnAlgorithmAnalysis: 'आपकी प्रोफ़ाइल विश्लेषण के आधार पर',
    careerMetrics: 'करियर मेट्रिक्स',
    salaryRange: 'वेतन श्रेणी',
    marketGrowth: 'बाजार विकास',
    demandLevel: 'मांग स्तर',
    itCareerPath: 'IT करियर पथ चुना',
    nonItCareerPath: 'गैर-IT करियर पथ चुना',
    takeCareerQuizNow: 'अब करियर क्विज़ लें',
    getPersonalizedInsights: 'व्यक्तिगत अंतर्दृष्टि प्राप्त करें',
    matchPercentageLabel: 'मिलान प्रतिशत',
    skillGapAnalysisLabel: 'कौशल अंतराल विश्लेषण',
    customLearningRoadmapLabel: 'कस्टम सीखने का रोडमैप',
    receiveInsightsOn: 'आप अंतर्दृष्टि प्राप्त करेंगे',
  },

  brightFuture: {
    pageTitle: 'उज्ज्वल भविष्य',
    yourProfileInformation: 'आपकी प्रोफ़ाइल जानकारी',
    pleaseReviewAndConfirm: 'कृपया समीक्षा करें और पुष्टि करें',
    confirmProfileDetails: 'प्रोफ़ाइल विवरण की पुष्टि करें',
    personalDetails: 'व्यक्तिगत विवरण',
    careerGoals: 'करियर लक्ष्य',
    skillsInterests: 'कौशल और रुचियां',
    educationBackground: 'शिक्षा पृष्ठभूमि',
    reviewInformation: 'आगे बढ़ने से पहले अपनी जानकारी की समीक्षा करें',
    confirmAndProceed: 'पुष्टि करें और आगे बढ़ें',
  },
}

"""
    
    # Reconstruct the file
    new_content = before_hindi + clean_hindi + after_hindi
    
    with open('offline-translations-complete.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print("File fixed successfully")
    print("Hindi section replaced with clean version")
