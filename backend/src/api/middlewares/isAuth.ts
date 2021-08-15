import { NextFunction, Request, Response } from 'express';
import HttpError from '../../etc/HttpError';

const isAuth = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorization = req.headers['authorization'];
      if (!authorization) {
        throw new HttpError(401, 'Connect your wallet first.');
      }

      // TODO verify wallet and save some info to control how many swaps a day is OK

      const wallet = authorization;
      req.body.wallet = wallet;

      next();
    } catch (error) {
      res.status(error.code ?? 500).send(error.message);
      return false;
    }
  };
};

export default isAuth;
