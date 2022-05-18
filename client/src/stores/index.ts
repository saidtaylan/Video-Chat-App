import { defineStore } from "pinia";
import { MainServerAxios } from "@/utils/appAxios";

export const UserStore = defineStore({
  id: "main",
  state: () => ({
    user: {},
    activeRoom: {}
  }),
  getters: {
    getUser: (state) => state.user,
    getACtiveRoom: (state) => state.activeRoom
  },
  actions: {
    setUser(user: IUser) {
      this.user = user;
    },
    setActiveRoom(room: IRoom) {
      this.activeRoom = room
    },

    async fetchUser(id: string, userToken: string) {
      const user = await MainServerAxios.get(
        `${process.env.MAIN_SERVER_BASE_URL}/users`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      console.log("user :>> ", user);
      return user;
    },

    async joinRoom(link: string, userToken?: string, displayName?: string) {
      let room: IRoom
      if (userToken) {
        room = await MainServerAxios.get(
          `${process.env.MAIN_SERVER_BASE_URL}/rooms/${link}`,
          { headers: { Authhorization: `Bearer ${userToken}` } }
        );
      } else {
        room = await MainServerAxios.get(
          `${process.env.MAIN_SERVER_BASE_URL}/rooms/${link}?display-name=${displayName}`
        );
      }
      if (room) {
        this.setActiveRoom(room);
      }
    },

    async leaveRoom(link: string, userID: string) {
      
    }
  },
});
