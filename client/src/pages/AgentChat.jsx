import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Briefcase, Code, Megaphone, Search, Bot } from 'lucide-react';
import { api } from '../services/api';
import AgentPanel from '../components/agents/AgentPanel';
import '../styles/shared.css';
import './Agents.css';

const iconMap = {
  briefcase: Briefcase,
  code: Code,
  megaphone: Megaphone,
  search: Search,
  bot: Bot,
};

export default function AgentChat() {
  const { slug } = useParams();
  const [agents, setAgents] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.agents.list().then((res) => {
      const active = res.data.filter((a) => a.active);
      setAgents(active);
      if (slug) {
        setSelected(active.find((a) => a.slug === slug) || active[0]);
      } else {
        setSelected(active[0]);
      }
    }).catch(console.error);
  }, [slug]);

  if (!agents.length) {
    return <div className="loading"><div className="spinner" /></div>;
  }

  return (
    <div className="page agents-page">
      <div className="page-header">
        <h1>Chat Agenti</h1>
        <p>Conversazioni AI con gli agenti del registro</p>
      </div>

      <div className="agents-layout">
        <div className="agents-sidebar">
          {agents.map((agent) => {
            const Icon = iconMap[agent.icon] || Bot;
            return (
              <button
                key={agent._id}
                className={`agent-card ${selected?._id === agent._id ? 'active' : ''}`}
                onClick={() => setSelected(agent)}
                style={{ '--agent-color': agent.color }}
              >
                <div className="agent-card-icon">
                  <Icon size={22} />
                </div>
                <div>
                  <span className="agent-card-name">{agent.name}</span>
                  <span className="agent-card-desc">{agent.provider} · {agent.role}</span>
                </div>
              </button>
            );
          })}
        </div>

        {selected && (
          <AgentPanel
            key={selected._id}
            agent={{
              type: selected.slug,
              name: selected.name,
              description: selected.description || selected.role,
              color: selected.color,
              _id: selected._id,
            }}
          />
        )}
      </div>
    </div>
  );
}
