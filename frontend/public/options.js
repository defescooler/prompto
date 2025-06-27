// Prompto Options Page - Advanced Technique Configuration
// Production-ready prompt engineering configuration interface

console.log('🚀 Prompto: Options page loaded');

// Advanced prompt engineering techniques catalog
const TECHNIQUES_CATALOG = {
    zero_shot_cot: {
        name: 'Zero-Shot Chain-of-Thought',
        description: 'Add step-by-step reasoning trigger to force the model to externalize reasoning',
        category: 'reasoning',
        default: true,
        icon: '🧠'
    },
    few_shot_cot: {
        name: 'Few-Shot CoT',
        description: 'Include reasoning examples to steer both format and depth of the chain',
        category: 'reasoning',
        default: false,
        icon: '🔗'
    },
    step_back_prompting: {
        name: 'Step-Back Prompting',
        description: 'Ask for high-level concepts before specific details',
        category: 'reasoning',
        default: false,
        icon: '⬅️'
    },
    self_consistency: {
        name: 'Self-Consistency',
        description: 'Generate multiple reasoning paths and select the most consistent answer',
        category: 'accuracy',
        default: false,
        icon: '🎯'
    },
    tree_of_thoughts: {
        name: 'Tree of Thoughts',
        description: 'Explore multiple reasoning branches systematically',
        category: 'reasoning',
        default: false,
        icon: '🌳'
    },
    plan_and_solve: {
        name: 'Plan-and-Solve',
        description: 'First make a plan, then execute each step systematically',
        category: 'planning',
        default: false,
        icon: '📋'
    },
    least_to_most: {
        name: 'Least-to-Most',
        description: 'Break complex problems into simpler sub-problems',
        category: 'planning',
        default: false,
        icon: '🧩'
    },
    generated_knowledge: {
        name: 'Generated Knowledge',
        description: 'Generate relevant background knowledge before answering',
        category: 'accuracy',
        default: false,
        icon: '📚'
    },
    retrieval_augmented: {
        name: 'Retrieval-Augmented',
        description: 'Incorporate external knowledge sources',
        category: 'accuracy',
        default: false,
        icon: '🔍'
    },
    program_aided: {
        name: 'Program-Aided Language',
        description: 'Use code generation for computational problems',
        category: 'computation',
        default: false,
        icon: '💻'
    },
    active_prompting: {
        name: 'Active Prompting',
        description: 'Iteratively identify and focus on uncertain examples',
        category: 'efficiency',
        default: false,
        icon: '🎯'
    },
    directional_stimulus: {
        name: 'Directional Stimulus',
        description: 'Use keywords to guide model behavior in desired direction',
        category: 'style',
        default: false,
        icon: '🧭'
    },
    multimodal_cot: {
        name: 'Multimodal CoT',
        description: 'Apply chain-of-thought to vision-language tasks',
        category: 'multimodal',
        default: false,
        icon: '👁️'
    },
    temporal_prompting: {
        name: 'Temporal Prompting',
        description: 'Structure prompts with explicit time relationships',
        category: 'temporal',
        default: false,
        icon: '⏰'
    },
    meta_prompting: {
        name: 'Meta-Prompting',
        description: 'Use the model to improve its own prompts',
        category: 'meta',
        default: false,
        icon: '🔄'
    },
    constitutional_ai: {
        name: 'Constitutional AI',
        description: 'Apply constitutional principles for safer responses',
        category: 'safety',
        default: false,
        icon: '⚖️'
    },
    role_prompting: {
        name: 'Role Prompting',
        description: 'Assign specific roles or personas to the model',
        category: 'style',
        default: true,
        icon: '🎭'
    },
    emotional_prompting: {
        name: 'Emotional Prompting',
        description: 'Use emotional cues to improve model performance',
        category: 'style',
        default: false,
        icon: '❤️'
    },
    contrastive_prompting: {
        name: 'Contrastive Prompting',
        description: 'Show what TO do vs what NOT to do',
        category: 'structure',
        default: false,
        icon: '⚡'
    },
    uncertainty_quantification: {
        name: 'Uncertainty Quantification',
        description: 'Ask model to express confidence levels',
        category: 'quality',
        default: false,
        icon: '🎲'
    },
    perspective_taking: {
        name: 'Perspective Taking',
        description: 'Consider multiple viewpoints before concluding',
        category: 'reasoning',
        default: false,
        icon: '👥'
    },
    analogical_reasoning: {
        name: 'Analogical Reasoning',
        description: 'Use analogies to explain complex concepts',
        category: 'reasoning',
        default: false,
        icon: '🔗'
    },
    context_stuffing: {
        name: 'Context Stuffing',
        description: 'Pack maximum relevant context into prompt',
        category: 'context',
        default: false,
        icon: '📦'
    },
    factual_grounding: {
        name: 'Factual Grounding',
        description: 'Anchor responses in verifiable facts',
        category: 'factuality',
        default: false,
        icon: '🏗️'
    },
    output_formatting: {
        name: 'Output Formatting',
        description: 'Specify exact output format and structure',
        category: 'structure',
        default: true,
        icon: '📄'
    }
};

// Preset configurations
const PRESETS = {
    lite: ['zero_shot_cot', 'role_prompting', 'output_formatting'],
    reasoning: ['zero_shot_cot', 'few_shot_cot', 'tree_of_thoughts', 'step_back_prompting', 'perspective_taking'],
    creative: ['role_prompting', 'emotional_prompting', 'analogical_reasoning', 'directional_stimulus'],
    production: ['zero_shot_cot', 'self_consistency', 'generated_knowledge', 'output_formatting', 'uncertainty_quantification'],
    research: ['generated_knowledge', 'retrieval_augmented', 'factual_grounding', 'meta_prompting', 'uncertainty_quantification'],
    data_centric: ['program_aided', 'retrieval_augmented', 'context_stuffing', 'factual_grounding']
};

// Category colors for badges
const CATEGORY_COLORS = {
    reasoning: '#6366f1',
    accuracy: '#10b981', 
    planning: '#8b5cf6',
    computation: '#3b82f6',
    efficiency: '#f59e0b',
    style: '#ec4899',
    temporal: '#f97316',
    structure: '#06b6d4',
    quality: '#10b981',
    safety: '#ef4444',
    context: '#8b5cf6',
    factuality: '#14b8a6',
    multimodal: '#f43f5e',
    generation: '#f59e0b',
    meta: '#64748b'
};

// State management
let currentTechniques = new Set();
let activePresets = new Set();

// Initialize the options page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔧 Initializing Prompto options...');
    
    await loadUserSettings();
    renderTechniques();
    setupEventListeners();
    updateStats();
    
    console.log('✅ Options page ready');
});

// Load user settings from storage
async function loadUserSettings() {
    try {
        const result = await chrome.storage.sync.get(['enabledTechniques', 'activePresets']);
        
        // Load enabled techniques
        if (result.enabledTechniques) {
            currentTechniques = new Set(result.enabledTechniques);
        } else {
            // Default enabled techniques
            currentTechniques = new Set(
                Object.entries(TECHNIQUES_CATALOG)
                    .filter(([_, config]) => config.default)
                    .map(([key, _]) => key)
            );
        }
        
        // Load active presets
        if (result.activePresets) {
            activePresets = new Set(result.activePresets);
        }
        
        console.log('📚 Loaded settings:', { 
            techniques: currentTechniques.size, 
            presets: activePresets.size 
        });
        
    } catch (error) {
        console.error('❌ Failed to load settings:', error);
        // Use defaults
        currentTechniques = new Set(
            Object.entries(TECHNIQUES_CATALOG)
                .filter(([_, config]) => config.default)
                .map(([key, _]) => key)
        );
    }
}

// Render all techniques in the grid
function renderTechniques() {
    const grid = document.getElementById('techniquesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    // Group techniques by category for better organization
    const categories = {};
    Object.entries(TECHNIQUES_CATALOG).forEach(([key, config]) => {
        if (!categories[config.category]) {
            categories[config.category] = [];
        }
        categories[config.category].push([key, config]);
    });
    
    // Render techniques by category
    Object.entries(categories).forEach(([category, techniques]) => {
        techniques.forEach(([key, config]) => {
            const card = createTechniqueCard(key, config);
            grid.appendChild(card);
        });
    });
    
    console.log('🎨 Rendered', Object.keys(TECHNIQUES_CATALOG).length, 'technique cards');
}

// Create a technique card element
function createTechniqueCard(key, config) {
    const isEnabled = currentTechniques.has(key);
    
    const card = document.createElement('div');
    card.className = 'glass-card technique-card';
    card.innerHTML = `
        <div class="technique-header">
            <div class="technique-info">
                <div class="technique-name">${config.icon} ${config.name}</div>
                <div class="technique-description">${config.description}</div>
                <div class="technique-category category-${config.category}">
                    ${config.category}
                </div>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" class="toggle-input" ${isEnabled ? 'checked' : ''} 
                       data-technique="${key}">
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
    
    return card;
}

// Setup all event listeners
function setupEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.addEventListener('click', handlePresetClick);
    });
    
    // Technique toggles (using event delegation)
    document.getElementById('techniquesGrid').addEventListener('change', handleTechniqueToggle);
    
    // Save button
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveConfiguration);
    }
    
    // Update preset visual states
    updatePresetStates();
    
    console.log('🎛️ Event listeners attached');
}

// Handle preset button clicks
function handlePresetClick(event) {
    const preset = event.target.dataset.preset;
    if (!preset || !PRESETS[preset]) return;
    
    const isActive = activePresets.has(preset);
    
    if (isActive) {
        // Deactivate preset - remove its techniques
        activePresets.delete(preset);
        PRESETS[preset].forEach(tech => currentTechniques.delete(tech));
    } else {
        // Activate preset - add its techniques
        activePresets.add(preset);
        PRESETS[preset].forEach(tech => currentTechniques.add(tech));
    }
    
    // Update UI
    updatePresetStates();
    updateTechniqueToggles();
    updateStats();
    
    console.log('🔄 Preset toggled:', preset, isActive ? 'OFF' : 'ON');
}

// Handle individual technique toggles
function handleTechniqueToggle(event) {
    if (!event.target.matches('.toggle-input')) return;
    
    const technique = event.target.dataset.technique;
    const isEnabled = event.target.checked;
    
    if (isEnabled) {
        currentTechniques.add(technique);
    } else {
        currentTechniques.delete(technique);
    }
    
    // Clear presets that are no longer fully active
    updateActivePresets();
    updatePresetStates();
    updateStats();
    
    console.log('🔧 Technique toggled:', technique, isEnabled ? 'ON' : 'OFF');
}

// Update which presets are considered active based on current techniques
function updateActivePresets() {
    activePresets.clear();
    
    Object.entries(PRESETS).forEach(([presetName, techniques]) => {
        const allEnabled = techniques.every(tech => currentTechniques.has(tech));
        if (allEnabled) {
            activePresets.add(presetName);
        }
    });
}

// Update preset button visual states
function updatePresetStates() {
    document.querySelectorAll('.preset-chip').forEach(chip => {
        const preset = chip.dataset.preset;
        const isActive = activePresets.has(preset);
        
        chip.classList.toggle('active', isActive);
    });
}

// Update technique toggle states
function updateTechniqueToggles() {
    document.querySelectorAll('.toggle-input').forEach(toggle => {
        const technique = toggle.dataset.technique;
        toggle.checked = currentTechniques.has(technique);
    });
}

// Update statistics display
function updateStats() {
    const enabledCount = document.getElementById('enabledCount');
    const totalCount = document.getElementById('totalCount');
    const effectivenessScore = document.getElementById('effectivenessScore');
    
    if (enabledCount) {
        enabledCount.textContent = currentTechniques.size;
    }
    
    if (totalCount) {
        totalCount.textContent = Object.keys(TECHNIQUES_CATALOG).length;
    }
    
    if (effectivenessScore) {
        // Calculate effectiveness score based on enabled techniques
        const baseScore = 65;
        const techniqueBonus = Math.min(currentTechniques.size * 3, 35);
        const score = baseScore + techniqueBonus;
        effectivenessScore.textContent = score;
    }
}

// Save configuration to storage
async function saveConfiguration() {
    const saveBtn = document.getElementById('saveBtn');
    const saveStatus = document.getElementById('saveStatus');
    
    try {
        // Disable save button during save
        saveBtn.disabled = true;
        saveBtn.textContent = 'SAVING...';
        
        // Save to chrome storage
        await chrome.storage.sync.set({
            enabledTechniques: Array.from(currentTechniques),
            activePresets: Array.from(activePresets),
            lastUpdated: Date.now()
        });
        
        // Show success status
        showSaveStatus('success', 'Configuration saved successfully ✓');
        
        console.log('💾 Configuration saved:', {
            techniques: currentTechniques.size,
            presets: activePresets.size
        });
        
    } catch (error) {
        console.error('❌ Save failed:', error);
        showSaveStatus('error', 'Failed to save configuration');
    } finally {
        // Re-enable save button
        setTimeout(() => {
            saveBtn.disabled = false;
            saveBtn.textContent = 'SAVE CONFIGURATION';
        }, 1000);
    }
}

// Show save status message
function showSaveStatus(type, message) {
    const saveStatus = document.getElementById('saveStatus');
    if (!saveStatus) return;
    
    saveStatus.className = `save-status ${type}`;
    saveStatus.textContent = message;
    saveStatus.style.display = 'block';
    
    // Hide after 3 seconds
    setTimeout(() => {
        saveStatus.style.display = 'none';
    }, 3000);
}

// Utility: Get enabled techniques for other scripts
window.getEnabledTechniques = () => Array.from(currentTechniques);

// Export for debugging
if (typeof window !== 'undefined') {
    window.prompto = {
        techniques: TECHNIQUES_CATALOG,
        presets: PRESETS,
        getCurrentTechniques: () => Array.from(currentTechniques),
        getActivePresets: () => Array.from(activePresets)
    };
}

console.log('🚀 Prompto: Options script loaded successfully'); 