import { Response } from 'express';
import { AuthRequest } from '../types';
import { userService } from '../services/user.service';
import { IdParamDto } from '../dto/auth.dto';

export class UserController {
  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    const user = await userService.getById(id);
    res.status(200).json(user);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    await userService.delete(req.userId!, id);
    res.status(200).json({ message: 'User deleted successfully' });
  }

  async promoteSelfToAdmin(req: AuthRequest, res: Response): Promise<void> {
    const user = await userService.promoteSelfToAdmin(req.userId!);
    res.status(200).json(user);
  }
}
