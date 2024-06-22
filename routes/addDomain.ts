import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

import { Domain } from '../models/domain';
import { DomainManager } from '../services/DomainManager';

const router = express.Router();

router.post(
  '/api/domains/add',
  [
    body('domainName').not().isEmpty().withMessage('user id must be provided'),
    body('domainName')
      .isFQDN()
      .withMessage('domain name must be a fully qualified domain name')
      .custom((value) => {
        if (value.startsWith('www.')) {
          throw new Error(
            'This system only supports root domain names, please remove www. from the domain name'
          );
        }
        return true;
      }),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const domainManager = new DomainManager();
      domainManager.addDomain(req.body);
      //do this with the Domain Manager

      res
        .status(200)
        .json({ message: 'Domain added successfully', domain: req.body });
    } catch (error: any) {
      res.status(400).send(error.message);
    }
  }
);

export { router as addDomainRouter };
