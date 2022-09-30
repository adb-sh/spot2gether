import { applyUserRoutes, applyUserRoutesPublic } from "./user.mjs";

export const applyApiRoutes = (router) => {

  router.get('/test', (req, res) => {
    res.status(200);
    res.send({ message: 'connection is working' });
  });

  applyUserRoutes(router);

};

export const applyPublicRoutes = (router) => {

  applyUserRoutesPublic(router);

};
