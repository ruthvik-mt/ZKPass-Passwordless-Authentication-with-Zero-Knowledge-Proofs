import '../styles/Dashboard.css';

interface DashboardProps {
  uid: string;
  onLogout: () => void;
}

const Dashboard = ({ uid, onLogout }: DashboardProps) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>ZKPass Dashboard</h1>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Welcome to ZKPass</h2>
          <p>You are securely authenticated using Zero-Knowledge Proofs.</p>
        </div>
        
        <div className="uid-card">
          <h3>Your UID</h3>
          <p className="uid-display">{uid}</p>
        </div>
        
        <div className="info-card">
          <h3>About Zero-Knowledge Proofs</h3>
          <p>
            Zero-Knowledge Proofs allow you to prove you know something (like a password) 
            without revealing the actual information. This enhances security by ensuring 
            your sensitive data is never transmitted or stored on servers.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;