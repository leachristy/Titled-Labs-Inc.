/**
 * Protected Route Component
 * 
 * HOC (Higher Order Component) that protects routes from unauthenticated access
 * Wraps any component that requires user authentication
 * 
 * Usage:
 * <Protected>
 *   <Dashboard />
 * </Protected>
 * 
 * Behavior:
 * - If user is logged in: Renders the child component
 * - If user is NOT logged in: Redirects to /login page
 * 
 * @param {ReactNode} children - The component(s) to protect
 * @returns {ReactNode} Either the children or a redirect to login
 */

import { Navigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";

const Protected = ({ children }) => {
  // Get current user from authentication context
  const { user } = UserAuth();
  
  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // User is authenticated, render the protected component
  return children;
};

export default Protected;
