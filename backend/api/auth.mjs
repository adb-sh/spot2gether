import { store } from "../store.mjs";
import { randomString } from "../lib/randomString.mjs";
import { SessionStore, UserStore } from "../db/schemas.mjs";
import { createLocalUser, findUserBySpotifyId } from "../lib/helpers.mjs";

export const applyAuthRoutes = (router) => {

  router.post('/', async (req, res) => {
    if (!req.body.code || !req.body.state) {
      res.status(400);
      res.send({ message: 'code or state missing ' });
      return;
    }
    const { code, state } = req.body;
    try {
      const newUser = await createLocalUser({ code });
      const user = await findUserBySpotifyId({ userId: newUser.client.user.id });

      if (user) {
        user.client = newUser.client;
        user.player = newUser.client;
      } else {
        store.users.push(newUser);
      }

      const accessToken = randomString(64);

      const userStore = await UserStore.findOneAndUpdate(
        { 'spotify.userId': newUser.client.user.id },
        {
          accessToken,
          spotify: {
            refreshToken: newUser.client.refreshMeta.refreshToken,
            userId: newUser.client.user.id,
            local: true,
          },
        },
        { upsert: true },
      );

      res.status(200);
      res.send({ message: 'authorized', accessToken });
    } catch (e) {
      console.log(e);
      res.status(500);
      res.send({ message: 'unauthorized' });
    }
  });

};
