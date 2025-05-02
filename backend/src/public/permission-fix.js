
// Permission Debug and Fix Script
// Run this in your browser console to diagnose and fix permission issues

(function() {
  console.log('=== Permission Debug and Fix Tool ===');
  
  // Check current user data
  const userData = localStorage.getItem('user');
  let user = null;
  let permissions = [];
  
  try {
    user = JSON.parse(userData);
    permissions = user?.user?.permissions || [];
    
    console.log('Current user:', user?.user?.username);
    console.log('Role:', user?.user?.roleName);
    console.log('Permissions:', permissions);
    
    // Check specific permissions
    const hasRolesView = permissions.includes('roles_view');
    const hasDashboardView = permissions.includes('dashboard_view');
    
    console.log('Has roles_view:', hasRolesView);
    console.log('Has dashboard_view:', hasDashboardView);
    
    if (hasRolesView && !hasDashboardView) {
      console.log('ISSUE DETECTED: Has roles_view but missing dashboard_view!');
      
      // Attempt to fix by forcing reload or logout
      const fix = confirm('Permission issue detected. Would you like to fix it by logging out and clearing cache?');
      
      if (fix) {
        console.log('Clearing localStorage and reloading...');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } else if (!hasRolesView && !hasDashboardView && user) {
      console.log('ISSUE DETECTED: User logged in but missing critical permissions!');
      
      // Attempt to fix by forcing reload or logout
      const fix = confirm('Permission issue detected. Would you like to fix it by logging out and clearing cache?');
      
      if (fix) {
        console.log('Clearing localStorage and reloading...');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    } else if (hasDashboardView) {
      console.log('Permissions look good! You have dashboard_view permission.');
      
      // Check if user is still seeing permission issues
      const stillHavingIssues = confirm('Are you still experiencing permission issues?');
      
      if (stillHavingIssues) {
        console.log('Clearing localStorage and reloading to refresh permissions...');
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
      }
    }
  } catch (error) {
    console.error('Error parsing user data:', error);
    
    const fix = confirm('Error parsing user data. Would you like to clear localStorage and reload?');
    
    if (fix) {
      console.log('Clearing localStorage and reloading...');
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = '/login';
    }
  }
})();
