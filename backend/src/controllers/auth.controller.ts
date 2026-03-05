import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginDto, RegisterDto } from '../dto/auth.dto';

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body as LoginDto;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  }

  async register(req: Request, res: Response): Promise<void> {
    const { email, password, firstName, lastName } = req.body as RegisterDto;
    const result = await authService.register(email, password, firstName, lastName);
    res.status(201).json(result);
  }
}
