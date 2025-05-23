import { Request, Response, NextFunction } from 'express';
import UserService from '@/services/user.service';
import { AppError } from '@/errors';

const UserController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserService.getAll();
      res.json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  },
  
  getUserById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await UserService.getById(Number(id));
      
      if (!user) {
        throw new AppError('NOT_FOUND', ['Usuario no encontrado']);
      }
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  },
  
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, fullName, phone, roleIds } = req.body;
      
      // Verificar si el usuario ya existe (esto podría moverse al servicio)
      const existingUser = await UserService.getAll().then(
        users => users.find(user => user.email === email)
      );
      
      if (existingUser) {
        throw new AppError('VALIDATION_ERROR', ['El email ya está registrado']);
      }
      
      const userData = { email, password, fullName, phone };
      const newUser = await UserService.create(userData, roleIds);
      
      res.status(201).json({ success: true, data: newUser });
    } catch (error) {
      next(error);
    }
  },
  
  updateUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { email, fullName, phone, password } = req.body;
      
      const userData = { email, fullName, phone, password };
      const updatedUser = await UserService.update(Number(id), userData);
      
      res.json({ success: true, data: updatedUser });
    } catch (error) {
      next(error);
    }
  },
  
  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await UserService.delete(Number(id));
      
      res.json({ success: true, message: 'Usuario eliminado correctamente' });
    } catch (error) {
      next(error);
    }
  },
  
  // Método adicional para gestionar roles
  updateUserRoles: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { roleIds } = req.body;
      
      const user = await UserService.updateRoles(Number(id), roleIds);
      
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }
};

export default UserController; 