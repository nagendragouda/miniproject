-- ══════════════════════════════════════════════════════════════════════════════
-- CAREER RESULTS - INSERT & UPDATE QUERIES
-- ══════════════════════════════════════════════════════════════════════════════

-- ═════════════════════════════════════════════════════════════════════════════
-- 1. INSERT CAREER RESULT (Main Analysis Record)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO career_results (
  firebase_uid,
  personality_type,
  quiz_id,
  total_careers_analyzed,
  top_match_score,
  stream_preference,
  learning_style,
  work_style,
  summary_notes
)
VALUES (
  'user_firebase_uid',
  'Analytical',
  'quiz_response_id',
  3,
  92,
  'Science',
  'Visual Learning',
  'Independent',
  'Strong match for analytical problem-solving roles'
)
ON CONFLICT (firebase_uid, analysis_date) 
DO UPDATE SET
  total_careers_analyzed = EXCLUDED.total_careers_analyzed,
  top_match_score = EXCLUDED.top_match_score,
  updated_at = NOW()
RETURNING id;


-- ═════════════════════════════════════════════════════════════════════════════
-- 2. INSERT CAREER PREDICTION (Individual Career Recommendation)
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO career_predictions (
  result_id,
  firebase_uid,
  rank,
  career_name,
  alternate_names,
  based_on_stream,
  match_score,
  personality_alignment_score,
  overview,
  personality_fit,
  career_summary,
  
  -- Education
  suggested_subjects,
  suggested_courses,
  entry_qualifications,
  
  -- Skills
  required_skills,
  soft_skills,
  technical_skills,
  current_skills,
  missing_skills,
  improvement_areas,
  
  -- Tools
  tools_and_technologies,
  programming_languages,
  frameworks_libraries,
  
  -- Development
  recommended_projects,
  learning_resources,
  common_mistakes_to_avoid,
  
  -- Salary
  salary_entry_level,
  salary_mid_level,
  salary_senior_level,
  
  -- Market
  current_demand,
  growth_rate,
  future_scope,
  
  -- Risk
  automation_risk,
  competition_level,
  
  -- Roadmap
  step_1_description,
  step_2_description,
  beginner_phase,
  intermediate_phase,
  advanced_phase,
  
  -- Goals
  goals_next_30_days,
  goals_3_6_months,
  goals_long_term,
  
  -- Resources
  website_guide_url,
  related_videos
)
VALUES (
  'result_id_uuid',
  'user_firebase_uid',
  1,
  'Data Scientist',
  ARRAY['ML Engineer', 'AI Specialist'],
  'Science',
  92,
  85,
  'Career path with strong growth prospects in AI/ML industries. High demand across tech, finance, and healthcare sectors.',
  'Matches your analytical personality and problem-solving approach.',
  'Data Scientists develop algorithms and predictive models to solve business problems.',
  
  -- Education
  ARRAY['Statistics', 'Linear Algebra', 'Programming', 'Databases'],
  ARRAY['B.Tech in Computer Science', 'M.Tech in AI/ML', 'Data Science Specialization'],
  ARRAY['Bachelor in STEM field', 'Strong Math background'],
  
  -- Skills
  ARRAY['Python', 'Machine Learning', 'Statistical Analysis', 'Data Visualization'],
  ARRAY['Communication', 'Problem-solving', 'Teamwork'],
  ARRAY['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch'],
  ARRAY['Python Basics', 'Basic Statistics'],
  ARRAY['Advanced ML', 'Deep Learning', 'Big Data Tools'],
  ARRAY['Communication Skills', 'Domain Knowledge', 'Business Acumen'],
  
  -- Tools
  ARRAY['Python', 'R', 'Jupyter', 'TensorFlow', 'Scikit-Learn'],
  ARRAY['Python', 'R', 'SQL'],
  ARRAY['TensorFlow', 'PyTorch', 'Scikit-Learn', 'Pandas', 'NumPy'],
  
  -- Projects
  ARRAY['Build predictive model for real-world dataset', 'Create ML pipeline for customer churn prediction', 'Develop recommendation system'],
  ARRAY['Andrew Ng ML course', 'Fast.ai', 'Kaggle competitions', 'Research papers'],
  ARRAY['Ignoring data quality', 'Overfitting models', 'Poor communication of results'],
  
  -- Salary
  '₹8-15 LPA',
  '₹25-50 LPA',
  '₹60-150+ LPA',
  
  -- Market
  'High - Exponential demand in AI/ML',
  '15-20% annually',
  'Extremely positive with growing adoption across industries',
  
  -- Risk
  'Low - Roles evolving with technology',
  'Moderate - Requires continuous learning',
  
  -- Roadmap
  'Master Python, Statistics, and Data Structures fundamentals',
  'Build practical projects, learn ML algorithms, contribute to open source',
  ARRAY['Learn Python basics', 'Study Statistics', 'Practice data analysis', 'Join online communities'],
  ARRAY['Build 3-4 ML projects', 'Master TensorFlow/PyTorch', 'Contribute to open source'],
  ARRAY['Learn advanced algorithms', 'Specialize in domain', 'Lead research projects'],
  
  -- Goals
  ARRAY['Complete Python course', 'Build first ML project', 'Understand key ML concepts'],
  ARRAY['Build 2-3 portfolio projects', 'Gain hands-on experience', 'Prepare for internship'],
  ARRAY['Secure data science internship/job', 'Develop expertise in specialization'],
  
  -- Resources
  'https://www.shiksha.com/careers/data-scientist',
  ARRAY[
    '{"title": "Python for Data Science", "url": "https://youtube.com/...", "duration": "10 hours"}',
    '{"title": "Machine Learning Basics", "url": "https://youtube.com/...", "duration": "15 hours"}',
    '{"title": "Data Visualization with Python", "url": "https://youtube.com/...", "duration": "8 hours"}'
  ]
)
RETURNING id;


-- ═════════════════════════════════════════════════════════════════════════════
-- 3. GET ALL CAREER PREDICTIONS FOR A USER
-- ═════════════════════════════════════════════════════════════════════════════

SELECT 
  cp.id,
  cp.rank,
  cp.career_name,
  cp.match_score,
  cp.overview,
  cp.personality_fit,
  cp.salary_entry_level,
  cp.salary_mid_level,
  cp.salary_senior_level,
  cp.current_demand,
  cr.personality_type
FROM career_predictions cp
JOIN career_results cr ON cp.result_id = cr.id
WHERE cp.firebase_uid = 'user_firebase_uid'
ORDER BY cp.rank ASC;


-- ═════════════════════════════════════════════════════════════════════════════
-- 4. GET FULL CAREER PREDICTION DETAILS FOR DISPLAY
-- ═════════════════════════════════════════════════════════════════════════════

SELECT 
  cp.*,
  cr.personality_type,
  cr.analysis_date
FROM career_predictions cp
JOIN career_results cr ON cp.result_id = cr.id
WHERE cp.firebase_uid = 'user_firebase_uid' 
  AND cp.career_name = 'Data Scientist'
  AND cp.rank = 1;


-- ═════════════════════════════════════════════════════════════════════════════
-- 5. UPDATE CAREER PREDICTION (Save/Favorite)
-- ═════════════════════════════════════════════════════════════════════════════

UPDATE career_predictions
SET 
  is_saved_by_user = TRUE,
  user_notes = 'This career aligns perfectly with my interests',
  updated_at = NOW()
WHERE id = 'career_prediction_id'
  AND firebase_uid = 'user_firebase_uid';


-- ═════════════════════════════════════════════════════════════════════════════
-- 6. GET LATEST CAREER RESULTS FOR USER
-- ═════════════════════════════════════════════════════════════════════════════

SELECT 
  cr.id,
  cr.personality_type,
  cr.total_careers_analyzed,
  cr.top_match_score,
  cr.analysis_date,
  COUNT(cp.id) as total_predictions
FROM career_results cr
LEFT JOIN career_predictions cp ON cr.id = cp.result_id
WHERE cr.firebase_uid = 'user_firebase_uid'
GROUP BY cr.id
ORDER BY cr.created_at DESC
LIMIT 1;


-- ═════════════════════════════════════════════════════════════════════════════
-- 7. GET SAVED CAREERS (User's Bookmarked Predictions)
-- ═════════════════════════════════════════════════════════════════════════════

SELECT 
  cp.id,
  cp.rank,
  cp.career_name,
  cp.match_score,
  cp.overview,
  cp.salary_entry_level,
  cp.salary_mid_level,
  cp.salary_senior_level,
  cp.user_notes
FROM career_predictions cp
WHERE cp.firebase_uid = 'user_firebase_uid'
  AND cp.is_saved_by_user = TRUE
ORDER BY cp.match_score DESC;


-- ═════════════════════════════════════════════════════════════════════════════
-- 8. BULK INSERT MULTIPLE CAREER PREDICTIONS
-- ═════════════════════════════════════════════════════════════════════════════

INSERT INTO career_predictions (
  result_id, firebase_uid, rank, career_name, match_score, 
  overview, personality_fit, required_skills, salary_entry_level, 
  salary_mid_level, salary_senior_level, current_demand
) VALUES
  ('result_uuid', 'user_uid', 1, 'Software Engineer', 92, 
   'High demand career with excellent growth', 'Perfect match', 
   ARRAY['Programming', 'Problem-solving'], '₹6-12 LPA', '₹15-30 LPA', '₹50-100+ LPA', 'Very High'),
  
  ('result_uuid', 'user_uid', 2, 'Product Manager', 87, 
   'Leadership role combining technical and business skills', 'Good match',
   ARRAY['Leadership', 'Analytics'], '₹10-15 LPA', '₹25-50 LPA', '₹60-120+ LPA', 'High'),
  
  ('result_uuid', 'user_uid', 3, 'Solutions Architect', 85, 
   'Senior technical role designing system solutions', 'Good match',
   ARRAY['System Design', 'Communication'], '₹15-25 LPA', '₹40-70 LPA', '₹80-150+ LPA', 'High');


-- ═════════════════════════════════════════════════════════════════════════════
-- 9. GET STATISTICS - Skills Gap for User
-- ═════════════════════════════════════════════════════════════════════════════

SELECT 
  career_name,
  rank,
  current_skills,
  missing_skills,
  improvement_areas
FROM career_predictions
WHERE firebase_uid = 'user_firebase_uid'
ORDER BY rank ASC;


-- ═════════════════════════════════════════════════════════════════════════════
-- 10. DELETE OLD CAREER RESULTS (Keep only last 5 analyses)
-- ═════════════════════════════════════════════════════════════════════════════

DELETE FROM career_results
WHERE firebase_uid = 'user_firebase_uid'
  AND id NOT IN (
    SELECT id FROM career_results
    WHERE firebase_uid = 'user_firebase_uid'
    ORDER BY created_at DESC
    LIMIT 5
  );
