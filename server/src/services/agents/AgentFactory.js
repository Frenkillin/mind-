import { BusinessAgent } from './BusinessAgent.js';
import { DevelopmentAgent } from './DevelopmentAgent.js';
import { MarketingAgent } from './MarketingAgent.js';
import { ResearchAgent } from './ResearchAgent.js';

const agents = {
  business: BusinessAgent,
  development: DevelopmentAgent,
  marketing: MarketingAgent,
  research: ResearchAgent,
};

export class AgentFactory {
  static create(type) {
    const AgentClass = agents[type];
    if (!AgentClass) {
      throw new Error(`Agente sconosciuto: ${type}`);
    }
    return new AgentClass();
  }

  static getAvailableTypes() {
    return Object.keys(agents);
  }
}
