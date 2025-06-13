"""
Unit tests for EffectivenessCalculator

Tests cover:
- Corner cases (empty text, extremely long text, etc.)
- All scoring components
- Normalization configuration
- Performance with various input types
- Edge cases and boundary conditions
"""

import unittest
import sys
import os
import time

# Add backend/src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from utils.effectiveness_calculator import (
    EffectivenessCalculator, 
    NormalizationConfig, 
    SuggestionEngine,
    effectiveness_calculator
)


class TestSuggestionEngine(unittest.TestCase):
    """Test the separate suggestion engine"""
    
    def setUp(self):
        self.engine = SuggestionEngine()
    
    def test_empty_text(self):
        """Test suggestions for empty text"""
        suggestions = self.engine.get_suggestions("")
        self.assertEqual(suggestions, ["Add content to your prompt"])
    
    def test_none_text(self):
        """Test suggestions for None text"""
        suggestions = self.engine.get_suggestions(None)
        self.assertEqual(suggestions, ["Add content to your prompt"])
    
    def test_perfect_prompt(self):
        """Test suggestions for a well-formed prompt"""
        perfect_prompt = """
        Please provide a comprehensive analysis of the market trends.
        
        Context: This is for a business presentation.
        
        Please include:
        - Market overview
        - Key insights
        - Recommendations
        
        Format as a structured report with clear sections.
        Limit to 500 words.
        """
        suggestions = self.engine.get_suggestions(perfect_prompt)
        self.assertEqual(len(suggestions), 0)  # No suggestions needed
    
    def test_basic_prompt(self):
        """Test suggestions for a basic prompt"""
        basic_prompt = "Help me write something"
        suggestions = self.engine.get_suggestions(basic_prompt)
        self.assertGreater(len(suggestions), 0)
        self.assertIn("Add polite language", suggestions[0])


class TestNormalizationConfig(unittest.TestCase):
    """Test normalization configuration"""
    
    def test_default_config(self):
        """Test default configuration values"""
        config = NormalizationConfig()
        self.assertEqual(config.max_time_saved_seconds, 300)
        self.assertEqual(config.max_usage_count, 100)
        self.assertEqual(config.max_word_count, 500)
        self.assertEqual(config.min_word_count, 10)
        self.assertEqual(config.optimal_word_range, (20, 200))
    
    def test_custom_config(self):
        """Test custom configuration"""
        config = NormalizationConfig(
            max_time_saved_seconds=600,
            max_usage_count=50,
            max_word_count=1000,
            min_word_count=5,
            optimal_word_range=(10, 300)
        )
        self.assertEqual(config.max_time_saved_seconds, 600)
        self.assertEqual(config.max_usage_count, 50)
        self.assertEqual(config.max_word_count, 1000)
        self.assertEqual(config.min_word_count, 5)
        self.assertEqual(config.optimal_word_range, (10, 300))


class TestEffectivenessCalculator(unittest.TestCase):
    """Test the main effectiveness calculator"""
    
    def setUp(self):
        self.calculator = EffectivenessCalculator()
        self.custom_config = NormalizationConfig(
            max_time_saved_seconds=600,
            max_usage_count=50,
            max_word_count=1000,
            min_word_count=5,
            optimal_word_range=(10, 300)
        )
        self.custom_calculator = EffectivenessCalculator(self.custom_config)
    
    def test_empty_inputs(self):
        """Test with empty inputs"""
        score = self.calculator.calculate_overall_effectiveness("", "")
        self.assertEqual(score, 0.0)
        
        score = self.calculator.calculate_overall_effectiveness("", "Some text")
        self.assertEqual(score, 0.0)
        
        score = self.calculator.calculate_overall_effectiveness("Some text", "")
        self.assertEqual(score, 0.0)
    
    def test_none_inputs(self):
        """Test with None inputs"""
        score = self.calculator.calculate_overall_effectiveness(None, None)
        self.assertEqual(score, 0.0)
    
    def test_extremely_long_text(self):
        """Test with extremely long text"""
        long_text = "This is a very long text. " * 1000  # ~6000 words
        score = self.calculator.calculate_overall_effectiveness("Short", long_text)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
    
    def test_all_uppercase_text(self):
        """Test with all uppercase text"""
        uppercase_text = "PLEASE PROVIDE A COMPREHENSIVE ANALYSIS"
        score = self.calculator.calculate_overall_effectiveness("test", uppercase_text)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
    
    def test_special_characters(self):
        """Test with special characters"""
        special_text = "Please analyze this: @#$%^&*()_+{}|:<>?[]\\;',./"
        score = self.calculator.calculate_overall_effectiveness("test", special_text)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
    
    def test_unicode_text(self):
        """Test with unicode text"""
        unicode_text = "请提供详细的分析报告。包括市场趋势和未来预测。"
        score = self.calculator.calculate_overall_effectiveness("test", unicode_text)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
    
    def test_clarity_score_components(self):
        """Test individual clarity score components"""
        # Test specific instructions
        text_with_instructions = "Please provide a detailed analysis. Include examples and focus on key points."
        clarity_score = self.calculator._calculate_clarity_score(text_with_instructions)
        self.assertGreater(clarity_score, 0.0)
        
        # Test actionable requests
        text_with_actions = "Create a report. Generate insights. Write recommendations."
        clarity_score = self.calculator._calculate_clarity_score(text_with_actions)
        self.assertGreater(clarity_score, 0.0)
        
        # Test constraints
        text_with_constraints = "Limit to 500 words. Maximum 3 pages. Within budget constraints."
        clarity_score = self.calculator._calculate_clarity_score(text_with_constraints)
        self.assertGreater(clarity_score, 0.0)
    
    def test_quality_score_components(self):
        """Test individual quality score components"""
        original = "Write something"
        enhanced = """
        Please create a comprehensive analysis report.
        
        Include:
        1. Market overview
        2. Key insights
        3. Recommendations
        
        Format with clear sections and bullet points.
        """
        
        quality_score = self.calculator._calculate_quality_score(original, enhanced)
        self.assertGreater(quality_score, 0.0)
        self.assertLessEqual(quality_score, 1.0)
    
    def test_usage_score_components(self):
        """Test individual usage score components"""
        # Test with high usage
        high_usage_metrics = {
            'usage_count': 50,
            'user_feedback': 0.9,
            'time_saved': 200,
            'success_rate': 0.95
        }
        usage_score = self.calculator._calculate_usage_score(high_usage_metrics)
        self.assertGreater(usage_score, 0.0)
        self.assertLessEqual(usage_score, 1.0)
        
        # Test with low usage
        low_usage_metrics = {
            'usage_count': 1,
            'user_feedback': 0.5,
            'time_saved': 30,
            'success_rate': 0.6
        }
        usage_score = self.calculator._calculate_usage_score(low_usage_metrics)
        self.assertGreaterEqual(usage_score, 0.0)
        self.assertLessEqual(usage_score, 1.0)
    
    def test_normalization_config_impact(self):
        """Test that normalization config affects scores"""
        metrics = {
            'usage_count': 25,
            'user_feedback': 0.8,
            'time_saved': 300,
            'success_rate': 0.9
        }
        
        # With default config (max_usage_count=100)
        default_score = self.calculator._calculate_usage_score(metrics)
        
        # With custom config (max_usage_count=50)
        custom_score = self.custom_calculator._calculate_usage_score(metrics)
        
        # Custom config should give higher score for same usage count
        self.assertGreater(custom_score, default_score)
    
    def test_breakdown_consistency(self):
        """Test that breakdown scores are consistent with overall score"""
        original = "Write a report"
        enhanced = """
        Please create a comprehensive market analysis report.
        
        Context: This is for quarterly business review.
        
        Include:
        - Market trends
        - Competitive analysis
        - Recommendations
        
        Format as structured document with clear sections.
        Limit to 1000 words.
        """
        
        metrics = {
            'usage_count': 10,
            'user_feedback': 0.8,
            'time_saved': 150,
            'success_rate': 0.85
        }
        
        breakdown = self.calculator.get_effectiveness_breakdown(original, enhanced, metrics)
        overall_score = self.calculator.calculate_overall_effectiveness(original, enhanced, metrics)
        
        self.assertAlmostEqual(breakdown['overall_score'], overall_score, places=3)
        self.assertGreaterEqual(breakdown['overall_score'], 0.0)
        self.assertLessEqual(breakdown['overall_score'], 1.0)
    
    def test_performance(self):
        """Test performance with large text"""
        large_text = "This is a test sentence. " * 1000  # ~6000 words
        
        start_time = time.time()
        score = self.calculator.calculate_overall_effectiveness("test", large_text)
        end_time = time.time()
        
        # Should complete within 1 second
        self.assertLess(end_time - start_time, 1.0)
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
    
    def test_config_update(self):
        """Test dynamic configuration update"""
        original_config = self.calculator.config.max_usage_count
        new_config = NormalizationConfig(max_usage_count=200)
        
        self.calculator.update_normalization_config(new_config)
        self.assertEqual(self.calculator.config.max_usage_count, 200)
        self.assertNotEqual(self.calculator.config.max_usage_count, original_config)
    
    def test_edge_case_word_counts(self):
        """Test edge cases for word count scoring"""
        # Very short text
        short_text = "Help"
        score = self.calculator._calculate_quality_score("", short_text)
        self.assertGreaterEqual(score, 0.0)
        
        # Very long text
        long_text = "This is a very long text. " * 100  # ~600 words
        score = self.calculator._calculate_quality_score("", long_text)
        self.assertGreaterEqual(score, 0.0)
        
        # Optimal length text
        optimal_text = "This is an optimal length text with exactly the right number of words to score well. " * 5
        score = self.calculator._calculate_quality_score("", optimal_text)
        self.assertGreaterEqual(score, 0.0)
    
    def test_regex_patterns(self):
        """Test that regex patterns work correctly"""
        # Test clarity patterns
        test_text = "Please provide a detailed analysis. Include examples. Focus on key points."
        clarity_score = self.calculator._calculate_clarity_score(test_text)
        self.assertGreater(clarity_score, 0.0)
        
        # Test quality patterns
        test_text = """
        This is a structured text.
        
        1. First point
        2. Second point
        
        However, there are additional considerations.
        """
        quality_score = self.calculator._calculate_quality_score("", test_text)
        self.assertGreater(quality_score, 0.0)


class TestIntegration(unittest.TestCase):
    """Integration tests for the complete system"""
    
    def setUp(self):
        self.calculator = effectiveness_calculator
    
    def test_complete_workflow(self):
        """Test complete workflow from original to enhanced prompt"""
        original = "Write a blog post"
        enhanced = """
        Please create an engaging blog post about artificial intelligence in healthcare.
        
        Context: Target audience is healthcare professionals interested in technology.
        
        Requirements:
        - Compelling introduction
        - 3-4 key benefits with examples
        - Real-world applications
        - Future implications
        
        Format: 800-1000 words with clear sections and bullet points.
        Focus on practical benefits that healthcare professionals can implement.
        """
        
        metrics = {
            'usage_count': 15,
            'user_feedback': 0.92,
            'time_saved': 180,
            'success_rate': 0.88
        }
        
        # Calculate effectiveness
        score = self.calculator.calculate_overall_effectiveness(original, enhanced, metrics)
        breakdown = self.calculator.get_effectiveness_breakdown(original, enhanced, metrics)
        suggestions = self.calculator.get_improvement_suggestions(enhanced)
        
        # Validate results
        self.assertGreaterEqual(score, 0.0)
        self.assertLessEqual(score, 1.0)
        self.assertIn('overall_score', breakdown)
        self.assertIn('clarity_score', breakdown)
        self.assertIn('quality_score', breakdown)
        self.assertIn('usage_score', breakdown)
        self.assertIsInstance(suggestions, list)
        
        # High-quality prompt should have few suggestions
        self.assertLessEqual(len(suggestions), 2)


if __name__ == '__main__':
    # Run tests with verbose output
    unittest.main(verbosity=2) 