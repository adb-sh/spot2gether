export const getUserResource = async userStore => {
  const user = await userStore.spotify.local;
  return {
    id: user.client.user.id,
    displayName: user.client.user.displayName,
    totalFollowers: user.client.user.totalFollowers,
    images: user.client.user.images,
  };
};
