"""
Advanced Prompt Engineering Techniques System
State-of-the-art implementation of 25+ prompt enhancement strategies
"""

import json
import random
import re
from datetime import datetime
from typing import Dict, List, Any, Optional

class PromptTechniques:
    """Production-ready prompt engineering techniques implementation"""
    
    TECHNIQUES = {
        'zero_shot_cot': {
            'name': 'Zero-Shot Chain-of-Thought',
            'description': 'Add step-by-step reasoning trigger',
            'category': 'reasoning',
            'default': True
        },
        'few_shot_cot': {
            'name': 'Few-Shot CoT',
            'description': 'Include reasoning examples',
            'category': 'reasoning', 
            'default': False
        },
        'self_consistency': {
            'name': 'Self-Consistency',
            'description': 'Multi-path reasoning verification',
            'category': 'accuracy',
            'default': False
        },
        'tree_of_thought': {
            'name': 'Tree-of-Thought',
            'description': 'Branch multiple reasoning paths',
            'category': 'planning',
            'default': False
        },
        'reflection': {
            'name': 'Reflection/ReAct',
            'description': 'Thought-Action-Observation loops',
            'category': 'reasoning',
            'default': False
        },
        'program_aided': {
            'name': 'Program-Aided Reasoning',
            'description': 'Code generation and execution',
            'category': 'computation',
            'default': False
        },
        'chain_verification': {
            'name': 'Chain-of-Verification',
            'description': 'Self-critique and repair',
            'category': 'accuracy',
            'default': False
        },
        'compression': {
            'name': 'Prompt Compression',
            'description': 'Minimize tokens while preserving meaning',
            'category': 'efficiency',
            'default': True
        },
        'role_prompting': {
            'name': 'Role Prompting', 
            'description': 'Expert persona assignment',
            'category': 'style',
            'default': True
        },
        'clockwork': {
            'name': 'Clockwork Prompting',
            'description': 'Timestamp-aware responses',
            'category': 'temporal',
            'default': False
        },
        'xml_schema': {
            'name': 'XML/JSON Schema Guardrails',
            'description': 'Structured output formatting',
            'category': 'structure',
            'default': True
        },
        'rubric_critique': {
            'name': 'Rubric-based Critique',
            'description': 'Self-evaluation and improvement',
            'category': 'quality',
            'default': False
        },
        'contrastive': {
            'name': 'Contrastive Prompting',
            'description': 'Good vs bad example guidance',
            'category': 'style',
            'default': False
        },
        'negative_prompts': {
            'name': 'Negative/Anti-prompts',
            'description': 'Explicit behavior constraints',
            'category': 'safety',
            'default': True
        },
        'dynamic_memory': {
            'name': 'Dynamic Memory',
            'description': 'Context-aware information injection',
            'category': 'context',
            'default': False
        },
        'rag_augmented': {
            'name': 'RAG-Augmented Prompts',
            'description': 'Source-cited factual enhancement',
            'category': 'factuality',
            'default': False
        },
        'multimodal_cot': {
            'name': 'Multimodal CoT',
            'description': 'Cross-modal reasoning',
            'category': 'multimodal',
            'default': False
        },
        'custom_instructions': {
            'name': 'Parameter-Efficient Instructions',
            'description': 'Learned prefix optimization',
            'category': 'efficiency',
            'default': False
        },
        'triple_prime': {
            'name': 'System/Developer/User Roles',
            'description': 'Hierarchical role separation',
            'category': 'structure',
            'default': True
        },
        'temperature_scheduling': {
            'name': 'Temperature Scheduling',
            'description': 'Dynamic creativity control',
            'category': 'generation',
            'default': False
        },
        'iterative_decomposition': {
            'name': 'Iterative Decomposition',
            'description': 'Atomic sub-task breakdown',
            'category': 'planning',
            'default': False
        },
        'speculative_decoding': {
            'name': 'Speculative Decoding',
            'description': 'Draft and verify approach',
            'category': 'efficiency',
            'default': False
        },
        'voice_anchor': {
            'name': 'Voice Anchor Style Transfer',
            'description': 'Persona-consistent responses',
            'category': 'style',
            'default': False
        },
        'ethical_constraints': {
            'name': 'Ethical Constraint Plugins',
            'description': 'Policy-compliant output filtering',
            'category': 'safety',
            'default': True
        },
        'meta_prompts': {
            'name': 'Meta-Prompts',
            'description': 'Recursive prompt improvement',
            'category': 'meta',
            'default': False
        }
    }
    
    PRESETS = {
        'lite': ['zero_shot_cot', 'role_prompting', 'xml_schema', 'negative_prompts'],
        'reasoning': ['zero_shot_cot', 'few_shot_cot', 'self_consistency', 'reflection', 'chain_verification'],
        'data_centric': ['rag_augmented', 'dynamic_memory', 'chain_verification', 'xml_schema'],
        'creative': ['role_prompting', 'voice_anchor', 'contrastive', 'temperature_scheduling'],
        'production': ['xml_schema', 'negative_prompts', 'ethical_constraints', 'compression', 'triple_prime'],
        'research': ['tree_of_thought', 'program_aided', 'iterative_decomposition', 'multimodal_cot']
    }

    @classmethod
    def get_default_techniques(cls) -> List[str]:
        """Get default enabled techniques"""
        return [k for k, v in cls.TECHNIQUES.items() if v['default']]
    
    @classmethod
    def apply_techniques(cls, original_prompt: str, enabled_techniques: List[str], method: str = 'llm') -> str:
        """Apply selected techniques to enhance prompt"""
        
        if method == 'compression':
            return cls._apply_compression_techniques(original_prompt, enabled_techniques)
        
        enhanced = original_prompt
        context_blocks = []
        instruction_blocks = []
        constraint_blocks = []
        
        # Structure techniques
        if 'xml_schema' in enabled_techniques:
            enhanced = cls._wrap_xml_schema(enhanced)
            
        if 'triple_prime' in enabled_techniques:
            context_blocks.append(cls._add_triple_prime())
            
        # Reasoning techniques
        if 'zero_shot_cot' in enabled_techniques:
            instruction_blocks.append(cls._add_zero_shot_cot())
            
        if 'few_shot_cot' in enabled_techniques:
            context_blocks.append(cls._add_few_shot_examples())
            
        if 'self_consistency' in enabled_techniques:
            instruction_blocks.append(cls._add_self_consistency())
            
        if 'tree_of_thought' in enabled_techniques:
            instruction_blocks.append(cls._add_tree_of_thought())
            
        if 'reflection' in enabled_techniques:
            instruction_blocks.append(cls._add_reflection_loops())
            
        if 'chain_verification' in enabled_techniques:
            instruction_blocks.append(cls._add_chain_verification())
            
        # Role and style techniques
        if 'role_prompting' in enabled_techniques:
            context_blocks.append(cls._add_role_prompting(enhanced))
            
        if 'voice_anchor' in enabled_techniques:
            context_blocks.append(cls._add_voice_anchor())
            
        if 'contrastive' in enabled_techniques:
            context_blocks.append(cls._add_contrastive_examples())
            
        # Safety and constraint techniques
        if 'negative_prompts' in enabled_techniques:
            constraint_blocks.append(cls._add_negative_constraints())
            
        if 'ethical_constraints' in enabled_techniques:
            constraint_blocks.append(cls._add_ethical_constraints())
            
        # Planning techniques
        if 'iterative_decomposition' in enabled_techniques:
            instruction_blocks.append(cls._add_iterative_decomposition())
            
        if 'program_aided' in enabled_techniques:
            instruction_blocks.append(cls._add_program_aided_reasoning())
            
        # Quality techniques
        if 'rubric_critique' in enabled_techniques:
            instruction_blocks.append(cls._add_rubric_critique())
            
        # Temporal techniques
        if 'clockwork' in enabled_techniques:
            context_blocks.append(cls._add_clockwork_context())
            
        # Meta techniques
        if 'meta_prompts' in enabled_techniques:
            instruction_blocks.append(cls._add_meta_prompt_improvement())
        
        # Assemble final prompt
        final_prompt = cls._assemble_enhanced_prompt(
            enhanced, context_blocks, instruction_blocks, constraint_blocks
        )
        
        return final_prompt
    
    @classmethod
    def _apply_compression_techniques(cls, prompt: str, enabled_techniques: List[str]) -> str:
        """Apply compression-focused techniques"""
        compressed = prompt
        
        if 'compression' in enabled_techniques:
            # Advanced compression patterns
            patterns = [
                (r'\bplease\s+', ''),
                (r'\bcould\s+you\s+', ''),
                (r'\bi\s+would\s+like\s+you\s+to\s+', ''),
                (r'\bmake\s+sure\s+that\s+', 'ensure '),
                (r'\bin\s+order\s+to\s+', 'to '),
                (r'\bas\s+well\s+as\s+', 'and '),
                (r'\bit\s+is\s+important\s+that\s+', ''),
                (r'\bcan\s+you\s+help\s+me\s+', 'help '),
                (r'\bi\s+need\s+assistance\s+with\s+', 'assist with '),
                (r'\bcreate\s+a\s+detailed\s+', 'create detailed '),
                (r'\bprovide\s+me\s+with\s+', 'provide '),
            ]
            
            for pattern, replacement in patterns:
                compressed = re.sub(pattern, replacement, compressed, flags=re.IGNORECASE)
        
        # Remove redundant whitespace
        compressed = ' '.join(compressed.split())
        
        return compressed
    
    @classmethod
    def _wrap_xml_schema(cls, prompt: str) -> str:
        return f"""<task>
{prompt}
</task>"""
    
    @classmethod
    def _add_triple_prime(cls) -> str:
        return """<system_role>You are an expert AI assistant with comprehensive knowledge and analytical capabilities.</system_role>

<developer_instructions>
- Provide thorough, accurate, and well-structured responses
- Use clear reasoning and evidence-based conclusions
- Maintain professional tone while being accessible
</developer_instructions>"""
    
    @classmethod
    def _add_zero_shot_cot(cls) -> str:
        return """<reasoning_approach>
Think through this step-by-step. Break down the problem, analyze each component, and build toward a comprehensive solution.
</reasoning_approach>"""
    
    @classmethod
    def _add_few_shot_examples(cls) -> str:
        return """<examples>
Example approach:
1. Analyze the core request
2. Identify key components and relationships
3. Apply domain expertise
4. Synthesize comprehensive response
5. Validate against requirements
</examples>"""
    
    @classmethod
    def _add_self_consistency(cls) -> str:
        return """<verification_process>
After providing your initial response, review it from multiple perspectives to ensure consistency and accuracy. Consider alternative approaches and validate your conclusions.
</verification_process>"""
    
    @classmethod
    def _add_tree_of_thought(cls) -> str:
        return """<reasoning_strategy>
Explore multiple solution paths:
1. Branch A: [Direct approach]
2. Branch B: [Alternative methodology] 
3. Branch C: [Creative solution]
Evaluate each branch and select the most effective approach.
</reasoning_strategy>"""
    
    @classmethod
    def _add_reflection_loops(cls) -> str:
        return """<reflection_process>
For each major step:
- THOUGHT: What am I trying to accomplish?
- ACTION: What specific steps will I take?
- OBSERVATION: What are the results and implications?
- REFINEMENT: How can I improve or adjust?
</reflection_process>"""
    
    @classmethod
    def _add_chain_verification(cls) -> str:
        return """<verification_chain>
After completing your response:
1. Review each major claim for accuracy
2. Check logical consistency throughout
3. Identify any gaps or weaknesses
4. Provide corrections or clarifications if needed
</verification_chain>"""
    
    @classmethod
    def _add_role_prompting(cls, prompt: str) -> str:
        # Intelligent role detection based on prompt content
        roles = {
            'data': 'Chief Data Scientist with 15+ years in analytics and machine learning',
            'code': 'Senior Software Architect specializing in scalable systems',
            'business': 'Strategy Consultant with deep industry expertise',
            'creative': 'Creative Director with expertise in innovative problem-solving',
            'research': 'Research Scientist with extensive academic and industry experience',
            'technical': 'Technical Expert with comprehensive domain knowledge'
        }
        
        # Simple keyword-based role selection
        prompt_lower = prompt.lower()
        if any(word in prompt_lower for word in ['data', 'analytics', 'statistics']):
            role = roles['data']
        elif any(word in prompt_lower for word in ['code', 'programming', 'software']):
            role = roles['code'] 
        elif any(word in prompt_lower for word in ['business', 'strategy', 'market']):
            role = roles['business']
        elif any(word in prompt_lower for word in ['creative', 'design', 'innovation']):
            role = roles['creative']
        elif any(word in prompt_lower for word in ['research', 'study', 'analysis']):
            role = roles['research']
        else:
            role = roles['technical']
            
        return f"""<role_assignment>
You are a {role}. Respond with the depth, perspective, and expertise expected from this role.
</role_assignment>"""
    
    @classmethod
    def _add_voice_anchor(cls) -> str:
        return """<voice_style>
Maintain a confident, analytical tone throughout. Be precise in language, thorough in explanation, and actionable in recommendations.
</voice_style>"""
    
    @classmethod
    def _add_contrastive_examples(cls) -> str:
        return """<quality_contrast>
GOOD RESPONSE CHARACTERISTICS:
- Comprehensive and well-structured
- Evidence-based and specific
- Actionable and practical
- Clear and accessible

AVOID:
- Vague generalizations
- Unsupported claims
- Overly complex jargon
- Incomplete solutions
</quality_contrast>"""
    
    @classmethod
    def _add_negative_constraints(cls) -> str:
        return """<constraints>
- Never provide incomplete or partial responses
- Avoid speculation without clearly marking it as such
- Don't ignore any part of the request
- Never compromise on accuracy for brevity
</constraints>"""
    
    @classmethod
    def _add_ethical_constraints(cls) -> str:
        return """<ethical_guidelines>
Ensure all recommendations and advice:
- Respect privacy and data protection principles
- Consider potential unintended consequences
- Promote beneficial and responsible practices
- Align with professional and ethical standards
</ethical_guidelines>"""
    
    @classmethod
    def _add_iterative_decomposition(cls) -> str:
        return """<decomposition_strategy>
Break complex requests into atomic components:
1. Identify core sub-tasks
2. Solve each component systematically
3. Integrate solutions coherently
4. Validate the complete solution
</decomposition_strategy>"""
    
    @classmethod
    def _add_program_aided_reasoning(cls) -> str:
        return """<computational_approach>
When applicable, use structured reasoning:
- Define variables and parameters clearly
- Apply logical operations step-by-step
- Show computational work when relevant
- Validate results through verification
</computational_approach>"""
    
    @classmethod
    def _add_rubric_critique(cls) -> str:
        return """<quality_rubric>
Evaluate your response on these criteria (1-10 scale):
- Completeness: Addresses all aspects of the request
- Accuracy: Information is correct and well-supported
- Clarity: Communication is clear and accessible
- Actionability: Provides practical, implementable guidance
Aim for 9+ on all criteria.
</quality_rubric>"""
    
    @classmethod
    def _add_clockwork_context(cls) -> str:
        now = datetime.now()
        return f"""<temporal_context>
Current context: {now.strftime('%Y-%m-%d %H:%M UTC')}
Consider temporal relevance and provide current, up-to-date information when applicable.
</temporal_context>"""
    
    @classmethod
    def _add_meta_prompt_improvement(cls) -> str:
        return """<meta_optimization>
Before responding, consider: Is there a more effective way to approach this request? Could the original question be refined for better results? Apply any improvements to your response strategy.
</meta_optimization>"""
    
    @classmethod
    def _assemble_enhanced_prompt(cls, original: str, context_blocks: List[str], 
                                 instruction_blocks: List[str], constraint_blocks: List[str]) -> str:
        """Assemble all enhancement components into final prompt"""
        
        sections = []
        
        # Add context sections
        if context_blocks:
            sections.extend(context_blocks)
        
        # Add the core task
        sections.append(original)
        
        # Add instruction sections
        if instruction_blocks:
            sections.extend(instruction_blocks)
        
        # Add constraint sections
        if constraint_blocks:
            sections.extend(constraint_blocks)
        
        # Add final output formatting
        sections.append("""<output_requirements>
Provide a comprehensive, well-structured response that fully addresses the request with expertise and clarity.
</output_requirements>""")
        
        return '\n\n'.join(sections)
    
    @classmethod
    def get_technique_info(cls) -> Dict[str, Any]:
        """Get complete technique metadata for frontend"""
        return {
            'techniques': cls.TECHNIQUES,
            'presets': cls.PRESETS,
            'categories': list(set(t['category'] for t in cls.TECHNIQUES.values()))
        } 