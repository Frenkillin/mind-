import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Code, Megaphone, Search } from 'lucide-react';
import { api } from '../services/api';
import AgentPanel from '../components/agents/AgentPanel';
import '../styles/shared.css';
import './Agents.css';

const iconMap = {
  briefcase: Briefcase,
  code: Code,
  megaphone: Megaphone,
  search: Search,
};

export default function Agents() {
  const { type } = useParams();
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(type || 'business');

  useEffect(() => {
    api.agents.list().then((res) => setAgents(res.data)).catch(console.error);
  }, []);

  useEffect(() => {
    if (type) setSelected(type);
  }, [type]);

  const activeAgent = agents.find((a) => a.type === selected);

  return (
    <div className="page agents-page">
      <div className="page-header">
        <h1>Agenti AI</h1>
        <p>Assistenti specializzati per ogni area del tuo lavoro</p>
      </div>

      <div className="agents-layout">
        <div className="agents-sidebar">
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon] || Briefcase;
            return (
              <button
                key={agent.type}
                className={`agent-card ${selected === agent.type ? 'active' : ''}`}
                onClick={() => setSelected(agent.type)}
                style={{ '--agent-color': agent.color }}
              >
                <div className="agent-card-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <span className="agent-card-name">{agent.name}</span>
                  <span className="agent-card-desc">{agent.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {activeAgent && <AgentPanel key={activeAgent.type} agent={activeAgent} />}
      </div>
    </div>
  );
}
