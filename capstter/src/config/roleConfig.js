// roleConfig.js
// Centralized, data-driven role access / navigation targets.
// Add or change roles here instead of editing logic in pages.

const roleConfig = {
  superadmin: {
    // when no businesses exist
    noBusiness: '/superadmin/dashboard',
    // when exactly one business: store id and go to dashboard
    oneBusiness: '/UserDashboard',
    // when multiple businesses
    multiBusiness: '/busmanage'
  },

  admin: {
    noBusiness: '/businessregistration',
    oneBusiness: '/UserDashboard',
    multiBusiness: '/busmanage'
  },

  // regular user roles
  user: {
    noBusiness: '/accesscode',
    oneBusiness: '/UserDashboard',
    multiBusiness: '/busmanage'
  },

  superuser: {
    noBusiness: '/accesscode',
    oneBusiness: '/UserDashboard',
    multiBusiness: '/busmanage'
  }
}

// fallback values when role isn't present in config
export const defaultRoleTargets = {
  noBusiness: '/accesscode',
  oneBusiness: '/UserDashboard',
  multiBusiness: '/busmanage'
}

export default roleConfig
