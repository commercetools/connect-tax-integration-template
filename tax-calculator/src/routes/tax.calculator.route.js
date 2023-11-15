import { Router } from 'express';

import { taxHandler } from '../controllers/tax.calculator.controller.js';

const syncRouter = Router();

// TODO: Give a specific route name
syncRouter.post('/', taxHandler);

export default syncRouter;
