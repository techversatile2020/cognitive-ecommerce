export type UserModel = {
  token_api_user: string; // Token for API authentication
  id_user: number; // Unique ID of the user
  login: string; // Login email of the user
  name: string; // Name of the user
  fecha_login: string; // Date and time of the last login
  id_emp: number; // Employee ID
  job_title: string; // Job title of the user
  rol_name: string; // Role name (e.g., "SALES REPRESENTATIVE")
  permissions: Permission[]; // Array of permissions for different modules
};

// Define the Permission type for individual modules
export type Permission = {
  module: string; // The name of the module (e.g., "Sales", "Operations")
  access: number; // 1 for access, 0 for no access
  read: number; // 1 for read permission, 0 for no read permission
  write: number; // 1 for write permission, 0 for no write permission
};
