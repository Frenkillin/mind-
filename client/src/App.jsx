import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Ideas from './pages/Ideas';
import Agents from './pages/Agents';
import AgentChat from './pages/AgentChat';
import Tasks from './pages/Tasks';
import Memory from './pages/Memory';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/chat" element={<AgentChat />} />
        <Route path="/chat/:slug" element={<AgentChat />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
