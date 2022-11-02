import { SessionStore, UserStore } from "./db/schemas.mjs";

export const syncAllSessions = async () => {
  const sessions = await SessionStore.find();
  await Promise.all([...sessions].map(syncSession));
};

export const syncSession = async sessionStore => {
  const hostStore = await UserStore.findById(sessionStore.host._id);
  const host = await hostStore.spotify.local;
  const hostCP = await host.player.getCurrentlyPlaying("track");
  await Promise.all([...sessionStore.clients].map(async client => {
    const clientStore = await UserStore.findById(client._id);
    const clientLocal = await clientStore.spotify.local;
    const clientCP = await clientLocal.player.getCurrentlyPlaying("track");
    if (clientCP?.item?.id !== hostCP?.item?.id) {
      await clientLocal.player.play({
        uris: [hostCP.item?.uri],
        position: hostCP.progress,
      });
    } else if (Math.abs(clientCP.progress - hostCP.progress) > 1000) {
      await clientLocal.player.seek(hostCP.progress);
    }
  }));
};
