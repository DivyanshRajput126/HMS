export const ROLES = {
  ADMIN: "ADMIN",
  MANAGER: "MANAGER",
};

export const hasRole = (userRole, allowedRoles = []) => {
  return allowedRoles.includes(userRole);
};