import * as personal from '~/api/account';
import {RoleEnum} from "~/enums/permission";

interface UserState {
  accessToken: string,
  user: object,
  roles: string[],
}

const user = {
  namespaced: true,
  state: {
    accessToken: undefined,
    user: undefined,
    roles: [],
  },
  mutations: {
    setAccessToken: (state, accessToken: string) => {
      state.accessToken = accessToken;
    },
    setUser: (state, user: object | null) => {
      state.user = user;
    },
    setRoles: (state, roles: string[]) => {
      state.roles = roles;
    },
  },
  actions: {
    async login({commit}, params) {
      const {data: {data}} = await personal.login(params);
      commit('setAccessToken', data.access_token);
      return data;
    },
    async logout({commit}) {
      await personal.logout();
      commit('setAccessToken', undefined);
      commit('setUser', undefined);
    },
    async getUserInfo({commit}) {
      const {data: {data: {roles, ...user}}} = await personal.info();
      commit('setUser', user);
      commit('setRoles', roles.map(item => item.name));
      return user;
    },
    setToken({commit},token){
      commit('setAccessToken', token);
    },
    async setRoles({commit}, roles: RoleEnum[]) {
      commit('setRoles', roles);
    }
  }
};
export default user;
