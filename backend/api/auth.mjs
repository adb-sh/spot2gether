import spotifyApi from "spotify-api.js";
const { Client, Player } = spotifyApi;
import { store } from "../store.mjs";
import { randomString } from "../lib/randomString.js";
import axios from "axios";

export const applyAuthRoutes = (router) => {

  router.post('/', async (req, res) => {
    if (!req.body.code || !req.body.state) {
      res.status(400);
      res.send({ message: 'code or state missing ' });
      return;
    }
    const { code, state } = req.body;
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', store.redirectURL);

      const config = {
        headers: {
          'Authorization': 'Basic ' + (new Buffer(store.clientID + ':' + store.clientSecret).toString('base64')),
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      };

      const tokens = (await axios.post('https://accounts.spotify.com/api/token', params, config))?.data;

      const newClient = await Client.create({
        refreshToken: true,
        retryOnRateLimit: true,
        token: {
          clientID: store.clientID,
          clientSecret: store.clientSecret,
          redirectURL: store.redirectURL,
          refreshToken: tokens.refresh_token,
        },
      });
      const player = new Player(newClient);
      const accessToken = randomString(64);
      const user = store.users.find(({ client }) => client.user.id === newClient.user.id);
      if (user) {
        user.client = newClient;
        user.player = player;
        user.accessToken = accessToken;
      } else {
        store.users.push({ client: newClient, player, accessToken, listeners: [], role: 'none' });
      }
      res.status(200);
      res.send({ message: 'authorized', accessToken });
    } catch (e) {
      console.log(e.message);
      res.status(500);
      res.send({ message: 'unauthorized' });
    }
  });

};
