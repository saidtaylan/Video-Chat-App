import {defineStore} from "pinia";
import {useUserStore} from "./user.store";
import {socket} from "@/utils/socketio";
import {MainServerAxios as axios} from "../utils/appAxios"
import type {Socket} from "socket.io-client"
import router from "@/router/index"

const serverUrl = import.meta.env.VITE_SERVER_URL
const baseUrl = import.meta.env.VITE_BASE_URL
export const useRoomStore = defineStore({
    id: "room",
    state: () => ({
        activeRoom: <IRoom>{},
        userRooms: []
    }),
    getters: {
        getActiveRoom: (state) => state.activeRoom,
        getParticipants: (state) => state.activeRoom.participants
    },
    actions: {
        setActiveRoom(room: IRoom) {
            this.activeRoom = room;
        },

        resetActiveRoom() {
            this.activeRoom = <IRoom>{}
        },

        addParticipant(participant: IUser | ITempUser) {
            this.activeRoom.participants.push(participant)
        },

        deleteParticipant(onlineId: string) {
            this.activeRoom.participants = this.activeRoom.participants.filter(((participant) => participant.onlineId !== onlineId)) as any
        },

        async createRoom() {
            const userStore = useUserStore()
            if ("displayName" in userStore.getUser) {
                // resp.data = user data
                const resp = await axios.post(`${serverUrl}/rooms/create?display-name=${userStore.getUser.displayName}`, {onlineId: userStore.getUser.onlineId})
                if (resp.data) {
                    this.setActiveRoom(resp.data)
                    await router.push({name: 'room', params: {link: this.activeRoom.link}})
                }
            } else if (userStore.getUser._id) {
                const resp = await axios.post(`${serverUrl}/rooms/create`, {onlineI: userStore.getUser.onlineId})
                if (resp.data) {
                    this.activeRoom = resp.data
                }
            } else {
                throw new Error("Could not send create query")
            }
        },

        async joinRoom(room: string) {
            const userStore = useUserStore()
            const user = userStore.getUser
            const onlineId = user.onlineId
            if ("displayName" in user) {
                socket.emit("joinRoom", {room, userOnlineId: onlineId, displayName: user.displayName});
            } else {
                socket.emit("joinRoom", {room, userOnlineId: onlineId});
            }
        },

        async leaveRoom(socket: Socket, room: string, tempUserId?: string) {
            const userStore = useUserStore()
        },

        roomSocketListeners() {
            socket.on("SomeoneJoined", (body: { room: IRoom, user: IUser | ITempUser }) => {
                const userStore = useUserStore()
                this.setActiveRoom(body.room)
            });

            socket.on("SomeoneLeft", (user: IUser | ITempUser) => {
                console.log(user)
                const userStore = useUserStore()
                if (user.onlineId === userStore.getUser.onlineId) {
                    this.resetActiveRoom()
                } else {
                    this.deleteParticipant(user.onlineId)
                }
            })

            socket.on("RoomClosed", () => {
                this.resetActiveRoom()

            })

        },
    },
});
