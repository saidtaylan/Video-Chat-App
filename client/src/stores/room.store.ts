import {defineStore} from "pinia";
import {useUserStore} from "./user.store";
import {socket} from "@/utils/socketio";
import {MainServerAxios as axios} from "../utils/appAxios"
import type {Socket} from "socket.io-client"
import router from "@/router/index"
import {useCommonStore} from "@/stores/common.store";

const serverUrl = import.meta.env.VITE_SERVER_URL
const baseUrl = import.meta.env.VITE_BASE_URL
export const useRoomStore = defineStore({
    id: "room",
    state: () => ({
        activeRoom: <IRoom>{},
        userRooms: [],
        joinRequestRoom: <IRoom>{},
        isSpeaking: false
    }),
    getters: {
        getActiveRoom: (state) => state.activeRoom,
        getParticipants: (state) => state.activeRoom.participants,
        getJoinRequestRoom: (state) => state.joinRequestRoom,
        getSpeakingStatus: (state) => state.isSpeaking,
        getOwner: (state) => state.activeRoom.owner
    },
    actions: {
        setActiveRoom(room: IRoom) {
            this.activeRoom = room;
        },

        resetActiveRoom() {
            this.activeRoom = <IRoom>{}
        },

        setIsSpeakingStatus(status: boolean) {
            this.isSpeaking = status
        },

        addParticipant(participant: IParticipant | ITempParticipant) {
            this.activeRoom.participants.push(participant)
        },

        deleteParticipant(onlineId: string) {
            this.activeRoom.participants = this.activeRoom.participants.filter(((participant) => participant.onlineId !== onlineId)) as any
        },

        async fetchRoom(link: string) {
            const resp = await axios.get(`http://137.184.118.101/rooms/active/${link}`)
            this.joinRequestRoom = resp.data
        },

        async createRoom() {
            const userStore = useUserStore()
            const resp = await axios.post(`http://137.184.118.101/rooms/create`, {onlineId: userStore.getUser.onlineId})
            if (resp.data) {
                this.setActiveRoom(resp.data)
                await router.push({name: 'room', params: {link: this.activeRoom.link}})
            }
        },

        joinRoom(room: string) {
            const userStore = useUserStore()
            const user = userStore.getUser
            if (window.localStorage.getItem("inMeeting") === user._id) {
                return router.replace({name: 'home'})
            }
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

        addStreamId(streamId: string) {
            const userStore = useUserStore()
            socket.emit("dispatchStreamId", {
                link: this.getActiveRoom.link,
                onlineId: userStore.getUser.onlineId,
                streamId
            })
        },

        getParticipantByStreamId(streamId: string) {
            return this.getActiveRoom.participants.find(p => p.streamId === streamId)
        },

        switchUserMic(userSocketId: string, status: boolean) {
            socket.emit("switchUserMic", {userSocketId, switch: status})
        },

        switchUserCam(userSocketId: string, status: boolean) {
            socket.emit("switchUserCam", {userSocketId, switch: status})
        },

        roomSocketListeners() {
            const userStore = useUserStore()
            const commonStore = useCommonStore()
            socket.on("SomeoneJoined", (body: { room: IRoom, user: IParticipant | ITempParticipant }) => {
                if (body.room.link) {
                    this.setActiveRoom(body.room)
                    if (this.getActiveRoom && "_id" in userStore.getUser) {
                        window.localStorage.setItem("inMeeting", userStore.getUser._id)
                    }
                }
            });

            socket.on("SomeoneLeft", async (user: IParticipant | ITempParticipant) => {
                if (user.onlineId === userStore.getUser.onlineId) {
                    this.resetActiveRoom()
                } else {
                    this.deleteParticipant(user.onlineId)
                }
                if ("_id" in userStore.getUser) {
                    if (window.localStorage.getItem("inMeeting") === userStore.getUser._id) {
                        window.localStorage.removeItem("inMeeting")
                    }
                }
            })

            socket.on("RoomClosed", async () => {
                this.resetActiveRoom()
                await router.replace({name: 'home'})
            })

            socket.on("AddedStreamId", (room: IRoom) => {
                this.setActiveRoom(room)
            })

            socket.on("YourMicSwitched", (body: { status: boolean }) => {
                commonStore.setMicState(body.status)
                commonStore.getMicStateFunc(body.status)
            })

            socket.on("YourCameraSwitched", (body: { status: boolean }) => {
                console.log("came emit", body)
                commonStore.setCameraState(body.status)
                commonStore.getCameraStateFunc(body.status)
            })

            socket.on("OwnerChanged", (body: { newOwner: IParticipant | ITempParticipant }) => {
                this.getActiveRoom.owner = body.newOwner
            })
        },
    },
});
