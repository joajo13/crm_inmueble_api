import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface UserData {
  email: string;
  password?: string;
  fullName: string;
  phone?: string;
}

const UserService = {
  getAll: async () => {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        createdAt: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  },
  
  getById: async (id: number) => {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        createdAt: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  },
  
  create: async (data: UserData, roleIds?: number[]) => {
    // Crear una copia del objeto data para modificarlo
    const userData = {
      email: data.email,
      fullName: data.fullName,
      // Asegurar que password siempre es un string
      password: data.password 
        ? await bcrypt.hash(data.password, 10) 
        : await bcrypt.hash('changeme123', 10),
      // Incluir phone solo si está definido
      ...(data.phone ? { phone: data.phone } : {})
    };

    // Crear el usuario
    const newUser = await prisma.user.create({
      data: userData
    });
    
    // Asignar roles si se proporcionaron
    if (roleIds && roleIds.length > 0) {
      const roleConnections = roleIds.map(roleId => ({
        roleId,
        userId: newUser.id
      }));
      
      await prisma.userOnRole.createMany({
        data: roleConnections
      });
    }
    
    // Obtener el usuario con sus roles
    return await prisma.user.findUnique({
      where: { id: newUser.id },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  },
  
  update: async (id: number, data: UserData) => {
    // Crear un objeto con las propiedades que queremos actualizar
    const userData: Record<string, any> = {};
    
    if (data.email) userData.email = data.email;
    if (data.fullName) userData.fullName = data.fullName;
    if (data.phone) userData.phone = data.phone;
    if (data.password) userData.password = await bcrypt.hash(data.password, 10);
    
    return await prisma.user.update({
      where: { id },
      data: userData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        createdAt: true,
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  },
  
  delete: async (id: number) => {
    // Eliminar las relaciones de roles primero
    await prisma.userOnRole.deleteMany({
      where: { userId: id }
    });
    
    // Eliminar el usuario
    return await prisma.user.delete({
      where: { id }
    });
  },
  
  updateRoles: async (userId: number, roleIds: number[]) => {
    // Eliminar roles existentes
    await prisma.userOnRole.deleteMany({
      where: { userId }
    });
    
    // Asignar nuevos roles
    if (roleIds && roleIds.length > 0) {
      const roleConnections = roleIds.map(roleId => ({
        roleId,
        userId
      }));
      
      await prisma.userOnRole.createMany({
        data: roleConnections
      });
    }
    
    // Obtener el usuario actualizado con sus roles
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }
};

export default UserService; 