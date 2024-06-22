// services/domain-service/src/controllers/domainController.ts
import { Request, Response } from 'express';
import DomainManagerService from '../services/domainManagerService';

class DomainManagerController {
  async addDomain(req: Request, res: Response): Promise<void> {
    try {
      const domainName = req.body.domainName;
      // const domainService = await DomainManagerService.init();
      const newDomain = await DomainManagerService.addDomain(
        domainName.toLowerCase()
      );
      res.status(201).json(newDomain);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // async getDomainInfo(req: Request, res: Response): Promise<void> {
  //   try {
  //     const domainName = req.params.domainName;
  //     const domainInfo = await DomainManagerService.getDomainInfo(
  //       domainName.toLowerCase()
  //     );
  //     if (!domainInfo) {
  //       await DomainManagerService.addDomain(domainName);
  //       res.status(202).json({
  //         message: 'Domain added for analysis. Please check back later.',
  //       });
  //     } else {
  //       res.json(domainInfo);
  //     }
  //   } catch (error) {
  //     res.status(500).json({
  //       error: 'An error occurred while retrieving domain information.',
  //     });
  //   }
  // }
}

export default new DomainManagerController();
