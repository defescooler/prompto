# Effectiveness Score Calculation Guide

## Overview

The effectiveness score is a comprehensive metric that evaluates the quality and performance of prompts in the Prompt Copilot system. It combines multiple factors to provide a holistic assessment of prompt effectiveness.

## Score Range

- **0.0 to 1.0**: Where 1.0 represents perfect effectiveness
- **0.0-0.3**: Poor effectiveness (needs significant improvement)
- **0.3-0.6**: Moderate effectiveness (some room for improvement)
- **0.6-0.8**: Good effectiveness (minor improvements possible)
- **0.8-1.0**: Excellent effectiveness (well-optimized)

## Component Breakdown

### 1. Clarity Score (40% of total)

Measures how clear, specific, and actionable the prompt is.

#### Sub-components:
- **Specific Instructions (25%)**: Presence of detailed, actionable instructions
  - Patterns: "please provide", "include...in your response", "focus on", "emphasize", "highlight"
  - Examples: "Please provide a detailed analysis", "Include specific examples"
  
- **Actionable Requests (25%)**: Clear action verbs that specify what to do
  - Patterns: "create", "generate", "write", "analyze", "review", "compare", "explain"
  - Examples: "Create a report", "Analyze the data", "Generate insights"
  
- **Constraints Defined (25%)**: Clear boundaries and limitations
  - Patterns: "limit to", "maximum...words", "within...constraints", "following...guidelines"
  - Examples: "Limit to 500 words", "Within budget constraints"
  
- **Clear Format (25%)**: Specification of desired output format
  - Patterns: "format as", "structure...as", "organize...into", "present...in...format"
  - Examples: "Format as a table", "Structure as bullet points"

### 2. Quality Score (35% of total)

Measures the improvement from original to enhanced prompt and overall quality.

#### Sub-components:
- **Length Appropriateness (20%)**: Optimal word count for the task
  - Optimal range: 20-200 words (configurable)
  - Acceptable range: 10-500 words (configurable)
  - Penalty for extremely short or long prompts
  
- **Structure Clarity (25%)**: Well-organized and structured content
  - Paragraph breaks (`\n\n`)
  - Numbered lists (`1.`, `2.`, etc.)
  - Bullet points (`-`, `*`, `•`)
  - Sequential indicators ("first", "second", "third", "finally")
  - Transition words ("however", "moreover", "additionally")
  
- **Specificity Improvement (30%)**: Enhancement of specific, detailed language
  - Counts words with 6+ characters (more specific vocabulary)
  - Measures improvement from original to enhanced text
  - Rewards more detailed and precise language
  
- **Formatting Quality (25%)**: Professional formatting and presentation
  - Proper capitalization (`Title:`, `Section:`)
  - Line breaks and paragraph structure
  - Proper punctuation (`.`, `!`, `?`)
  - Use of quotes and parentheses

### 3. Usage Score (25% of total)

Measures real-world performance and user satisfaction.

#### Sub-components:
- **Usage Frequency (30%)**: How often the prompt is used
  - Logarithmic scaling to prevent gaming
  - Normalized against maximum usage count (configurable, default: 100)
  - Formula: `min(1.0, log(usage_count + 1) / log(max_usage_count + 1))`
  
- **User Feedback (25%)**: User ratings and satisfaction
  - Direct user ratings (0.0 to 1.0)
  - Surveys, ratings, or feedback scores
  
- **Time Saved (25%)**: Efficiency improvement
  - Time saved in seconds compared to manual approach
  - Normalized against maximum time saved (configurable, default: 300 seconds)
  - Formula: `min(1.0, time_saved / max_time_saved_seconds)`
  
- **Success Rate (20%)**: How often the prompt achieves its goal
  - Percentage of successful outcomes
  - Based on user feedback or automated assessment

## Calculation Formula

```
Overall Score = (Clarity Score × 0.40) + (Quality Score × 0.35) + (Usage Score × 0.25)
```

## Configuration Options

The system uses a `NormalizationConfig` class to customize scoring parameters:

```python
@dataclass
class NormalizationConfig:
    max_time_saved_seconds: int = 300      # Maximum time saved for normalization
    max_usage_count: int = 100            # Maximum usage count for normalization
    max_word_count: int = 500             # Maximum words before penalty
    min_word_count: int = 10              # Minimum words before penalty
    optimal_word_range: Tuple[int, int] = (20, 200)  # Optimal word count range
```

## Example Calculations

### Example 1: Excellent Prompt
**Original**: "Write an email"
**Enhanced**: 
```
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
```

**Metrics**:
- Usage count: 12
- User feedback: 0.95
- Time saved: 240 seconds
- Success rate: 0.98

**Scores**:
- Clarity Score: 0.125 (good specific instructions and constraints)
- Quality Score: 0.833 (excellent structure and formatting)
- Usage Score: 0.800 (high usage and satisfaction)
- **Overall Score: 0.542**

### Example 2: Basic Prompt
**Original**: "Help me with code"
**Enhanced**: "Please help me review this Python code and provide feedback on best practices and potential improvements."

**Metrics**:
- Usage count: 1
- User feedback: 0.6
- Time saved: 60 seconds
- Success rate: 0.7

**Scores**:
- Clarity Score: 0.125 (basic actionable request)
- Quality Score: 0.430 (moderate improvement)
- Usage Score: 0.385 (low usage and feedback)
- **Overall Score: 0.297**

## Improvement Suggestions

The system provides actionable suggestions for improving prompts:

1. **Add polite language**: Include "please", "kindly", "could you"
2. **Include specific instructions**: Use "provide", "include", "focus on", "emphasize"
3. **Add context or background information**: Provide relevant context
4. **Specify desired format or structure**: Define output format
5. **Add more detail and specificity**: Expand on requirements
6. **Consider breaking into smaller prompts**: For very long prompts

## Performance Considerations

- **Pre-compiled regex patterns**: For faster text analysis
- **Configurable normalization**: Adapts to different use cases
- **Efficient scoring**: Optimized for high-volume processing
- **Memory efficient**: Minimal object creation during scoring

## Integration with API

The effectiveness calculator integrates with the Flask API through:

```python
from utils.effectiveness_calculator import effectiveness_calculator

# Calculate score for a prompt
metrics = {
    'usage_count': 5,
    'user_feedback': 0.9,
    'time_saved': 180,
    'success_rate': 0.95
}

score = effectiveness_calculator.calculate_overall_effectiveness(
    original_text="Write something",
    enhanced_text="Please create a comprehensive...",
    metrics=metrics
)

# Get detailed breakdown
breakdown = effectiveness_calculator.get_effectiveness_breakdown(
    original_text="Write something",
    enhanced_text="Please create a comprehensive...",
    metrics=metrics
)

# Get improvement suggestions
suggestions = effectiveness_calculator.get_improvement_suggestions(enhanced_text)
```

## Best Practices

1. **Be specific**: Use clear, actionable language
2. **Provide context**: Include relevant background information
3. **Define constraints**: Set clear boundaries and requirements
4. **Structure clearly**: Use formatting and organization
5. **Test and iterate**: Use feedback to improve prompts
6. **Monitor usage**: Track performance metrics over time

## Future Enhancements

The system is designed for extensibility:

- **Semantic analysis**: Integration with embedding-based similarity
- **LLM evaluation**: AI-powered prompt quality assessment
- **Custom metrics**: User-defined scoring criteria
- **A/B testing**: Comparative effectiveness analysis
- **Trend analysis**: Historical performance tracking 