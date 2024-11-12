import { useSelector } from "react-redux";

export const usePermissions = () => {
  const permissions = useSelector((state: { auth: { permissions: string[] } }) => state.auth.permissions);

  const hasPermission = (permission: string) => {
    return permissions.includes(permission);
  };

  return { hasPermission };
};
