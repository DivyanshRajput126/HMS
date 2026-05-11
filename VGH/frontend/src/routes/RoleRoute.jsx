import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleRoute = ({ allowedRoles, children }) => {
  const role = useSelector((state) => state.auth.role);

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default RoleRoute;