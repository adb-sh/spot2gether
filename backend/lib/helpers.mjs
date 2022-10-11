import { Client, Player } from "spotify-api.js";
import { store } from "../store.mjs";
import { UserStore } from "../db/schemas.mjs";

export const createLocalUser = async ({ refreshToken = undefined, code = undefined }) => {
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
}
