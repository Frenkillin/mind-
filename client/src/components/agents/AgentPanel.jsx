import { useState, useEffect, useRef } from 'react';
import { Send, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import './AgentPanel.css';

export default function AgentPanel({ agent }) {
  const [session, setSession] = useState(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    startSession();
  }, [agent.type]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  async function startSession() {
    try {
      const res = await api.agents.createSession({
        agentType: agent.type,
        agentId: agent._id,
      });
      setSession(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!message.trim() || !session || sending) return;

    setSending(true);
    const userMessage = message.trim();
    setMessage('');

    setSession((prev) => ({
      ...prev,
      messages: [...prev.messages, { role: 'user', content: userMessage }],
    }));

    try {
      const res = await api.agents.sendMessage(session._id, userMessage);
      setSession(res.data.session);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  }

  async function handleNewChat() {
    if (session) await api.agents.deleteSession(session._id).catch(() => {});
    startSession();
  }

  const visibleMessages = session?.messages?.filter((m) => m.role !== 'system') || [];

  return (
    <div className="agent-panel">
      <div className="agent-panel-header" style={{ borderColor: agent.color }}>
        <div>
          <h2>{agent.name}</h2>
          <p>{agent.description}</p>
        </div>
        <button className="btn btn-ghost" onClick={handleNewChat}>
          <Trash2 size={16} />
          Nuova chat
        </button>
      </div>

      <div className="agent-messages">
        {visibleMessages.length === 0 && (
          <div className="agent-welcome">
            <p>Ciao! Sono il <strong>{agent.name}</strong>.</p>
            <p>Come posso aiutarti oggi?</p>
          </div>
        )}
        {visibleMessages.map((msg, i) => (
          <div key={i} className={`agent-message ${msg.role}`}>
            <div className="message-bubble">{msg.content}</div>
          </div>
        ))}
        {sending && (
          <div className="agent-message assistant">
            <div className="message-bubble typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="agent-input-form" onSubmit={handleSend}>
        <input
          className="input"
          placeholder={`Scrivi a ${agent.name}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={sending}
        />
        <button type="submit" className="btn btn-primary" disabled={sending || !message.trim()}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
