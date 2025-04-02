import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronUp, Zap, BookOpen, Target, MessageSquare, BarChart, Hexagon, Radio, Users, Eye, MessageCircle, Award } from 'lucide-react';

interface RoadmapFeature {
  id: string;
  name: string;
  selected?: boolean;
  icon: React.ReactNode;
  description: string;
  details?: string[];
}

export function RoadmapFeaturesList() {
  const [showAllFeatures, setShowAllFeatures] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  // State to track animation status
  const [isAnimating, setIsAnimating] = useState(false);

  // First set of features (from first image)
  const featuresSet1: RoadmapFeature[] = [
    {
      id: 'animated-wcag-walkthrough',
      name: 'Animated WCAG Compliance Walkthrough',
      selected: true,
      icon: <BookOpen className="h-5 w-5" />,
      description: 'Interactive step-by-step guide through WCAG compliance requirements with animated visualizations',
      details: [
        'Visual demonstrations of accessibility principles',
        'Interactive examples of compliance vs. non-compliance',
        'Step-by-step guidance through remediation',
        'Progress tracking and bookmarking'
      ]
    },
    {
      id: 'one-click-suggestions',
      name: 'One-Click Accessibility Enhancement Suggestions',
      icon: <Zap className="h-5 w-5" />,
      description: 'Instantly apply recommended accessibility fixes to your content with a single click',
      details: [
        'AI-powered fix recommendations',
        'Preview changes before applying',
        'Bulk fix application options',
        'Fix history and reversion capability'
      ]
    },
    {
      id: 'contextual-tooltip',
      name: 'Contextual Help Tooltip System',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Context-aware tooltips that provide guidance exactly when and where you need it',
      details: [
        'Smart detection of user confusion points',
        'WCAG reference integration',
        'Visual examples of proper implementation',
        'Customizable tooltip display settings'
      ]
    },
    {
      id: 'accessibility-gamification',
      name: 'Accessibility Score Gamification',
      icon: <Award className="h-5 w-5" />,
      description: 'Turn accessibility improvements into an engaging, rewarding experience',
      details: [
        'Achievement badges for reaching compliance milestones',
        'Team competition features',
        'Weekly accessibility challenges',
        'Shareable accessibility success stories'
      ]
    },
    {
      id: 'feedback-sidebar',
      name: 'Interactive Content Feedback Sidebar',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Get real-time feedback on content accessibility as you create',
      details: [
        'Live accessibility score updates',
        'Context-specific improvement suggestions',
        'Reference to accessibility best practices',
        'Integration with popular content management systems'
      ]
    }
  ];

  // Second set of features (from second image)
  const featuresSet2: RoadmapFeature[] = [
    {
      id: 'ai-suggestion-engine',
      name: 'AI-powered Suggestion Engine for immediate accessibility improvements',
      icon: <Hexagon className="h-5 w-5" />,
      description: 'Use AI to identify and implement the most impactful accessibility improvements',
      details: [
        'Prioritized suggestions based on impact',
        'Code-level fix implementation',
        'Learning algorithm that improves over time',
        'Integration with development workflows'
      ]
    },
    {
      id: 'gamified-learning',
      name: 'Gamified Learning Module with achievement badges for accessibility best practices',
      icon: <Target className="h-5 w-5" />,
      description: 'Learn accessibility best practices through engaging, game-like experiences',
      details: [
        'Interactive challenges and quizzes',
        'Progress tracking with visual indicators',
        'Shareable achievements and certifications',
        'Personalized learning paths'
      ]
    },
    {
      id: 'collaborative-annotation',
      name: 'Collaborative Annotation and Feedback Layer for team accessibility reviews',
      icon: <Users className="h-5 w-5" />,
      description: 'Enable teams to collaboratively review and improve accessibility',
      details: [
        'Real-time annotation capabilities',
        'Comment threads on specific accessibility issues',
        'Task assignment and tracking',
        'Integration with project management tools'
      ]
    },
    {
      id: 'score-visualization',
      name: 'Accessibility Score Visualization with animated progress indicators',
      icon: <BarChart className="h-5 w-5" />,
      description: 'Track and visualize your accessibility progress over time',
      details: [
        'Detailed breakdown of compliance by category',
        'Historical trend analysis',
        'Comparative benchmarking',
        'Exportable reports for stakeholders'
      ]
    },
    {
      id: 'wcag-wizard',
      name: 'Interactive WCAG Guideline Wizard with step-by-step compliance checklist',
      icon: <Eye className="h-5 w-5" />,
      description: 'Navigate WCAG guidelines with an interactive wizard that simplifies compliance',
      details: [
        'Personalized compliance roadmap',
        'Interactive checklists for each guideline',
        'Progress tracking across all WCAG criteria',
        'Detailed explanations and examples'
      ]
    }
  ];

  // Third set of features (from third image)
  const featuresSet3: RoadmapFeature[] = [
    {
      id: 'navigation-heatmap',
      name: 'Dynamic Navigation Heat Map Analytics',
      icon: <Radio className="h-5 w-5" />,
      description: 'Visualize how users navigate through your site to identify accessibility barriers',
      details: [
        'User journey visualization',
        'Identification of navigation pain points',
        'Comparison of navigation patterns across different user groups',
        'Recommendations for navigation structure improvements'
      ]
    },
    {
      id: 'content-recommendation',
      name: 'Contextual Content Recommendation Engine',
      icon: <MessageCircle className="h-5 w-5" />,
      description: 'Get AI-powered recommendations for more accessible content alternatives',
      details: [
        'Alternative text suggestions for images',
        'Readability improvements for complex text',
        'Color contrast enhancement suggestions',
        'Structure and formatting recommendations'
      ]
    },
    {
      id: 'redundancy-detector',
      name: 'Automated Content Redundancy Detector',
      icon: <Check className="h-5 w-5" />,
      description: 'Identify and eliminate redundant content that hinders accessibility',
      details: [
        'Duplicate content detection',
        'Identification of similar information across pages',
        'Consolidation recommendations',
        'Information architecture improvement suggestions'
      ]
    },
    {
      id: 'cross-reference-checker',
      name: 'Intelligent Link and Cross-Reference Checker',
      icon: <Zap className="h-5 w-5" />,
      description: 'Ensure all cross-references and links maintain accessibility',
      details: [
        'Broken link detection',
        'Link text quality assessment',
        'Context-appropriate linking recommendations',
        'Link destination accessibility evaluation'
      ]
    },
    {
      id: 'categorization-wizard',
      name: 'Advanced Content Categorization Wizard',
      icon: <Target className="h-5 w-5" />,
      description: 'Intelligently categorize content for better organization and accessibility',
      details: [
        'Automated content classification',
        'Taxonomy recommendations',
        'Semantic structure improvements',
        'Enhanced information architecture'
      ]
    }
  ];

  // All features combined
  const allFeatures = [...featuresSet1, ...featuresSet2, ...featuresSet3];
  
  // Features to display based on showAllFeatures state
  const displayedFeatures = showAllFeatures ? allFeatures : featuresSet1;

  const toggleShowAllFeatures = () => {
    setShowAllFeatures(!showAllFeatures);
  };

  const handleFeatureClick = (featureId: string) => {
    setIsAnimating(true);
    
    // If the clicked feature is already selected, deselect it
    if (selectedFeature === featureId) {
      setSelectedFeature(null);
    } else {
      setSelectedFeature(featureId);
    }
    
    // After a brief delay, stop the animation
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="space-y-4">
      {displayedFeatures.map((feature) => (
        <div key={feature.id} className="mb-4">
          <motion.button
            className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between transition-colors ${
              selectedFeature === feature.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-blue-300 hover:bg-gray-700'
            }`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            animate={{ 
              backgroundColor: selectedFeature === feature.id ? '#2563EB' : '#1F2937',
              color: selectedFeature === feature.id ? '#ffffff' : '#93C5FD' 
            }}
            onClick={() => handleFeatureClick(feature.id)}
          >
            <div className="flex items-center">
              <div className={`mr-3 ${selectedFeature === feature.id ? 'text-white' : 'text-blue-300'}`}>
                {feature.icon}
              </div>
              <span>{feature.name}</span>
            </div>
            {selectedFeature === feature.id && (
              <Check className="h-5 w-5 text-white" />
            )}
          </motion.button>

          <AnimatePresence>
            {selectedFeature === feature.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg mt-2 p-4 shadow-sm"
              >
                <p className="text-gray-700 mb-3">{feature.description}</p>
                {feature.details && (
                  <div className="mt-3">
                    <h4 className="font-medium text-gray-900 mb-2">Key capabilities:</h4>
                    <ul className="space-y-1">
                      {feature.details.map((detail, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          <span className="text-gray-600">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {featuresSet2.length > 0 && (
        <div className="pt-4 flex justify-center">
          <button
            onClick={toggleShowAllFeatures}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
          >
            {showAllFeatures ? (
              <>
                Show fewer features <ChevronUp className="ml-2 h-5 w-5" />
              </>
            ) : (
              <>
                Show more features <ChevronDown className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}