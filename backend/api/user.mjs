import { store } from "../store.mjs";
import { UserStore } from "../db/schemas.mjs";

export const applyUserRoutes = (router) => {

  applyUserRoutesPublic(router);

  router.post('/user/joinSession', async (req, res) => {
    if (!req.body?.userId) {
      res.status(400);
      res.send({ message: 'userId is undefined' });
      return;
    }
    const { userId } = req.body.userId;
    if (res.locals.user.role === 'host') {
      res.status(400);
      res.send({ message: 'user is host' });
      return;
    }
    const host = store.users.find(({ client }) => client.user.id === userId)
    host.listeners.push(res.locals.user);
    res.locals.user.role = 'listener';
    res.locals.user.listeningTo = host;
    res.status(200);
    res.send({ message: 'joined' });
  });

  router.delete('/user/leaveSession', async (req, res) => {
    if (res.locals.user.role === 'host') {
      res.status(400);
      res.send({ message: 'user is host' });
      return;
    }
    const host = store.users.find(({ client }) => client.user.id === userId)
    host.listeners.push(res.locals.user);
    res.locals.user.role = 'none';
    res.locals.user.listeningTo.listeners = res.locals.user.listeningTo.listeners.filter(
      ({ client }) => client.user.id !== res.locals.user.client.user.id
    );
    res.locals.user.listeningTo = null;
    res.status(200);
    res.send({ message: 'left' });
  });

  router.get('/user/currentlyPlaying', async (req, res) => {
    const currentlyPlaying = await (await res.locals.user.spotify.local)?.player?.getCurrentlyPlaying('track');
    res.status(200);
    res.send({ currentlyPlaying });
  });

  router.get('/user/role', (req, res) => {
    res.status(200);
    res.send({ role: res.locals.user?.role });
  });

  /*router.post('/user/role', async (req, res) => {
    if (
      req.body.role !== 'host' ||
      req.body.role !== 'listener' ||
      req.body.role !== 'none'
    ) {
      res.status(400);
      res.send({ message: 'role value is invalid' });
    }
    const { role } = req.body;
    try {
      res.locals.user.listeners = [];
      res.locals.user.role = role;
      res.status(200);
      res.send({ role });
    } catch (e) {
      res.status(500);
      res.send({ message: 'server error' });
    }
  });*/

};

export const applyUserRoutesPublic = (router) => {

  router.get('/users/:userId/info', async (req, res) => {
    if (!req.params.userId) {
      res.status(400);
      res.send({ message: 'userId is missing' });
    }
    const { userId } = req.params;
    const hostDB = await UserStore.findOne().bySpotifyId(userId);
    if (!hostDB) {
      res.status(400);
      res.send({ message: 'user is not registered' });
      return;
    }
    const host = await hostDB?.spotify?.local;
    if (!host.player) {
      res.status(500);
      res.send({ message: 'user is outdated' });
      return;
    }
    try {
      const currentlyPlaying = await host.player.getCurrentlyPlaying('track');
      res.status(200);
      res.send({
        currentlyPlaying,
        user: {
          displayName: host.client.user.displayName,
          totalFollowers: host.client.user.totalFollowers,
          images: host.client.user.images,
        },
      });
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ message: 'server error' });
    }
  });

};
