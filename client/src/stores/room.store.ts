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
        userRooms: [],
        userMic: <boolean>true,
        joinRequestRoom: <IRoom>{},
        isSpeaking: false
    }),
    getters: {
        getActiveRoom: (state) => state.activeRoom,
        getParticipants: (state) => state.activeRoom.participants,
        getMicState: (state) => state.userMic,
        getJoinRequestRoom: (state) => state.joinRequestRoom,
        getSpeakingStatus: (state) => state.isSpeaking
    },
    actions: {
        setActiveRoom(room: IRoom) {
            this.activeRoom = room;
        },

        setMicState(isOn: true) {
            this.userMic = isOn
        },

        resetActiveRoom() {
            this.activeRoom = <IRoom>{}
        },

        setIsSpeakingStatus(status: boolean) {
            this.isSpeaking = status
        },

        addParticipant(participant: IUser | ITempUser) {
            this.activeRoom.participants.push(participant)
        },

        deleteParticipant(onlineId: string) {
            this.activeRoom.participants = this.activeRoom.participants.filter(((participant) => participant.onlineId !== onlineId)) as any
        },

        async fetchRoom(link: string) {
            const resp = await axios.get(`${serverUrl}/rooms/active/${link}`)
            this.joinRequestRoom = resp.data
        },

        async createRoom() {
            const userStore = useUserStore()
            const resp = await axios.post(`${serverUrl}/rooms/create`, {onlineId: userStore.getUser.onlineId})
            if (resp.data) {
                console.log(resp.data)
                this.setActiveRoom(resp.data)
                await router.push({name: 'room', params: {link: this.activeRoom.link}})
            }

        },

        joinRoom(room: string) {
            const userStore = useUserStore()
            const user = userStore.getUser
            const onlineId = user.onlineId
            if ("displayName" in user) {
                socket.emit("joinRoom", {room, userOnlineId: onlineId, displayName: user.displayName});
            } else {
                socket.emit("joinRoom", {room, userOnlineId: onlineId});
            }
        },

        leaveRoom() {
            const userStore = useUserStore()
            const user = userStore.getUser
            const onlineId = user.onlineId
            socket.emit("leaveRoom", {room: this.activeRoom.link, userOnlineId: onlineId})
        },

        changeOwner(link: string, newOwnerOnlineId: string) {
            socket.emit("changeOwner", {room: link, newOwnerOnlineId})
        },

        roomSocketListeners() {
            const userStore = useUserStore()

            socket.on("SomeoneJoined", (body: { room: IRoom, user: IUser | ITempUser }) => {
                console.log("someone joined", body)
                if (body.room.link)
                    this.setActiveRoom(body.room)
            });

            socket.on("SomeoneLeft", async (user: IUser | ITempUser) => {
                if (user.onlineId === userStore.getUser.onlineId) {
                    this.resetActiveRoom()
                    await router.replace({name: 'home'})
                } else {
                    this.deleteParticipant(user.onlineId)
                }
            })

            socket.on("RoomClosed", async () => {
                this.resetActiveRoom()
                await router.replace({name: 'home'})
            })

        },
    },
});
