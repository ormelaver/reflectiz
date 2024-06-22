import { Router } from 'express';
import DomainController from '../controllers/domainManagerController';

const router = Router();

router.post('/domains', DomainController.addDomain);
// router.get('/domains/:domainName', DomainController.getDomainInfo);

export default router;
