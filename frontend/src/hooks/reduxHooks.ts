import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Permission hook to check user permissions
export const usePermission = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const hasPermission = (permissionKey: string) => {
    if (!user || !user.role || !user.role.permissions) {
      return false;
    }
    
    const permissions = user.role.permissions;
    
    // Direct match check
    if (permissions.includes(permissionKey)) {
      return true;
    }
    
    // Wildcard check for admin/superuser
    if (
      permissions.includes('*') || 
      permissions.includes('all') || 
      permissions.includes('admin') || 
      permissions.includes('superadmin') || 
      permissions.includes('full_access')
    ) {
      return true;
    }
    
    // Alternative pattern matching
    const parts = permissionKey.split('_');
    if (parts.length === 2) {
      const resource = parts[0];
      const action = parts[1];
      
      // Handle the mixed permission formats
      const alternatePatterns = [
        `${resource}.*`,
        `*.${action}`,
        `view_${resource}`,
        `${resource}_view`,
        `${resource}s_${action}`,
        `${action}_${resource}`,
        // Singular/plural variations
        resource.endsWith('s') ? `${resource.slice(0, -1)}_${action}` : `${resource}s_${action}`,
        // Add support for view/edit/create format
        `${resource}_${action === 'view' ? 'read' : action}`,
        `${action === 'view' ? 'read' : action}_${resource}`
      ];
      
      for (const pattern of alternatePatterns) {
        if (permissions.includes(pattern)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  return {
    hasPermission,
    hasAnyPermission: (permissionKeys: string[]) => permissionKeys.some(key => hasPermission(key)),
    hasAllPermissions: (permissionKeys: string[]) => permissionKeys.every(key => hasPermission(key))
  };
}; 