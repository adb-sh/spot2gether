import { SessionStore } from "./db/schemas.mjs";

setInterval(async () => {
  await syncAllSessions();
}, 1000);

const syncAllSessions = async () => {
  const sessions = await SessionStore.find();
  await Promise.all([...sessions].map(syncSession));
};

const syncSession = async session => {
  const host = await session.host.spotify.local;
  const hostCP = await host.player.getCurrentlyPlaying("track");
  await Promise.all([...session.clients].map(async clientStore => {
    const client = await clientStore.spotify.client.local;
    const clientCP = client.player.getCurrentlyPlaying();
    if (clientCP.item?.id !== hostCP.item?.id)
      await client.player.play({
        uris: [ hostCP.item?.uri ],
        position: hostCP.progress,
      });
    else if (Math.abs(clientCP.progress - hostCP.progress) > 1000)
      await client.player.seek(hostCP.progress);
  }));
};
