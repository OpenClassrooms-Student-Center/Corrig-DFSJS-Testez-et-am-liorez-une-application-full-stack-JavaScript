import { Response } from 'express';
import { AuthRequest } from '../types';
import { sessionService } from '../services/session.service';
import { CreateSessionDto, UpdateSessionDto, ParticipationParamDto } from '../dto/session.dto';
import { IdParamDto } from '../dto/auth.dto';

export class SessionController {
  async getAll(_req: AuthRequest, res: Response): Promise<void> {
    const sessions = await sessionService.getAll();
    res.status(200).json(sessions);
  }

  async getById(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    const session = await sessionService.getById(id);
    res.status(200).json(session);
  }

  async create(req: AuthRequest, res: Response): Promise<void> {
    const data = req.body as CreateSessionDto;
    const session = await sessionService.create(req.userId!, data);
    res.status(201).json(session);
  }

  async update(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    const data = req.body as UpdateSessionDto;
    const session = await sessionService.update(req.userId!, id, data);
    res.status(200).json(session);
  }

  async delete(req: AuthRequest, res: Response): Promise<void> {
    const { id } = req.params as unknown as IdParamDto;
    await sessionService.delete(req.userId!, id);
    res.status(200).json({ message: 'Session deleted successfully' });
  }

  async participate(req: AuthRequest, res: Response): Promise<void> {
    const { id, userId } = req.params as unknown as ParticipationParamDto;
    await sessionService.participate(id, userId);
    res.status(200).json({ message: 'Successfully joined the session' });
  }

  async unparticipate(req: AuthRequest, res: Response): Promise<void> {
    const { id, userId } = req.params as unknown as ParticipationParamDto;
    await sessionService.unparticipate(id, userId);
    res.status(200).json({ message: 'Successfully left the session' });
  }
}
