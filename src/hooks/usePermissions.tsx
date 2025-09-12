import { useAuth } from "@contexts";
import { useNavigate } from "react-router-dom";

export const usePermissions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  

  const validatePermissions = (): boolean => {
    if(user?.rol_id === 1) return true;
    return false
  }

  const validateRoutePermission = () => {
    const permiso = validatePermissions();
    if (!permiso) {
      navigate("/home")
    }
  }
  return {
    validatePermissions,
    validateRoutePermission
  }
}
