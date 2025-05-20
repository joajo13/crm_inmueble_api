export interface UserDTO {
  id?: string;
  name: string;
  email: string;
  password: string;
  roleId: string;
  createdAt?: Date;
  updatedAt?: Date;
} 