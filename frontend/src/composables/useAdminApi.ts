import { getCurrentInstance } from "vue";

export const useAdminApi = () => {
  const vm = getCurrentInstance();
  return vm?.appContext.config.globalProperties.$adminApi;
};
