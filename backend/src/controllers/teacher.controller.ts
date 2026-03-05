import { Response } from 'express';
import { AuthRequest } from '../types';
import { teacherService } from '../services/teacher.service';
import { IdParamDto } from '../dto/auth.dto';

export class TeacherController {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    const teachers = await teacherService.getAll();
    res.status(200).json(teachers);
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    const teacher = await teacherService.getById(id);
    res.status(200).json(teacher);
  }
}
