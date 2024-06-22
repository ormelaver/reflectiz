import express, { Request, Response } from 'express';
import { param, validationResult } from 'express-validator';

const router = express.Router();

router.get(
  '/api/domains/:domainName',
  [
    param('domainName').exists().withMessage('domain name is required'),
    param('domainName').isString().withMessage('domain name must be a string'),
    param('domainName')
      .isFQDN()
      .withMessage('domain name must be a fully qualified domain name'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const message = JSON.stringify(req.body);
      res.status(200).send(message);
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
);

export { router as getDomainDataRouter };
