import { SessionStore, UserStore } from "../db/schemas.mjs";
import { getUserResource } from "../resources/user.mjs";

export const applyUserRoutes = (router) => {

  applyUserRoutesPublic(router);

  router.get('/me/currentlyPlaying', async (req, res) => {
    const userLocal = await res.locals.user.spotify.local;
    if (!userLocal.player) {
      res.status(500);
      res.send({ message: 'player is unavailable' });
    }
    const currentlyPlaying = await userLocal.player.getCurrentlyPlaying('track');
    res.status(200);
    res.send({ currentlyPlaying });
  });

  router.get('/me', async (req, res) => {
    const user = await getUserResource(res.locals.user);
  });

};

export const applyUserRoutesPublic = (router) => {

  router.get('/users/:userId/info', async (req, res) => {
    if (!req.params.userId) {
      res.status(400);
      res.send({ message: 'userId is missing' });
    }
    const { userId } = req.params;
    const userStore = await UserStore.findOne().bySpotifyId(userId);
    if (!userStore) {
      res.status(400);
      res.send({ message: 'user is not registered' });
      return;
    }
    const host = await userStore?.spotify?.local;
    try {
      const currentlyPlaying = await host.player.getCurrentlyPlaying('track');
      res.status(200);
      res.send({
        currentlyPlaying,
        user: await getUserResource(userStore),
      });
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ message: 'server error' });
    }
  });

};
