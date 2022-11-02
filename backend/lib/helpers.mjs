import { Client, Player } from "spotify-api.js";
import { store } from "../store.mjs";
import { UserStore } from "../db/schemas.mjs";

export const createLocalUser = async ({ refreshToken = undefined, code = undefined }, retry = 4) => {
  try {
    const client = await Client.create({
      refreshToken: true,
      retryOnRateLimit: true,
      token: {
        clientID: store.clientID,
        clientSecret: store.clientSecret,
        redirectURL: store.redirectURL,
        refreshToken,
        code,
      },
      async onRefresh() {
        await UserStore.findOneAndUpdate(
          { 'spotify.userId': client.user.id },
          { 'spotify.refreshToken': client.refreshMeta.refreshToken },
        );
      },
    });
    const player = new Player(client);
    return { client, player };
  } catch (e) {
    if (retry-- < 1) throw e;
    if (e.response.data.status === 503) await new Promise(_ => setTimeout(_, 500));
    else throw e;
    return await createLocalUser({ refreshToken, code }, retry);
  }
};

export const findUserBySpotifyId = async (
  { userId, refreshToken },
  { create = false } = {},
) => {
  const user = store.users.find(user => user.client.user.id === userId);
  if (user) return user;
  if (!create) return null;
  const newUser = await createLocalUser({ refreshToken });
  store.users.push(newUser);
  return newUser;
};
