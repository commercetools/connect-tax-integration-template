import { Router } from 'express';

import { taxHandler } from '../controllers/tax.calculator.controller.js';

const taxCalculatorRouter = Router();

taxCalculatorRouter.post('/taxCalculator', taxHandler);

export default taxCalculatorRouter;
