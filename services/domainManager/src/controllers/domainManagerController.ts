// services/domain-service/src/controllers/domainController.ts
import { Request, Response } from 'express';
import DomainManagerService from '../services/domainManagerService';

class DomainManagerController {
  async addDomain(req: Request, res: Response): Promise<void> {
    try {
      const domainName = req.body.domainName;
      const newDomain = await DomainManagerService.addDomain(
        domainName.toLowerCase()
      );
      res
        .status(201)
        .json({ message: 'Domain added for scanning', data: newDomain });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  public async getDomainInfo(req: Request, res: Response): Promise<void> {
    try {
      const domainName = req.params.domainName;
      const domainInfo = await DomainManagerService.getDomainInfo(
        domainName.toLowerCase()
      );
      if (!domainInfo) {
        res.status(202).json({
          message: 'Domain added for analysis. Please check back later.',
        });
      } else {
        res
          .status(200)
          .json({ message: 'Domain info found', data: domainInfo });
      }
    } catch (error) {
      res.status(500).json({
        error: 'An error occurred while retrieving domain information.',
      });
    }
  }
}

export default new DomainManagerController();
