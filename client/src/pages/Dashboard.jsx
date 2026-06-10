import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ControlCenterHeader from '../components/dashboard/ControlCenterHeader';
import StatsBar from '../components/dashboard/StatsBar';
import QuickActions from '../components/dashboard/QuickActions';
import ModuleGrid from '../components/dashboard/ModuleGrid';
import SystemStatus from '../components/dashboard/SystemStatus';
import ProjectsOverview from '../components/dashboard/ProjectsOverview';
import UrgentTasks from '../components/dashboard/UrgentTasks';
import TasksList from '../components/dashboard/TasksList';
import GoalsPanel from '../components/dashboard/GoalsPanel';
import RecentIdeas from '../components/dashboard/RecentIdeas';
import QuickNotes from '../components/dashboard/QuickNotes';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import '../styles/shared.css';
import './Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const response = await api.dashboard.get();
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page dashboard">
        <ControlCenterHeader
          meta={{ greeting: 'Ciao' }}
          system={{ status: 'degraded' }}
          onRefresh={() => loadDashboard(true)}
          refreshing={refreshing}
        />
        <div className="dashboard-error card">
          <h3>Connessione non disponibile</h3>
          <p>Avvia MongoDB e il backend per attivare il centro di controllo.</p>
          <code>docker-compose up -d && npm run dev</code>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <ControlCenterHeader
        meta={data.meta}
        system={data.system}
        onRefresh={() => loadDashboard(true)}
        refreshing={refreshing}
      />

      <StatsBar stats={data.stats} />

      <QuickActions />

      <div className="dashboard-row dashboard-row-top">
        <ModuleGrid modules={data.system.modules} moduleStats={data.system.moduleStats} />
        <SystemStatus system={data.system} />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-col-main">
          <ProjectsOverview projects={data.projectBoard} />
          <div className="dashboard-tasks-row">
            <UrgentTasks tasks={data.urgentTasks} onUpdate={() => loadDashboard(true)} />
            <TasksList tasks={data.pendingTasks} onUpdate={() => loadDashboard(true)} />
          </div>
          <QuickNotes notes={data.notes} onUpdate={() => loadDashboard(true)} />
        </div>
        <div className="dashboard-col-side">
          <GoalsPanel goals={data.goals} />
          <RecentIdeas ideas={data.recentIdeas} />
          <ActivityFeed activities={data.recentActivity} />
        </div>
      </div>
    </div>
  );
}
