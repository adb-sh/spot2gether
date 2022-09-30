import express from "express";
import { auth } from "./middlewares/auth.mjs";

import { applyAuthRoutes } from "./api/auth.mjs";
import { applyApiRoutes, applyPublicRoutes } from "./api/index.mjs";

// express server
const port = 3000;
const app = express();

const router = express.Router();
const authRouter = express.Router();
const publicRouter = express.Router();

router.use(express.json());
authRouter.use(express.json());
publicRouter.use(express.json());

app
  .use('/api/v1', router)
  .use('/api/auth', authRouter)
  .use('/api/public', publicRouter);

applyAuthRoutes(authRouter);

router.use(auth);
applyApiRoutes(router);

applyPublicRoutes(publicRouter);

app.listen(port);
console.log('ready');
