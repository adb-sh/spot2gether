import mongoose, { model } from "mongoose";
const { Schema } = mongoose;
import { findUserBySpotifyId } from "../lib/helpers.mjs";

const userSchema = new Schema({
  accessToken: String,
  role: String,
  spotify: {
    refreshToken: String,
    userId: String,
    local: {
      type: Boolean,
      async get(local) {
        if (!local) return false;
        return await findUserBySpotifyId({
          userId: this.spotify.userId,
          refreshToken: this.spotify.refreshToken,
        }, { create: true });
      },
    },
  },
}, {
  query: {
    bySpotifyId(id) {
      return this.where({ 'spotify.userId': id });
    },
    byAccessToken(accessToken) {
      return this.where({ accessToken });
    },
  },
});

const sessionSchema = new Schema({
  host: userSchema,
  clients: Array,
  queue: Array,
}, {
  query: {
    async byHostSpotifyId(id) {
      const _id = (await UserStore.findOne().bySpotifyId(id))._id;
      return this.where({ 'host._id': _id });
    },
    async byClientSpotifyId(id) {
      const _id = (await UserStore.findOne().bySpotifyId(id))._id;
      return this.where({ 'clients._id': _id });
    },
    async bySpotifyId(id) {
      const _id = (await UserStore.findOne().bySpotifyId(id))._id;
      return this.where({ '$or': [
        { 'host._id': _id },
        { 'clients._id': _id },
      ]});
    },
  },
});

export const UserStore = model('User', userSchema);
export const SessionStore = model('Session', sessionSchema);
