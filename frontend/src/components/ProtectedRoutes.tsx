import { Link, Navigate } from "react-router-dom";
import LogoutButton from './LogoutButton';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = localStorage.getItem("email"); // You can also use cookies/context

  return isAuthenticated ? (
    <div>
      <header style={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '10px 20px', background: '#f5f5f5'}}>
        <span style={{flex: 1}}></span>
        {/* Common Logout Button */}
        <LogoutButton />
        <Link to="/home" style={{margin: '0 10px', textDecoration: 'none', color: '#007bff'}}>Home</Link>
      </header>
      {children}
    </div>
  ) : <Navigate to="/" replace />;
}
