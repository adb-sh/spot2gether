import { getUserResource } from "./user.mjs";
import { UserStore } from "../db/schemas.mjs";

export const getSessionResource = async sessionStore => {
  return {
    id: sessionStore._id,
    host: await getUserResource(
      await UserStore.findOne().bySpotifyId(sessionStore.host.spotify.userId)
    ),
    clients: await Promise.all([...sessionStore.clients]
      .map(async client => await getUserResource(
        await UserStore.findById(client._id)
      ))),
  };
};