import { Router } from 'express';

import { syncHandler } from '../controllers/sync.controller.js';

const syncRouter = Router();

// TODO: Give a specific route name
syncRouter.post('/', syncHandler);

export default syncRouter;
