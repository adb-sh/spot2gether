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
    byHostSpotifyId(id) {
      return this.where({ 'host.spotify.userId': id });
    },
    byClientSpotifyId(id) {
      return this.where({ 'clients.userId': id });
    },
    bySpotifyId(id) {
      return this.where({ '$or': [
        { 'host.spotify.userId': id },
        { 'clients.spotify.userId': id },
      ]});
    },
  },
});

export const UserStore = model('User', userSchema);
export const SessionStore = model('Session', sessionSchema);
