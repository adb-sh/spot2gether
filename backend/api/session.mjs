import { SessionStore } from "../db/schemas.mjs";

export const applySessionRoutes = (router) => {

  router.post('/session', async (req, res) => {
    const user = res.locals.user;
    if (await SessionStore.findOne().bySpotifyId(user.id)) {
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
    const sessionStore = await SessionStore.findOne().byHostSpotifyId(user.id);

    if (!sessionStore) {
      res.status(404);
      res.send('you are not hosting a session');
      return;
    }

    res.status(200);
    res.send({ session: sessionStore });
  });

  router.delete('/session', async (req, res) => {
    const user = res.locals.user;
    const sessionStore = await SessionStore.findOne().byHostSpotifyId(user.id);

    if (!sessionStore) {
      res.status(404);
      res.send('you are not hosting a session');
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
    const { hostId } = req.body.hostId;
    const user = await res.locals.user;
    if (await SessionStore.findOne().bySpotifyId(user.id)) {
      res.status(400);
      res.send({ message: 'you are already in a session' });
      return;
    }
    const sessionStore = SessionStore.findOne().byHostSpotifyId(hostId);
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
    const user = await res.locals.user;
    const sessionStore = SessionStore.findOne().byClientSpotifyId(user.id);
    if (!sessionStore) {
      res.status(400);
      res.send({ message: 'you are not a client of any session' });
      return;
    }

    sessionStore.clients = sessionStore.clients.filter(client => client.id !== user.id);
    await sessionStore.save();

    res.status(200);
    res.send({ message: 'you left' });
  });

};
