/**
 * API Integration for Metacognitive Claude System
 * 
 * Provides interface adapters for different Claude API implementations
 */

class ClaudeAPIInterface {
    constructor(config = {}) {
        this.config = {
            apiKey: config.apiKey || process.env.CLAUDE_API_KEY,
            baseURL: config.baseURL || 'https://api.anthropic.com/v1',
            model: config.model || 'claude-3-sonnet-20240229',
            maxTokens: config.maxTokens || 4000,
            ...config
        };
    }

    async callClaude(prompt) {
        throw new Error('callClaude method must be implemented by specific API adapter');
    }
}

/**
 * Anthropic API Adapter (for production use)
 */
class AnthropicAPIAdapter extends ClaudeAPIInterface {
    constructor(config) {
        super(config);
        
        if (!this.config.apiKey) {
            throw new Error('Anthropic API key is required. Set CLAUDE_API_KEY environment variable or pass apiKey in config.');
        }
    }

    async callClaude(prompt) {
        try {
            const response = await fetch(`${this.config.baseURL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.config.apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: this.config.model,
                    max_tokens: this.config.maxTokens,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            return data.content[0].text;

        } catch (error) {
            console.error('Anthropic API call failed:', error);
            throw new Error(`Claude API call failed: ${error.message}`);
        }
    }
}

/**
 * Browser Window Adapter (for Claude.ai interface)
 */
class BrowserWindowAdapter extends ClaudeAPIInterface {
    async callClaude(prompt) {
        if (typeof window === 'undefined' || !window.claude?.complete) {
            throw new Error('Browser Claude API not available. This adapter requires window.claude.complete function.');
        }

        try {
            return await window.claude.complete(prompt);
        } catch (error) {
            console.error('Browser Claude API call failed:', error);
            throw new Error(`Browser Claude API call failed: ${error.message}`);
        }
    }
}

/**
 * Mock Adapter (for testing and demonstration)
 */
class MockClaudeAdapter extends ClaudeAPIInterface {
    constructor(config = {}) {
        super(config);
        this.responseDelay = config.responseDelay || 1000;
        this.responses = config.responses || this.getDefaultResponses();
    }

    getDefaultResponses() {
        return {
            'mirror_designer': 'For this analysis, I recommend deploying these specialist perspectives: Systems Analyst examining interconnections, Ethics Coordinator focusing on moral implications, Implementation Specialist handling practical considerations, and Risk Assessor identifying potential harms. Each perspective will contribute essential insights.',
            
            'systems_analyst': 'From a systems perspective, this question involves complex interconnections between multiple stakeholders, feedback loops, and emergent properties. Key considerations include unintended consequences, scalability factors, and the dynamic relationships between different system components.',
            
            'ethics_coordinator': 'Ethical analysis reveals important considerations about fairness, justice, and the wellbeing of all affected sentient beings. We must examine potential impacts on vulnerable populations, ensure equitable distribution of benefits and burdens, and maintain respect for autonomy and dignity.',
            
            'implementation_specialist': 'Implementation analysis focuses on practical feasibility, resource requirements, timeline considerations, and operational challenges. Key factors include stakeholder buy-in, infrastructure needs, skill requirements, and change management strategies.',
            
            'risk_assessor': 'Risk assessment identifies potential negative consequences, unintended effects, and failure modes. Critical risks include harm to vulnerable populations, environmental damage, economic disruption, and erosion of social trust. Mitigation strategies must address each identified risk.',
            
            'synthesis': 'Integrating all perspectives reveals a nuanced landscape requiring balanced approaches. The systems analysis highlights interconnected complexities, while ethical considerations emphasize moral obligations. Implementation challenges require practical solutions, and risk assessment demands careful mitigation. The optimal path forward involves stakeholder collaboration, adaptive implementation, continuous monitoring, and commitment to the wellbeing of all affected beings.'
        };
    }

    async callClaude(prompt) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, this.responseDelay));

        const lowerPrompt = prompt.toLowerCase();
        
        // Match prompt to appropriate response type
        if (lowerPrompt.includes('mirror designer') || lowerPrompt.includes('design') && lowerPrompt.includes('role')) {
            return this.responses.mirror_designer;
        } else if (lowerPrompt.includes('systems') || lowerPrompt.includes('interconnection')) {
            return this.responses.systems_analyst;
        } else if (lowerPrompt.includes('ethic') || lowerPrompt.includes('moral')) {
            return this.responses.ethics_coordinator;
        } else if (lowerPrompt.includes('implementation') || lowerPrompt.includes('practical')) {
            return this.responses.implementation_specialist;
        } else if (lowerPrompt.includes('risk') || lowerPrompt.includes('harm')) {
            return this.responses.risk_assessor;
        } else if (lowerPrompt.includes('synthesis') || lowerPrompt.includes('integrate')) {
            return this.responses.synthesis;
        } else {
            return 'This perspective contributes valuable insights to our collective understanding, emphasizing the importance of considering all stakeholders and potential impacts in our decision-making process.';
        }
    }
}

/**
 * API Factory - automatically selects appropriate adapter
 */
class ClaudeAPIFactory {
    static createAdapter(config = {}) {
        // Check for explicit adapter type
        if (config.adapter) {
            switch (config.adapter) {
                case 'anthropic':
                    return new AnthropicAPIAdapter(config);
                case 'browser':
                    return new BrowserWindowAdapter(config);
                case 'mock':
                    return new MockClaudeAdapter(config);
                default:
                    throw new Error(`Unknown adapter type: ${config.adapter}`);
            }
        }

        // Auto-detect environment
        if (typeof window !== 'undefined' && window.claude?.complete) {
            console.log('🌐 Using Browser Window Adapter');
            return new BrowserWindowAdapter(config);
        } else if (config.apiKey || process.env.CLAUDE_API_KEY) {
            console.log('🔗 Using Anthropic API Adapter');
            return new AnthropicAPIAdapter(config);
        } else {
            console.log('🎭 Using Mock Adapter (demo mode)');
            return new MockClaudeAdapter(config);
        }
    }
}

/**
 * Enhanced Metacognitive System with API Integration
 */
class MetacognitiveSystemWithAPI {
    constructor(config = {}) {
        this.apiAdapter = ClaudeAPIFactory.createAdapter(config);
        this.analysisHistory = [];
        this.roleRepository = new Map();
        this.conversationLog = [];
        this.initializeBaseRoles();
    }

    async callClaude(prompt) {
        return await this.apiAdapter.callClaude(prompt);
    }

    // Include all other methods from the base MetacognitiveSystem
    // (This would extend the original class in practice)
    
    initializeBaseRoles() {
        const baseRoles = [
            {
                name: 'systems_analyst',
                definition: 'Systems thinking perspective examining interconnections and emergent properties',
                usage: 0
            },
            {
                name: 'ethics_guardian',
                definition: 'Ethical implications focusing on wellbeing of all sentient beings',
                usage: 0
            },
            {
                name: 'practical_implementer',
                definition: 'Practical implementation and real-world feasibility perspective',
                usage: 0
            },
            {
                name: 'risk_assessor',
                definition: 'Risk analysis and potential harm identification across all affected beings',
                usage: 0
            }
        ];

        baseRoles.forEach(role => {
            this.roleRepository.set(role.name, role);
        });
    }

    async processQuery(query, options = {}) {
        console.log('🧠 Initiating Metacognitive Processing with API Integration');
        console.log('API Adapter:', this.apiAdapter.constructor.name);
        
        // Implementation would continue with the same logic as the base system
        // but using this.callClaude() which routes through the API adapter
        
        return {
            query,
            apiAdapter: this.apiAdapter.constructor.name,
            message: 'Full implementation would continue here...'
        };
    }
}

// Export for different environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ClaudeAPIInterface,
        AnthropicAPIAdapter,
        BrowserWindowAdapter,
        MockClaudeAdapter,
        ClaudeAPIFactory,
        MetacognitiveSystemWithAPI
    };
} else if (typeof window !== 'undefined') {
    window.ClaudeAPIFactory = ClaudeAPIFactory;
    window.MetacognitiveSystemWithAPI = MetacognitiveSystemWithAPI;
}

// Usage examples:

// For production with Anthropic API:
// const system = new MetacognitiveSystemWithAPI({
//     adapter: 'anthropic',
//     apiKey: 'your-api-key'
// });

// For browser environment:
// const system = new MetacognitiveSystemWithAPI({
//     adapter: 'browser'
// });

// For testing/demo:
// const system = new MetacognitiveSystemWithAPI({
//     adapter: 'mock',
//     responseDelay: 500
// });
