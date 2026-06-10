import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Ideas from './pages/Ideas';
import Agents from './pages/Agents';
import Memory from './pages/Memory';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/ideas" element={<Ideas />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agents/:type" element={<Agents />} />
        <Route path="/memory" element={<Memory />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
}
