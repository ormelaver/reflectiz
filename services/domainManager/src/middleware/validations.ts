import { body, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const bodyValidations = [
  body('domainName')
    .exists()
    .withMessage('domainName is required')
    .isFQDN()
    .withMessage('Invalid domain format')
    .bail()
    .custom((value) => {
      if (value.startsWith('www.')) {
        throw new Error('Domain should not start with "www."');
      }
      return true;
    }),
];

export const paramValidations = [
  param('domainName')
    .exists()
    .withMessage('domainName is required')
    .isFQDN()
    .withMessage('Invalid domain format')
    .bail()
    .custom((value) => {
      if (value.startsWith('www.')) {
        throw new Error('Domain should not start with "www."');
      }
      return true;
    }),
];
