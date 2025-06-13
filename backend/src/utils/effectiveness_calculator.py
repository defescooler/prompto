"""
Effectiveness Score Calculator for Prompt Enhancement

This module calculates effectiveness scores for prompts based on various metrics:
- Clarity and specificity
- Length and detail
- Structure and formatting
- User feedback and usage patterns
- AI response quality indicators
"""

import re
import math
from typing import Dict, List, Optional, Literal, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta

# Type aliases for better readability
ScoreBreakdown = Dict[str, float]
SuggestionList = List[str]
EffectivenessMetrics = Dict[Literal['usage_count', 'user_feedback', 'time_saved', 'success_rate'], float]

@dataclass
class NormalizationConfig:
    """Configuration for score normalization"""
    max_time_saved_seconds: int = 300
    max_usage_count: int = 100
    max_word_count: int = 500
    min_word_count: int = 10
    optimal_word_range: Tuple[int, int] = (20, 200)

class SuggestionEngine:
    """Separate engine for generating improvement suggestions"""
    
    def __init__(self):
        self.suggestion_rules = [
            {
                'condition': lambda text: not re.search(r'please|kindly|could you', text.lower()),
                'suggestion': "Add polite language (e.g., 'please', 'kindly')"
            },
            {
                'condition': lambda text: not re.search(r'\b(provide|include|focus|emphasize)\b', text.lower()),
                'suggestion': "Include specific instructions (e.g., 'provide', 'include', 'focus on')"
            },
            {
                'condition': lambda text: not re.search(r'context|background|situation', text.lower()),
                'suggestion': "Add context or background information"
            },
            {
                'condition': lambda text: not re.search(r'format|structure|organize', text.lower()),
                'suggestion': "Specify desired format or structure"
            },
            {
                'condition': lambda text: len(text.split()) < 20,
                'suggestion': "Add more detail and specificity"
            },
            {
                'condition': lambda text: len(text.split()) > 200,
                'suggestion': "Consider breaking into smaller, focused prompts"
            }
        ]
    
    def get_suggestions(self, text: str) -> SuggestionList:
        """Get improvement suggestions for a prompt"""
        if not text:
            return ["Add content to your prompt"]
        
        suggestions = []
        for rule in self.suggestion_rules:
            if rule['condition'](text):
                suggestions.append(rule['suggestion'])
        
        return suggestions

class EffectivenessCalculator:
    """Calculate effectiveness scores for prompts with improved architecture"""
    
    def __init__(self, normalization_config: Optional[NormalizationConfig] = None):
        self.config = normalization_config or NormalizationConfig()
        
        # Pre-compile regex patterns for performance
        self._compile_patterns()
        
        # Separate suggestion engine
        self.suggestion_engine = SuggestionEngine()
        
        # Weights for different components
        self.component_weights = {
            'clarity': 0.40,
            'quality': 0.35,
            'usage': 0.25
        }
        
        # Clarity-specific weights (mutually exclusive patterns)
        self.clarity_weights = {
            'specific_instructions': 0.25,
            'actionable_request': 0.25,
            'constraints_defined': 0.25,
            'clear_format': 0.25
        }
        
        # Quality-specific weights (different from clarity)
        self.quality_weights = {
            'length_appropriate': 0.20,
            'structure_clear': 0.25,
            'specificity_improvement': 0.30,
            'formatting_good': 0.25
        }
        
        # Usage-specific weights
        self.usage_weights = {
            'usage_frequency': 0.30,
            'user_feedback': 0.25,
            'time_saved': 0.25,
            'success_rate': 0.20
        }
    
    def _compile_patterns(self) -> None:
        """Pre-compile regex patterns for better performance"""
        
        # Clarity patterns (specific instructions, actionable requests, constraints, format)
        self.clarity_patterns = {
            'specific_instructions': [
                re.compile(r'please\s+provide', re.IGNORECASE),
                re.compile(r'include\s+.*\s+in\s+your\s+response', re.IGNORECASE),
                re.compile(r'focus\s+on', re.IGNORECASE),
                re.compile(r'emphasize', re.IGNORECASE),
                re.compile(r'highlight', re.IGNORECASE),
                re.compile(r'explain\s+.*\s+in\s+detail', re.IGNORECASE),
                re.compile(r'provide\s+examples', re.IGNORECASE),
                re.compile(r'step\s+by\s+step', re.IGNORECASE),
                re.compile(r'break\s+down', re.IGNORECASE)
            ],
            'actionable_request': [
                re.compile(r'create', re.IGNORECASE),
                re.compile(r'generate', re.IGNORECASE),
                re.compile(r'write', re.IGNORECASE),
                re.compile(r'analyze', re.IGNORECASE),
                re.compile(r'review', re.IGNORECASE),
                re.compile(r'compare', re.IGNORECASE),
                re.compile(r'explain', re.IGNORECASE),
                re.compile(r'describe', re.IGNORECASE),
                re.compile(r'list', re.IGNORECASE),
                re.compile(r'outline', re.IGNORECASE)
            ],
            'constraints_defined': [
                re.compile(r'limit\s+to', re.IGNORECASE),
                re.compile(r'maximum\s+.*\s+words', re.IGNORECASE),
                re.compile(r'minimum\s+.*\s+words', re.IGNORECASE),
                re.compile(r'within\s+.*\s+constraints', re.IGNORECASE),
                re.compile(r'following\s+.*\s+guidelines', re.IGNORECASE),
                re.compile(r'according\s+to\s+.*\s+standards', re.IGNORECASE)
            ],
            'clear_format': [
                re.compile(r'format\s+as', re.IGNORECASE),
                re.compile(r'structure\s+.*\s+as', re.IGNORECASE),
                re.compile(r'organize\s+.*\s+into', re.IGNORECASE),
                re.compile(r'present\s+.*\s+in\s+.*\s+format', re.IGNORECASE),
                re.compile(r'use\s+.*\s+format', re.IGNORECASE)
            ]
        }
        
        # Quality patterns (structure, formatting - different from clarity)
        self.quality_patterns = {
            'structure_clear': [
                re.compile(r'\n\n'),  # Paragraph breaks
                re.compile(r'[1-9]\.'),  # Numbered lists
                re.compile(r'[-*•]'),  # Bullet points
                re.compile(r'first|second|third|finally', re.IGNORECASE),  # Sequential indicators
                re.compile(r'however|moreover|additionally', re.IGNORECASE),  # Transition words
            ],
            'formatting_good': [
                re.compile(r'[A-Z][a-z]+:'),  # Proper capitalization
                re.compile(r'\n'),  # Line breaks
                re.compile(r'[.!?]'),  # Proper punctuation
                re.compile(r'["\']'),  # Quotes
                re.compile(r'\([^)]+\)'),  # Parentheses
            ]
        }
    
    def calculate_overall_effectiveness(self, 
                                      original_text: str,
                                      enhanced_text: str,
                                      metrics: Optional[EffectivenessMetrics] = None) -> float:
        """
        Calculate overall effectiveness score (0.0 to 1.0)
        
        Args:
            original_text: Original prompt text
            enhanced_text: Enhanced prompt text
            metrics: Dictionary with usage metrics (usage_count, user_feedback, time_saved, success_rate)
        
        Returns:
            float: Effectiveness score between 0.0 and 1.0
        """
        
        if metrics is None:
            metrics = {'usage_count': 0, 'user_feedback': 0.0, 'time_saved': 0, 'success_rate': 0.0}
        
        # Calculate individual component scores
        clarity_score = self._calculate_clarity_score(enhanced_text)
        quality_score = self._calculate_quality_score(original_text, enhanced_text)
        usage_score = self._calculate_usage_score(metrics)
        
        # Weighted combination
        overall_score = (
            clarity_score * self.component_weights['clarity'] +
            quality_score * self.component_weights['quality'] +
            usage_score * self.component_weights['usage']
        )
        
        # Ensure score is between 0.0 and 1.0
        return max(0.0, min(1.0, overall_score))
    
    def _calculate_clarity_score(self, text: str) -> float:
        """
        Calculate clarity score based on prompt characteristics
        
        Args:
            text: The prompt text to analyze
            
        Returns:
            float: Clarity score between 0.0 and 1.0
        """
        if not text:
            return 0.0
        
        score = 0.0
        
        # Check each clarity category
        for category, patterns in self.clarity_patterns.items():
            matches = sum(1 for pattern in patterns if pattern.search(text))
            max_expected = 3 if category == 'specific_instructions' else 2
            category_score = min(1.0, matches / max_expected)
            score += category_score * self.clarity_weights[category]
        
        return score
    
    def _calculate_quality_score(self, original_text: str, enhanced_text: str) -> float:
        """
        Calculate quality improvement score
        
        Args:
            original_text: Original prompt text
            enhanced_text: Enhanced prompt text
            
        Returns:
            float: Quality score between 0.0 and 1.0
        """
        if not original_text or not enhanced_text:
            return 0.0
        
        score = 0.0
        
        # Length appropriateness (normalized)
        enhanced_length = len(enhanced_text.split())
        if self.config.optimal_word_range[0] <= enhanced_length <= self.config.optimal_word_range[1]:
            score += self.quality_weights['length_appropriate']
        elif self.config.min_word_count <= enhanced_length <= self.config.max_word_count:
            score += self.quality_weights['length_appropriate'] * 0.7
        
        # Structure clarity (different from clarity patterns)
        structure_matches = sum(1 for pattern in self.quality_patterns['structure_clear'] 
                               if pattern.search(enhanced_text))
        score += min(1.0, structure_matches / 3) * self.quality_weights['structure_clear']
        
        # Specificity improvement (normalized)
        original_specific_words = len(re.findall(r'\b\w{6,}\b', original_text))
        enhanced_specific_words = len(re.findall(r'\b\w{6,}\b', enhanced_text))
        specificity_improvement = min(1.0, (enhanced_specific_words - original_specific_words) / 10)
        score += specificity_improvement * self.quality_weights['specificity_improvement']
        
        # Formatting quality (different from clarity patterns)
        format_matches = sum(1 for pattern in self.quality_patterns['formatting_good'] 
                            if pattern.search(enhanced_text))
        score += min(1.0, format_matches / 5) * self.quality_weights['formatting_good']
        
        return score
    
    def _calculate_usage_score(self, metrics: EffectivenessMetrics) -> float:
        """
        Calculate usage-based effectiveness score with normalization
        
        Args:
            metrics: Dictionary with usage metrics
            
        Returns:
            float: Usage score between 0.0 and 1.0
        """
        
        score = 0.0
        
        # Usage frequency (normalized logarithmic scale)
        usage_count = metrics.get('usage_count', 0)
        if usage_count > 0:
            # Normalize to config max_usage_count
            usage_score = min(1.0, math.log(usage_count + 1) / math.log(self.config.max_usage_count + 1))
            score += usage_score * self.usage_weights['usage_frequency']
        
        # User feedback (already normalized 0-1)
        user_feedback = metrics.get('user_feedback', 0.0)
        score += user_feedback * self.usage_weights['user_feedback']
        
        # Time saved (normalized to config max_time_saved_seconds)
        time_saved = metrics.get('time_saved', 0)
        time_score = min(1.0, time_saved / self.config.max_time_saved_seconds)
        score += time_score * self.usage_weights['time_saved']
        
        # Success rate (already normalized 0-1)
        success_rate = metrics.get('success_rate', 0.0)
        score += success_rate * self.usage_weights['success_rate']
        
        return score
    
    def get_effectiveness_breakdown(self, 
                                  original_text: str,
                                  enhanced_text: str,
                                  metrics: Optional[EffectivenessMetrics] = None) -> ScoreBreakdown:
        """
        Get detailed breakdown of effectiveness components
        
        Args:
            original_text: Original prompt text
            enhanced_text: Enhanced prompt text
            metrics: Dictionary with usage metrics
            
        Returns:
            Dict[str, float]: Detailed breakdown of all scores and weights
        """
        
        if metrics is None:
            metrics = {'usage_count': 0, 'user_feedback': 0.0, 'time_saved': 0, 'success_rate': 0.0}
        
        clarity_score = self._calculate_clarity_score(enhanced_text)
        quality_score = self._calculate_quality_score(original_text, enhanced_text)
        usage_score = self._calculate_usage_score(metrics)
        overall_score = self.calculate_overall_effectiveness(original_text, enhanced_text, metrics)
        
        return {
            'overall_score': overall_score,
            'clarity_score': clarity_score,
            'quality_score': quality_score,
            'usage_score': usage_score,
            'clarity_weight': self.component_weights['clarity'],
            'quality_weight': self.component_weights['quality'],
            'usage_weight': self.component_weights['usage']
        }
    
    def get_improvement_suggestions(self, text: str) -> SuggestionList:
        """
        Get suggestions for improving prompt effectiveness
        
        Args:
            text: The prompt text to analyze
            
        Returns:
            List[str]: List of improvement suggestions
        """
        return self.suggestion_engine.get_suggestions(text)
    
    def update_normalization_config(self, new_config: NormalizationConfig) -> None:
        """
        Update normalization configuration dynamically
        
        Args:
            new_config: New normalization configuration
        """
        self.config = new_config


# Global calculator instance with default configuration
effectiveness_calculator = EffectivenessCalculator() 