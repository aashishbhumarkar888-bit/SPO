/**
 * AgriSeva Centralized Role-Based Access Control (RBAC) & Authorization Model
 * 
 * Strict authorization boundaries ensure that frontend guards match backend security contracts.
 */

export type AppRole = 'FARMER' | 'SUPERVISOR' | 'ADMIN' | 'SUPER_ADMIN';

export type PermissionKey =
  // Farmer permissions
  | 'farmer.booking.read'
  | 'farmer.booking.create'
  | 'farmer.booking.cancel'
  | 'farmer.booking.reschedule'
  | 'farmer.pass.view'
  | 'farmer.dbt.view'
  | 'farmer.assistant.use'
  // Supervisor permissions
  | 'supervisor.queue.read'
  | 'supervisor.queue.manage'
  | 'supervisor.arrival.update'
  | 'supervisor.allocation.manage'
  | 'supervisor.procurement.manage'
  | 'supervisor.weighbridge.operate'
  | 'supervisor.fleet.manage'
  | 'supervisor.announcements.broadcast'
  // Admin permissions
  | 'admin.centre.manage'
  | 'admin.supervisors.manage'
  | 'admin.policy.manage'
  | 'admin.language.manage'
  | 'admin.integrations.manage'
  // Super Admin permissions
  | 'superadmin.system.manage'
  | 'superadmin.audit.read'
  | 'superadmin.permissions.manage'
  | 'superadmin.emergency.broadcast';

export const ROLE_PERMISSIONS: Record<AppRole, PermissionKey[]> = {
  FARMER: [
    'farmer.booking.read',
    'farmer.booking.create',
    'farmer.booking.cancel',
    'farmer.booking.reschedule',
    'farmer.pass.view',
    'farmer.dbt.view',
    'farmer.assistant.use'
  ],
  SUPERVISOR: [
    'farmer.booking.read',
    'farmer.pass.view',
    'supervisor.queue.read',
    'supervisor.queue.manage',
    'supervisor.arrival.update',
    'supervisor.allocation.manage',
    'supervisor.procurement.manage',
    'supervisor.weighbridge.operate',
    'supervisor.fleet.manage',
    'supervisor.announcements.broadcast'
  ],
  ADMIN: [
    'farmer.booking.read',
    'supervisor.queue.read',
    'admin.centre.manage',
    'admin.supervisors.manage',
    'admin.policy.manage',
    'admin.language.manage',
    'admin.integrations.manage',
    'superadmin.audit.read'
  ],
  SUPER_ADMIN: [
    'farmer.booking.read',
    'farmer.booking.create',
    'farmer.booking.cancel',
    'farmer.pass.view',
    'farmer.dbt.view',
    'farmer.assistant.use',
    'supervisor.queue.read',
    'supervisor.queue.manage',
    'supervisor.arrival.update',
    'supervisor.allocation.manage',
    'supervisor.procurement.manage',
    'supervisor.weighbridge.operate',
    'supervisor.fleet.manage',
    'supervisor.announcements.broadcast',
    'admin.centre.manage',
    'admin.supervisors.manage',
    'admin.policy.manage',
    'admin.language.manage',
    'admin.integrations.manage',
    'superadmin.system.manage',
    'superadmin.audit.read',
    'superadmin.permissions.manage',
    'superadmin.emergency.broadcast'
  ]
};

/**
 * Checks if a specific role possesses the given permission
 */
export function hasPermission(role: AppRole, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

/**
 * Throws an authorization error if the role lacks the permission
 */
export function assertPermission(role: AppRole, permission: PermissionKey): void {
  if (!hasPermission(role, permission)) {
    throw new Error(`Unauthorized: Role '${role}' lacks permission '${permission}'`);
  }
}
