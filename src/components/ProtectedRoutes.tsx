import { Navigate } from "react-router-dom";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = localStorage.getItem("email"); // You can also use cookies/context

  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
}
