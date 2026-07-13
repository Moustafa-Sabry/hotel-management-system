import { Request } from 'express';
import { UserDocument } from '../../schemas/user.schema';

export interface AuthenticatedRequest extends Request {
  user: UserDocument;
}
