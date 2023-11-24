import { useApi } from "@/Api";
import type {
  NavigationGuardNext,
  RouteLocationNormalized,
  Router,
} from "vue-router";

type Context = {
  from: RouteLocationNormalized;
  to: RouteLocationNormalized;
  next: NavigationGuardNext;
  router: Router;
};

export const auth = ({ next }: Context) => {
  if (!useApi()?.isAuthorized()) next({ name: "auth" });
  else next();
};
