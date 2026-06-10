/**
 * Scaffold per esecuzione autonoma agenti.
 * NON implementa ancora l'esecuzione — solo struttura.
 */
import { buildContext } from '../memory/memoryRetrievalService.js';
import { chat } from '../ai/aiProviderManager.js';

export class AgentExecutor {
  constructor(agent) {
    this.agent = agent;
  }

  /**
   * Prepara il contesto per un task assegnato all'agente.
   * @param {object} task - Task document
   * @param {object} project - Project document (opzionale)
   */
  async prepareTaskContext(task, project = null) {
    const memoryContext = await buildContext({
      types: ['conversation', 'project', 'idea', 'document'],
      limit: 10,
      minImportance: 3,
    });

    return {
      agent: {
        id: this.agent._id,
        name: this.agent.name,
        role: this.agent.role,
        provider: this.agent.provider,
        capabilities: this.agent.capabilities,
      },
      task: {
        id: task._id,
        title: task.title,
        description: task.description,
        status: task.status,
      },
      project: project
        ? { id: project._id, name: project.name, status: project.status }
        : null,
      memory: memoryContext,
      execution: {
        mode: 'scaffold',
        autonomous: false,
        message: 'Esecuzione autonoma non ancora implementata',
      },
    };
  }

  /**
   * Esegue un task — scaffold, restituisce struttura senza azione reale.
   */
  async executeTask(task, project = null) {
    const context = await this.prepareTaskContext(task, project);

    if (!this.agent.executionConfig?.canWorkAutonomously) {
      return {
        success: false,
        status: 'not_implemented',
        context,
        message: 'Esecuzione autonoma disabilitata. Struttura pronta per integrazione futura.',
      };
    }

    return { success: false, status: 'not_implemented', context };
  }

  /**
   * Genera una risposta AI per un task usando il provider dell'agente.
   */
  async assistWithTask(task, project = null) {
    const context = await this.prepareTaskContext(task, project);
    const systemPrompt = [
      `Sei ${this.agent.name}, ${this.agent.role}.`,
      `Capacità: ${this.agent.capabilities?.join(', ') || 'generale'}.`,
      'Aiuta a completare il task seguente con un piano actionable.',
    ].join('\n');

    const userMessage = [
      `Task: ${task.title}`,
      task.description ? `Descrizione: ${task.description}` : '',
      project ? `Progetto: ${project.name}` : '',
      `\nContesto memoria:\n${context.memory.systemContext}`,
    ]
      .filter(Boolean)
      .join('\n');

    const response = await chat([{ role: 'user', content: userMessage }], systemPrompt);

    return {
      response: response || 'Configura GEMINI_API_KEY per assistenza AI sui task.',
      context,
      provider: this.agent.provider,
    };
  }
}

export function createExecutor(agent) {
  return new AgentExecutor(agent);
}
