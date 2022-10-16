import { applyUserRoutes, applyUserRoutesPublic } from "./user.mjs";
import { applySessionRoutes } from "./session.mjs";

export const applyApiRoutes = (router) => {

  router.get('/test', (req, res) => {
    res.status(200);
    res.send({ message: 'connection is working' });
  });

  applyUserRoutes(router);
  applySessionRoutes(router);

};

export const applyPublicRoutes = (router) => {

  applyUserRoutesPublic(router);

};
