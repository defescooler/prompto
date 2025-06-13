#!/usr/bin/env python3
"""
Test script to demonstrate effectiveness score calculation
"""
import sys
import os

# Add backend/src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend', 'src'))

from utils.effectiveness_calculator import effectiveness_calculator, NormalizationConfig

def test_effectiveness_calculation():
    """Test effectiveness score calculation with real examples"""
    
    print("🎯 Testing Effectiveness Score Calculation\n")
    
    # Example 1: Good prompt
    print("📝 Example 1: Well-structured prompt")
    original_1 = "Write a blog post about AI"
    enhanced_1 = """
    Please create a comprehensive blog post about artificial intelligence in healthcare. 
    
    Context: This is for a medical technology blog targeting healthcare professionals.
    
    Please include:
    - An engaging introduction that captures the reader's attention
    - 3-4 key benefits of AI in healthcare
    - Real-world examples and case studies
    - Potential challenges and considerations
    - A conclusion with actionable insights
    
    Format the response in clear paragraphs with subheadings. 
    Limit the total length to 800-1000 words.
    Focus on practical applications that healthcare professionals can implement.
    """
    
    metrics_1 = {
        'usage_count': 5,
        'user_feedback': 0.9,
        'time_saved': 180,
        'success_rate': 0.95
    }
    
    breakdown_1 = effectiveness_calculator.get_effectiveness_breakdown(
        original_text=original_1,
        enhanced_text=enhanced_1,
        metrics=metrics_1
    )
    
    print(f"Original: {original_1}")
    print(f"Enhanced: {enhanced_1[:100]}...")
    print(f"Overall Score: {breakdown_1['overall_score']:.3f}")
    print(f"  - Clarity Score: {breakdown_1['clarity_score']:.3f}")
    print(f"  - Quality Score: {breakdown_1['quality_score']:.3f}")
    print(f"  - Usage Score: {breakdown_1['usage_score']:.3f}")
    print()
    
    # Example 2: Poor prompt
    print("📝 Example 2: Basic prompt")
    original_2 = "Help me with code"
    enhanced_2 = "Please help me review this Python code and provide feedback on best practices and potential improvements."
    
    metrics_2 = {
        'usage_count': 1,
        'user_feedback': 0.6,
        'time_saved': 60,
        'success_rate': 0.7
    }
    
    breakdown_2 = effectiveness_calculator.get_effectiveness_breakdown(
        original_text=original_2,
        enhanced_text=enhanced_2,
        metrics=metrics_2
    )
    
    print(f"Original: {original_2}")
    print(f"Enhanced: {enhanced_2}")
    print(f"Overall Score: {breakdown_2['overall_score']:.3f}")
    print(f"  - Clarity Score: {breakdown_2['clarity_score']:.3f}")
    print(f"  - Quality Score: {breakdown_2['quality_score']:.3f}")
    print(f"  - Usage Score: {breakdown_2['usage_score']:.3f}")
    print()
    
    # Example 3: Excellent prompt
    print("📝 Example 3: Excellent prompt")
    original_3 = "Write an email"
    enhanced_3 = """
    Please compose a persuasive marketing email for our new AI-powered productivity tool launch.
    
    Context: We're targeting small business owners who are struggling with time management.
    
    Requirements:
    - Subject line that creates urgency and curiosity
    - Opening that immediately addresses their pain point
    - 3 key benefits with specific examples
    - Social proof (customer testimonials)
    - Clear call-to-action with limited-time offer
    - Professional but friendly tone
    
    Format: 
    - Keep it under 200 words
    - Use bullet points for benefits
    - Include a compelling subject line
    - End with a strong CTA button
    
    Goal: Drive 15% click-through rate to our landing page.
    """
    
    metrics_3 = {
        'usage_count': 12,
        'user_feedback': 0.95,
        'time_saved': 240,
        'success_rate': 0.98
    }
    
    breakdown_3 = effectiveness_calculator.get_effectiveness_breakdown(
        original_text=original_3,
        enhanced_text=enhanced_3,
        metrics=metrics_3
    )
    
    print(f"Original: {original_3}")
    print(f"Enhanced: {enhanced_3[:100]}...")
    print(f"Overall Score: {breakdown_3['overall_score']:.3f}")
    print(f"  - Clarity Score: {breakdown_3['clarity_score']:.3f}")
    print(f"  - Quality Score: {breakdown_3['quality_score']:.3f}")
    print(f"  - Usage Score: {breakdown_3['usage_score']:.3f}")
    print()
    
    # Show improvement suggestions
    print("💡 Improvement Suggestions for Basic Prompt:")
    suggestions = effectiveness_calculator.get_improvement_suggestions(enhanced_2)
    for i, suggestion in enumerate(suggestions, 1):
        print(f"  {i}. {suggestion}")
    print()
    
    # Show scoring weights
    print("⚖️ Scoring Weights:")
    print(f"  - Clarity: {breakdown_1['clarity_weight']:.0%}")
    print(f"  - Quality: {breakdown_1['quality_weight']:.0%}")
    print(f"  - Usage: {breakdown_1['usage_weight']:.0%}")
    print()
    
    # Test normalization configuration
    print("🔧 Testing Normalization Configuration:")
    custom_config = NormalizationConfig(
        max_time_saved_seconds=600,
        max_usage_count=50,
        max_word_count=1000,
        min_word_count=5,
        optimal_word_range=(10, 300)
    )
    
    custom_calculator = effectiveness_calculator.__class__(custom_config)
    custom_breakdown = custom_calculator.get_effectiveness_breakdown(
        original_text=original_1,
        enhanced_text=enhanced_1,
        metrics=metrics_1
    )
    
    print(f"Default config score: {breakdown_1['overall_score']:.3f}")
    print(f"Custom config score: {custom_breakdown['overall_score']:.3f}")
    print()
    
    print("🎯 Effectiveness Score Components:")
    print("  Clarity Score (40%): Measures how clear and specific the prompt is")
    print("    - Specific instructions (25%)")
    print("    - Actionable request (25%)")
    print("    - Constraints defined (25%)")
    print("    - Clear format (25%)")
    print()
    print("  Quality Score (35%): Measures improvement from original to enhanced")
    print("    - Length appropriateness (20%)")
    print("    - Structure clarity (25%)")
    print("    - Specificity improvement (30%)")
    print("    - Formatting quality (25%)")
    print()
    print("  Usage Score (25%): Measures real-world performance")
    print("    - Usage frequency (30%)")
    print("    - User feedback (25%)")
    print("    - Time saved (25%)")
    print("    - Success rate (20%)")
    print()
    print("🔧 Improvements Made:")
    print("  ✅ Normalization & scaling: Configurable parameters")
    print("  ✅ Overlap removal: Separate clarity and quality patterns")
    print("  ✅ Performance: Pre-compiled regex patterns")
    print("  ✅ Documentation: Comprehensive type hints and docstrings")
    print("  ✅ Separation of concerns: SuggestionEngine class")
    print("  ✅ Extensibility: Plugin-ready architecture")

if __name__ == '__main__':
    test_effectiveness_calculation() 