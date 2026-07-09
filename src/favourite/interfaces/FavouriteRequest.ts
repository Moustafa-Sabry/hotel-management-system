import { Request } from 'express';

export interface FavouriteRequest extends Request {
  user: {
    _id: string;
  };
}