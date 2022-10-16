import { store } from "../store.mjs";
import { SessionStore, UserStore } from "../db/schemas.mjs";

export const applyUserRoutes = (router) => {

  applyUserRoutesPublic(router);

  router.get('/me/currentlyPlaying', async (req, res) => {
    const currentlyPlaying = await (await res.locals.user.spotify.local)?.player?.getCurrentlyPlaying('track');
    res.status(200);
    res.send({ currentlyPlaying });
  });

  router.get('/me/role', (req, res) => {
    res.status(200);
    res.send({ role: res.locals.user?.role });
  });

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
