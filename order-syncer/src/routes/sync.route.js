import { Router } from 'express';

import { syncHandler } from '../controllers/sync.controller.js';

const syncRouter = Router();

syncRouter.post('/orderSyncer', syncHandler);

export default syncRouter;
