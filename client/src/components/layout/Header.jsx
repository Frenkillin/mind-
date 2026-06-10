import { useLocation } from 'react-router-dom';
import { Mic, Search } from 'lucide-react';
import './Header.css';

const pageTitles = {
  '/': 'Dashboard',
  '/projects': 'Progetti',
  '/ideas': 'Idee',
  '/agents': 'Agenti AI',
  '/memory': 'Memoria',
  '/settings': 'Impostazioni',
};

export default function Header() {
  const location = useLocation();
  const basePath = '/' + (location.pathname.split('/')[1] || '');
  const title = pageTitles[basePath] || 'MIND';

  return (
    <header className="header">
      <h2 className="header-title">{title}</h2>
      <div className="header-actions">
        <div className="header-search">
          <Search size={18} />
          <input type="text" placeholder="Cerca in MIND..." className="header-search-input" />
        </div>
        <button className="btn-icon voice-btn" title="Controllo vocale (prossimamente)">
          <Mic size={20} />
        </button>
      </div>
    </header>
  );
}
