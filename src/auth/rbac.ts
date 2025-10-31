// RBAC эрхийн түвшин, модулийн төрөл, функцын enum болон interface тодорхойлолт

export enum AccessLevel {
  ReadOnly = 1, // Хязгаарлагдмал (унших)
  ReadWrite = 2, // Засварлах
  Admin = 3, // Удирдлага
  SuperAdmin = 4 // Системийн зохицуулагч
}

export enum ModuleType {
  CrimeRegistration = 'crime-registration',
  Investigation = 'investigation',
  Monitoring = 'monitoring',
  Reporting = 'reporting',
  Integration = 'integration'
}

export interface ModulePermission {
  module: ModuleType
  access: AccessLevel
  description: string
}

// Жишээ: хэрэглэгчийн эрхийн тохиргоо
export interface UserRole {
  role: string
  permissions: ModulePermission[]
}

// Жишээ хэрэглээ:
// const patrolRole: UserRole = {
//   role: 'Патруль цагдаа',
//   permissions: [
//     { module: ModuleType.CrimeRegistration, access: AccessLevel.ReadOnly, description: 'Гэмт хэргийн бүртгэлийг харах' },
//     { module: ModuleType.Reporting, access: AccessLevel.ReadOnly, description: 'Тайлан унших' }
//   ]
// }
