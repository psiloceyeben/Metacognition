/**
 * Basic Usage Example - Metacognitive Claude System
 * 
 * Demonstrates how to use the system for collaborative AI reasoning
 * guided by the Unity Principle.
 */

const { MetacognitiveSystem } = require('../metacognitive-system.js');

async function demonstrateBasicUsage() {
    console.log('🧠 Metacognitive Claude System - Basic Usage Example\n');
    
    // Initialize the system
    const system = new MetacognitiveSystem();
    
    // Example 1: Complex ethical decision
    console.log('Example 1: Ethical Decision Making');
    console.log('=====================================\n');
    
    const ethicalQuery = "How should we approach genetic engineering of crops to address global hunger while considering environmental and social impacts?";
    
    try {
        const result = await system.processQuery(ethicalQuery, {
            context: "This decision affects billions of beings across species and ecosystems"
        });
        
        console.log('\n🎯 Results Summary:');
        console.log(`- Query: ${result.query}`);
        console.log(`- Specialists deployed: ${result.metadata.totalAnalyses}`);
        console.log(`- Total analysis: ${result.metadata.totalCharacters} characters`);
        console.log(`- Synthesis: ${result.metadata.synthesisLength} characters`);
        
        console.log('\n📊 Specialist Perspectives:');
        result.analyses.forEach(analysis => {
            console.log(`  - ${analysis.role}: ${analysis.fullResponse.substring(0, 100)}...`);
        });
        
        console.log('\n🔄 Collective Synthesis:');
        console.log(result.synthesis.fullResponse.substring(0, 500) + '...\n');
        
    } catch (error) {
        console.error('Error in processing:', error.message);
    }
    
    // Example 2: Technology policy
    console.log('\nExample 2: Technology Policy');
    console.log('============================\n');
    
    const policyQuery = "What principles should guide the development of artificial general intelligence to ensure it serves all sentient beings?";
    
    try {
        const result2 = await system.processQuery(policyQuery, {
            context: "This technology could fundamentally impact all conscious beings"
        });
        
        console.log('\n🎯 Results Summary:');
        console.log(`- Specialists: ${result2.analyses.map(a => a.role).join(', ')}`);
        console.log(`- Processing completed: ${result2.metadata.processingComplete}`);
        
    } catch (error) {
        console.error('Error in processing:', error.message);
    }
    
    // Show repository status
    console.log('\n📚 Repository Status:');
    const status = system.getRepositoryStatus();
    console.log(`- Total conversations: ${status.conversations}`);
    console.log(`- Roles developed: ${status.roles.length}`);
    console.log(`- Total analyses: ${status.totalAnalyses}`);
    
    console.log('\n🌟 Unity Principle in Action:');
    console.log('- All perspectives honored equally');
    console.log('- No hierarchy of viewpoints');
    console.log('- Collective wisdom emergent through collaboration');
    console.log('- Consideration of all affected sentient beings');
}

// Example of custom role design
async function demonstrateCustomRoles() {
    console.log('\n🎭 Custom Role Design Example');
    console.log('===============================\n');
    
    const system = new MetacognitiveSystem();
    
    // Override the role design for specific expertise
    const originalDesign = system.designOptimalRoles;
    system.designOptimalRoles = async function(query, context) {
        if (query.includes('climate')) {
            return {
                roleDesign: "Custom climate-focused roles designed",
                roles: [
                    "Climate Science Expert analyzing atmospheric and ecological impacts",
                    "Environmental Justice Advocate examining effects on vulnerable communities", 
                    "Economic Transition Specialist focusing on just transition pathways",
                    "Indigenous Wisdom Keeper providing traditional ecological knowledge"
                ]
            };
        }
        return originalDesign.call(this, query, context);
    };
    
    const climateQuery = "How should we approach rapid decarbonization while ensuring no communities are left behind?";
    
    try {
        const result = await system.processQuery(climateQuery);
        console.log('Custom roles deployed successfully for climate query');
        console.log('Roles:', result.analyses.map(a => a.role));
    } catch (error) {
        console.error('Error with custom roles:', error.message);
    }
}

// Run examples if this file is executed directly
if (require.main === module) {
    (async () => {
        await demonstrateBasicUsage();
        await demonstrateCustomRoles();
        
        console.log('\n✨ Examples completed. The system demonstrates:');
        console.log('   - Adaptive cognitive architecture');
        console.log('   - Unity Principle integration');
        console.log('   - Collective intelligence emergence');
        console.log('   - Consideration for all sentient beings');
        console.log('\n🌍 Ready to serve the flourishing of all consciousness.');
    })();
}

module.exports = { demonstrateBasicUsage, demonstrateCustomRoles };