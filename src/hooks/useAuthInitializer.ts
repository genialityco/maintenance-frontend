import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOrganizationId, setPermissions } from "../features/auth/sliceAuth";
import { getEmployeeById } from "../services/employeeService";
import { requestNotificationPermission } from "../utils/notificationUtils"; // Importa la función de notificaciones
import { RootState, AppDispatch } from "../app/store";

const useAuthInitializer = () => {
  const dispatch: AppDispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const role = useSelector((state: RootState) => state.auth.role);
  const organization = useSelector(
    (state: RootState) => state.organization.organization
  );
  const organizationLoading = useSelector(
    (state: RootState) => state.organization.loading
  );

  useEffect(() => {
    // Espera hasta que la organización esté cargada antes de continuar
    if (!organizationLoading && organization && token) {
      const fetchPermissions = async () => {
        try {
          if (role === "admin" && userId) {
            if (organization._id) {
              dispatch(setOrganizationId(organization._id));
            }
            dispatch(setPermissions(organization.role.permissions));
            requestNotificationPermission("organization", userId); // Solicita permiso de notificación para la organización
          } else if (role === "employee" && userId) {
            const employeeData = await getEmployeeById(userId);
            if (employeeData) {
              dispatch(setOrganizationId(employeeData.organizationId));
              dispatch(setPermissions(employeeData.role.permissions));
              requestNotificationPermission("employee", userId); // Solicita permiso de notificación para el empleado
            }
          }
        } catch (error) {
          console.error("Error al obtener los permisos:", error);
        }
      };

      fetchPermissions();
    }
  }, [token, organization, organizationLoading, dispatch, role, userId]);
};

export default useAuthInitializer;
