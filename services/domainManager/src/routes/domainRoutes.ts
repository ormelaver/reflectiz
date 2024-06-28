import { Router } from 'express';
import DomainController from '../controllers/domainManagerController';
import {
  bodyValidations,
  paramValidations,
  validateRequest,
} from '../middleware/validations';

const router = Router();

router.post(
  '/domains/add',
  bodyValidations,
  validateRequest,
  DomainController.addDomain
);
router.get(
  '/domains/:domainName',
  paramValidations,
  validateRequest,
  DomainController.getDomainInfo
);

export default router;
