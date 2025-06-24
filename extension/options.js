// Prompto Options Page - Advanced Technique Configuration
// State-of-the-art prompt engineering configuration interface

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
        icon: '📚'
    },
    self_consistency: {
        name: 'Self-Consistency',
        description: 'Multi-path reasoning verification to boost factual accuracy',
        category: 'accuracy',
        default: false,
        icon: '✅'
    },
    tree_of_thought: {
        name: 'Tree-of-Thought',
        description: 'Branch multiple reasoning paths and score each branch',
        category: 'planning',
        default: false,
        icon: '🌳'
    },
    reflection: {
        name: 'Reflection/ReAct',
        description: 'Interleave Thought-Action-Observation loops for better results',
        category: 'reasoning',
        default: false,
        icon: '🔄'
    },
    program_aided: {
        name: 'Program-Aided Reasoning',
        description: 'Let the model emit code and execute it for enhanced computation',
        category: 'computation',
        default: false,
        icon: '💻'
    },
    chain_verification: {
        name: 'Chain-of-Verification',
        description: 'Run a second pass that critiques and repairs reasoning steps',
        category: 'accuracy',
        default: false,
        icon: '🔍'
    },
    compression: {
        name: 'Prompt Compression',
        description: 'Minimize tokens while preserving meaning to reduce costs',
        category: 'efficiency',
        default: true,
        icon: '📦'
    },
    role_prompting: {
        name: 'Role Prompting', 
        description: 'Expert persona assignment to prime style and domain vocabulary',
        category: 'style',
        default: true,
        icon: '👨‍💼'
    },
    clockwork: {
        name: 'Clockwork Prompting',
        description: 'Embed timestamps so cached answers stay fresh',
        category: 'temporal',
        default: false,
        icon: '⏰'
    },
    xml_schema: {
        name: 'XML/JSON Schema Guardrails',
        description: 'Structured output formatting with explicit tags',
        category: 'structure',
        default: true,
        icon: '📋'
    },
    rubric_critique: {
        name: 'Rubric-based Critique',
        description: 'Self-evaluation and improvement against scoring criteria',
        category: 'quality',
        default: false,
        icon: '📊'
    },
    contrastive: {
        name: 'Contrastive Prompting',
        description: 'Good vs bad example guidance for sharper style transfer',
        category: 'style',
        default: false,
        icon: '⚖️'
    },
    negative_prompts: {
        name: 'Negative/Anti-prompts',
        description: 'Explicit behavior constraints to reduce jailbreak risks',
        category: 'safety',
        default: true,
        icon: '🚫'
    },
    dynamic_memory: {
        name: 'Dynamic Memory',
        description: 'Context-aware information injection using vector similarity',
        category: 'context',
        default: false,
        icon: '🧠'
    },
    rag_augmented: {
        name: 'RAG-Augmented Prompts',
        description: 'Source-cited factual enhancement with retrieved documents',
        category: 'factuality',
        default: false,
        icon: '📖'
    },
    multimodal_cot: {
        name: 'Multimodal CoT',
        description: 'Cross-modal reasoning mixing text, images, and code tokens',
        category: 'multimodal',
        default: false,
        icon: '🖼️'
    },
    custom_instructions: {
        name: 'Parameter-Efficient Instructions',
        description: 'Learned prefix optimization without touching base model weights',
        category: 'efficiency',
        default: false,
        icon: '⚙️'
    },
    triple_prime: {
        name: 'System/Developer/User Roles',
        description: 'Hierarchical role separation to enforce hierarchy',
        category: 'structure',
        default: true,
        icon: '👥'
    },
    temperature_scheduling: {
        name: 'Temperature Scheduling',
        description: 'Dynamic creativity control from ideation to polish',
        category: 'generation',
        default: false,
        icon: '🌡️'
    },
    iterative_decomposition: {
        name: 'Iterative Decomposition',
        description: 'Atomic sub-task breakdown with automatic scratchpad',
        category: 'planning',
        default: false,
        icon: '📋'
    },
    speculative_decoding: {
        name: 'Speculative Decoding',
        description: 'Draft and verify approach to halve latency invisibly',
        category: 'efficiency',
        default: false,
        icon: '⚡'
    },
    voice_anchor: {
        name: 'Voice Anchor Style Transfer',
        description: 'Persona-consistent responses using voice samples',
        category: 'style',
        default: false,
        icon: '🎤'
    },
    ethical_constraints: {
        name: 'Ethical Constraint Plugins',
        description: 'Policy-compliant output filtering via external policy engine',
        category: 'safety',
        default: true,
        icon: '🛡️'
    },
    meta_prompts: {
        name: 'Meta-Prompts',
        description: 'Recursive prompt improvement by enhancing the prompt itself',
        category: 'meta',
        default: false,
        icon: '🔄'
    }
};

// Preset configurations matching backend
const PRESETS = {
    lite: ['zero_shot_cot', 'role_prompting', 'xml_schema', 'negative_prompts'],
    reasoning: ['zero_shot_cot', 'few_shot_cot', 'self_consistency', 'reflection', 'chain_verification'],
    data_centric: ['rag_augmented', 'dynamic_memory', 'chain_verification', 'xml_schema'],
    creative: ['role_prompting', 'voice_anchor', 'contrastive', 'temperature_scheduling'],
    production: ['xml_schema', 'negative_prompts', 'ethical_constraints', 'compression', 'triple_prime'],
    research: ['tree_of_thought', 'program_aided', 'iterative_decomposition', 'multimodal_cot']
};

let currentTechniques = {};

// Initialize the options page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Prompto: Initializing options page...');
    
    // Load current settings
    await loadCurrentSettings();
    
    // Render techniques grid
    renderTechniquesGrid();
    
    // Setup preset handlers
    setupPresetHandlers();
    
    // Setup save handler
    setupSaveHandler();
    
    // Update stats
    updateStats();
    
    console.log('🚀 Prompto: Options page initialized');
});

async function loadCurrentSettings() {
    try {
        const result = await chrome.storage.sync.get(['promptoTechniques']);
        if (result.promptoTechniques && typeof result.promptoTechniques === 'object') {
            currentTechniques = { ...result.promptoTechniques };
        } else {
            // Use defaults
            currentTechniques = {};
            Object.entries(TECHNIQUES_CATALOG).forEach(([key, technique]) => {
                currentTechniques[key] = technique.default;
            });
        }
        console.log('🚀 Prompto: Loaded current settings:', currentTechniques);
    } catch (error) {
        console.error('🚀 Prompto: Error loading settings:', error);
        // Fallback to defaults
        currentTechniques = {};
        Object.entries(TECHNIQUES_CATALOG).forEach(([key, technique]) => {
            currentTechniques[key] = technique.default;
        });
    }
}

function renderTechniquesGrid() {
    const grid = document.getElementById('techniquesGrid');
    grid.innerHTML = '';
    
    // Group techniques by category
    const categories = {};
    Object.entries(TECHNIQUES_CATALOG).forEach(([key, technique]) => {
        if (!categories[technique.category]) {
            categories[technique.category] = [];
        }
        categories[technique.category].push({ key, ...technique });
    });
    
    // Render all techniques
    Object.entries(TECHNIQUES_CATALOG).forEach(([key, technique]) => {
        const card = createTechniqueCard(key, technique);
        grid.appendChild(card);
    });
}

function createTechniqueCard(key, technique) {
    const card = document.createElement('div');
    card.className = 'technique-card';
    card.innerHTML = `
        <div class="technique-header">
            <div class="technique-info">
                <div class="technique-name">${technique.icon} ${technique.name}</div>
                <div class="technique-description">${technique.description}</div>
                <span class="technique-category">${technique.category}</span>
            </div>
            <label class="toggle-switch">
                <input type="checkbox" class="toggle-input" data-technique="${key}" ${currentTechniques[key] ? 'checked' : ''}>
                <span class="toggle-slider"></span>
            </label>
        </div>
    `;
    
    // Add change handler
    const toggle = card.querySelector('.toggle-input');
    toggle.addEventListener('change', (e) => {
        currentTechniques[key] = e.target.checked;
        updateStats();
        // Clear active preset since we're doing custom changes
        clearActivePreset();
    });
    
    return card;
}

function setupPresetHandlers() {
    const presetChips = document.querySelectorAll('.preset-chip');
    presetChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const preset = chip.dataset.preset;
            applyPreset(preset);
            
            // Update UI
            presetChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        });
    });
}

function applyPreset(presetName) {
    if (!PRESETS[presetName]) {
        console.warn('🚀 Prompto: Unknown preset:', presetName);
        return;
    }
    
    const presetTechniques = PRESETS[presetName];
    
    // Reset all techniques to false
    Object.keys(currentTechniques).forEach(key => {
        currentTechniques[key] = false;
    });
    
    // Enable preset techniques
    presetTechniques.forEach(key => {
        currentTechniques[key] = true;
    });
    
    // Update UI
    updateToggleStates();
    updateStats();
    
    console.log(`🚀 Prompto: Applied preset "${presetName}":`, presetTechniques);
}

function updateToggleStates() {
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        const key = toggle.dataset.technique;
        toggle.checked = currentTechniques[key] || false;
    });
}

function clearActivePreset() {
    document.querySelectorAll('.preset-chip').forEach(chip => {
        chip.classList.remove('active');
    });
}

function updateStats() {
    const enabledCount = Object.values(currentTechniques).filter(Boolean).length;
    const totalCount = Object.keys(TECHNIQUES_CATALOG).length;
    
    // Calculate effectiveness score based on enabled techniques
    let effectivenessScore = 60; // Base score
    
    // Add points for key techniques
    if (currentTechniques.zero_shot_cot) effectivenessScore += 8;
    if (currentTechniques.role_prompting) effectivenessScore += 6;
    if (currentTechniques.xml_schema) effectivenessScore += 5;
    if (currentTechniques.chain_verification) effectivenessScore += 7;
    if (currentTechniques.self_consistency) effectivenessScore += 6;
    if (currentTechniques.negative_prompts) effectivenessScore += 4;
    if (currentTechniques.ethical_constraints) effectivenessScore += 3;
    
    // Bonus for having multiple reasoning techniques
    const reasoningTechniques = ['zero_shot_cot', 'few_shot_cot', 'self_consistency', 'reflection', 'tree_of_thought'];
    const enabledReasoning = reasoningTechniques.filter(key => currentTechniques[key]).length;
    if (enabledReasoning >= 2) effectivenessScore += 5;
    if (enabledReasoning >= 3) effectivenessScore += 3;
    
    effectivenessScore = Math.min(99, effectivenessScore);
    
    // Update UI
    document.getElementById('enabledCount').textContent = enabledCount;
    document.getElementById('totalCount').textContent = totalCount;
    document.getElementById('effectivenessScore').textContent = effectivenessScore;
}

function setupSaveHandler() {
    const saveBtn = document.getElementById('saveBtn');
    const saveStatus = document.getElementById('saveStatus');
    
    saveBtn.addEventListener('click', async () => {
        try {
            saveBtn.disabled = true;
            saveBtn.textContent = '💾 Saving...';
            
            // Save to Chrome storage
            await chrome.storage.sync.set({ promptoTechniques: currentTechniques });
            
            // Show success message
            showSaveStatus('✅ Configuration saved successfully!', 'success');
            
            console.log('🚀 Prompto: Settings saved:', currentTechniques);
            
        } catch (error) {
            console.error('🚀 Prompto: Error saving settings:', error);
            showSaveStatus('❌ Error saving configuration', 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.textContent = '💾 Save Configuration';
        }
    });
}

function showSaveStatus(message, type) {
    const saveStatus = document.getElementById('saveStatus');
    saveStatus.textContent = message;
    saveStatus.className = `save-status ${type}`;
    saveStatus.style.display = 'block';
    
    setTimeout(() => {
        saveStatus.style.display = 'none';
    }, 3000);
}

// Auto-save functionality (save after 2 seconds of inactivity)
let saveTimeout;
function autoSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
        try {
            await chrome.storage.sync.set({ promptoTechniques: currentTechniques });
            console.log('🚀 Prompto: Settings auto-saved');
        } catch (error) {
            console.error('🚀 Prompto: Auto-save failed:', error);
        }
    }, 2000);
}

// Add auto-save to all technique toggles
document.addEventListener('change', (e) => {
    if (e.target.classList.contains('toggle-input')) {
        autoSave();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S or Cmd+S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveBtn').click();
    }
    
    // Escape to close (if opened as popup)
    if (e.key === 'Escape') {
        window.close();
    }
});

console.log('🚀 Prompto: Options script loaded successfully'); 