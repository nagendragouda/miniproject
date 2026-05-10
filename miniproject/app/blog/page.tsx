'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import BackButton from '@/components/BackButton'
import { 
  BookOpen, 
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight,
  TrendingUp,
  Clock,
  MessageCircle,
  Heart,
  Share,
  Filter,
  Eye,
  Star,
  Coffee,
  ArrowLeft
} from 'lucide-react'
import FloatingShapes from '@/components/FloatingShapes'
import Link from 'next/link'

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = ['All', 'Career Tips', 'Industry Insights', 'Success Stories', 'Technology', 'Education', 'Workplace']

  const blogPosts = [
    {
      id: 1,
      title: 'The Future of AI Careers: What Students Need to Know in 2024',
      category: 'Technology',
      author: 'Sudanva',
      date: '2024-01-20',
      readTime: '8 min read',
      views: 15420,
      likes: 342,
      comments: 89,
      featured: true,
      excerpt: 'Artificial Intelligence is reshaping the job market. Discover the hottest AI careers, required skills, and how to prepare for the future of work in this comprehensive guide.',
      image: '/api/placeholder/800/400',
      tags: ['AI', 'Machine Learning', 'Career Planning', 'Future Jobs']
    },
    {
      id: 2,
      title: '10 Resume Mistakes That Cost You Job Interviews',
      category: 'Career Tips',
      author: 'Career Expert Team',
      date: '2024-01-18',
      readTime: '6 min read',
      views: 23150,
      likes: 567,
      comments: 123,
      featured: true,
      excerpt: 'Avoid these common resume pitfalls that prevent you from getting interview calls. Learn what recruiters really look for and how to make your resume stand out.',
      image: '/api/placeholder/800/400',
      tags: ['Resume', 'Job Search', 'Interview Tips', 'Career Advice']
    },
    {
      id: 3,
      title: 'From Dropout to Tech CEO: Sarah\'s Inspiring Journey',
      category: 'Success Stories',
      author: 'CareerGuide Stories',
      date: '2024-01-15',
      readTime: '12 min read',
      views: 8940,
      likes: 234,
      comments: 67,
      featured: true,
      excerpt: 'How Sarah Chen overcame early setbacks to build a successful tech company. A story of resilience, learning, and career transformation.',
      image: '/api/placeholder/800/400',
      tags: ['Success Story', 'Entrepreneurship', 'Tech Industry', 'Inspiration']
    },
    {
      id: 4,
      title: 'Remote Work Revolution: Building Your Home Office Career',
      category: 'Workplace',
      author: 'Remote Work Specialist',
      date: '2024-01-12',
      readTime: '10 min read',
      views: 12760,
      likes: 398,
      comments: 145,
      featured: false,
      excerpt: 'Master the art of remote work with proven strategies for productivity, communication, and career advancement in virtual environments.',
      image: '/api/placeholder/800/400',
      tags: ['Remote Work', 'Productivity', 'Work From Home', 'Career Growth']
    },
    {
      id: 5,
      title: 'Healthcare Careers Post-Pandemic: New Opportunities',
      category: 'Industry Insights',
      author: 'Dr. Medical Expert',
      date: '2024-01-10',
      readTime: '7 min read',
      views: 9340,
      likes: 187,
      comments: 56,
      featured: false,
      excerpt: 'Explore emerging healthcare careers and how the pandemic has created new opportunities in medical technology, telemedicine, and public health.',
      image: '/api/placeholder/800/400',
      tags: ['Healthcare', 'Medical Careers', 'Pandemic Impact', 'Growth Industries']
    },
    {
      id: 6,
      title: 'Skill-Based Hiring: Why Degrees Matter Less Than Before',
      category: 'Education',
      author: 'HR Industry Expert',
      date: '2024-01-08',
      readTime: '9 min read',
      views: 11250,
      likes: 289,
      comments: 78,
      featured: false,
      excerpt: 'Companies are shifting focus from degrees to demonstrable skills. Learn how to showcase your abilities and thrive in the skill-based economy.',
      image: '/api/placeholder/800/400',
      tags: ['Skills', 'Hiring Trends', 'Education', 'Career Strategy']
    }
  ]

  const trendingTopics = [
    { name: 'AI Careers', posts: 45 },
    { name: 'Remote Work', posts: 38 },
    { name: 'Resume Tips', posts: 52 },
    { name: 'Interview Prep', posts: 41 },
    { name: 'Career Change', posts: 29 },
    { name: 'Skill Development', posts: 33 }
  ]

  const stats = [
    { value: '500+', label: 'Blog Posts', icon: BookOpen },
    { value: '2M+', label: 'Monthly Readers', icon: Eye },
    { value: '15K+', label: 'Comments', icon: MessageCircle },
    { value: '4.9★', label: 'Reader Rating', icon: Star }
  ]

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#030712] text-white">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.15),_transparent_30%),radial-gradient(circle_at_bottom,_rgba(34,211,238,0.1),_transparent_30%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-20 [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      <FloatingShapes />

      {/* Back Button */}
      <div className="absolute top-6 right-6 z-50">
        <BackButton />
      </div>
      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex justify-center mb-6"
            >
              <div className="flex items-center space-x-3 px-6 py-3 glass-card rounded-full">
                <BookOpen className="h-6 w-6 text-secondary" />
                <span className="text-secondary font-semibold">Career Blog</span>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold mb-8"
            >
              <span className="bg-gradient-to-r from-secondary via-white to-warning bg-clip-text text-transparent">
                Career Blog
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed mb-12"
            >
              Stay ahead in your career with insights from industry experts, success stories, 
              and practical advice to navigate your professional journey.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search articles, topics, and insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-glass-bg border border-glass-border rounded-2xl text-text-primary placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors duration-300"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center glass-card p-8 rounded-2xl"
                >
                  <IconComponent className="h-8 w-8 text-secondary mx-auto mb-4" />
                  <div className="text-3xl font-bold text-text-primary mb-2">{stat.value}</div>
                  <div className="text-text-secondary text-sm">{stat.label}</div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Trending <span className="text-secondary">Topics</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {trendingTopics.map((topic, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                className="px-6 py-3 glass-card rounded-full cursor-pointer hover:bg-secondary/10 hover:border-secondary/30 transition-all duration-300"
              >
                <span className="text-text-primary font-semibold">{topic.name}</span>
                <span className="ml-2 text-secondary">({topic.posts})</span>
              </motion.div>
            ))}
          </div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-6 rounded-2xl"
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex items-center space-x-3">
                <Filter className="h-5 w-5 text-secondary" />
                <span className="text-text-primary font-semibold">Filter by Category:</span>
              </div>
              
              <div className="flex-1">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary focus:outline-none focus:border-secondary transition-colors duration-300"
                >
                  {categories.map(category => (
                    <option key={category} value={category} className="bg-background">{category}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-secondary font-semibold">
                {filteredPosts.length} articles
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Featured <span className="text-warning">Articles</span>
            </h2>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {filteredPosts.filter(post => post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl overflow-hidden hover:scale-105 transition-transform duration-300 group"
              >
                <div className="bg-gradient-to-r from-secondary to-warning p-1">
                  <div className="bg-background p-2">
                    <div className="text-center text-text-primary font-semibold text-sm">Featured</div>
                  </div>
                </div>
                
                <div className="aspect-video bg-gradient-to-br from-secondary/20 to-warning/20 flex items-center justify-center">
                  <BookOpen className="h-16 w-16 text-secondary" />
                </div>
                
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-4 text-sm text-slate-600">
                    <span className="px-3 py-1 glass-card rounded-full">{post.category}</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-text-primary mb-4 group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between mb-6 text-sm text-slate-600">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{post.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-6 py-3 bg-gradient-to-r from-secondary to-warning rounded-lg text-space-dark font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 flex items-center justify-center space-x-2"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Latest <span className="text-secondary">Articles</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {filteredPosts.filter(post => !post.featured).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card p-8 rounded-2xl hover:scale-[1.02] transition-transform duration-300 group"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-1/4">
                    <div className="aspect-video bg-gradient-to-br from-secondary/20 to-warning/20 rounded-lg flex items-center justify-center mb-4">
                      <BookOpen className="h-12 w-12 text-secondary" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600">
                      <span className="px-3 py-1 glass-card rounded-full">{post.category}</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-text-primary mb-4 group-hover:text-secondary transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-text-secondary leading-relaxed mb-6">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag, tagIndex) => (
                        <span key={tagIndex} className="px-3 py-1 glass-card rounded-full text-xs text-secondary">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-secondary to-warning rounded-lg text-space-dark font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25 flex items-center space-x-2"
                      >
                        <span>Read More</span>
                        <ArrowRight className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <BookOpen className="h-20 w-20 text-slate-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-text-primary mb-4">No articles found</h3>
              <p className="text-text-secondary max-w-2xl mx-auto">
                Try adjusting your search terms or category filters to find the content you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-2xl"
          >
            <Coffee className="h-16 w-16 text-warning mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-text-primary mb-6">
              Stay Updated
            </h2>
            <p className="text-xl text-text-secondary mb-8 leading-relaxed">
              Get the latest career insights, success stories, and expert advice 
              delivered to your inbox every week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-glass-bg border border-glass-border rounded-lg text-text-primary placeholder-gray-400 focus:outline-none focus:border-secondary transition-colors duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-secondary to-warning rounded-lg text-space-dark font-bold transition-all duration-300 hover:shadow-lg hover:shadow-secondary/25"
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default BlogPage