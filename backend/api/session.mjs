import { SessionStore, UserStore } from "../db/schemas.mjs";
import { getSessionResource } from "../resources/session.mjs";

export const applySessionRoutes = (router) => {

  router.post('/session', async (req, res) => {
    const user = res.locals.user;
    if (await SessionStore.findOne().bySpotifyId(user.spotify.userId)) {
      res.status(400);
      res.send({ message: 'you are already in a session' });
      return;
    }
    const sessionStore = new SessionStore({
      host: user,
      clients: [],
    });
    await sessionStore.save();

    res.status(201);
    res.send({ message: 'created' });
  });

  router.get('/session', async (req, res) => {
    const user = res.locals.user;
    const sessionStore = await SessionStore.findOne().bySpotifyId(user.spotify.userId);

    if (!sessionStore) {
      res.status(404);
      res.send({ message: 'you are not hosting a session' });
      return;
    }

    const session = await getSessionResource(sessionStore);

    res.status(200);
    res.send({ session });
  });

  router.delete('/session', async (req, res) => {
    const user = res.locals.user;
    const sessionStore = await SessionStore.findOne().byHostSpotifyId(user.spotify.userId);

    if (!sessionStore) {
      res.status(404);
      res.send({ message: 'you are not hosting a session' });
      return;
    }

    await sessionStore.delete();

    res.status(204);
    res.send({ message: 'session deleted' });
  });

  router.post('/session/join', async (req, res) => {
    if (!req.body?.hostId) {
      res.status(400);
      res.send({ message: 'hostId is undefined' });
      return;
    }
    const { hostId } = req.body;
    const user = res.locals.user;
    if (await SessionStore.findOne().bySpotifyId(user.spotify.userId)) {
      res.status(400);
      res.send({ message: 'you are already in a session' });
      return;
    }
    const sessionStore = await SessionStore.findOne().byHostSpotifyId(hostId);
    if (!sessionStore) {
      res.status(400);
      res.send({ message: 'session does not exist' });
      return;
    }

    sessionStore.clients.push(user);
    await sessionStore.save();

    res.status(200);
    res.send({ message: 'you joined' });
  });

  router.post('/session/leave', async (req, res) => {
    const user = res.locals.user;
    const sessionStore = await SessionStore.findOne().byClientSpotifyId(user.spotify.userId);
    if (!sessionStore) {
      res.status(400);
      res.send({ message: 'you are not a client of any session' });
      return;
    }

    sessionStore.clients = sessionStore.clients.filter(client => client.spotify.userId !== user.spotify.userId);
    await sessionStore.save();

    res.status(201);
    res.send({ message: 'you left' });
  });

};
