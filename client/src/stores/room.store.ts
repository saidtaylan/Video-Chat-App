import {defineStore} from "pinia";
import {useUserStore} from "./user.store";
import {socket} from "@/utils/socketio";
import {MainServerAxios as axios} from "../utils/appAxios"
import type {Socket} from "socket.io-client"

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

        deleteParticipant(participantID: string) {
            this.activeRoom.participants = this.activeRoom.participants.filter(((participant) => participant._id !== participantID)) as any
        },

        async createRoom() {
            const userStore = useUserStore()
            console.log(userStore.getUser)
            if ("displayName" in userStore.getUser) {
                // resp.data = user data
                const resp = await axios.get(`${baseUrl}/rooms/create?display-name${userStore.getUser.displayName}`,)
                if (resp.data) {
                    this.activeRoom = resp.data
                }
            } else if (userStore.getUser._id) {
                const userToken = userStore.getUser.accessToken
                const resp = await axios.get(`${baseUrl}/rooms/create`, {headers: {'Authorization': `Bearer ${userToken}`}})
                if (resp.data) {
                    this.activeRoom = resp.data
                }
            }
            else {
                throw new Error("Could not send create query")
            }
        },

        // async joinRoom(socket: Socket,
        //                body: {
        //                    room: string,
        //                    tempUserDisplayName?: string
        //                }
        // ) {
        //     const userStore = useUserStore()
        //     const userToken = userStore.getUser
        //     if (userToken && !body.tempUserDisplayName) {
        //         socket.emit("joinRoom", {room: body.room, userToken});
        //     } else if (body.tempUserDisplayName && !userToken) {
        //         socket.emit("joinRoom", {room: body.room, tempUserDisplayName: body.tempUserDisplayName});
        //     }
        // },
        //
        // async leaveRoom(socket: Socket, room: string, tempUserId?: string) {
        //     const userStore = useUserStore()
        //     const userToken = userStore.getUser
        //     if (userToken && !tempUserId) {
        //         socket.emit("leaveRoom", {room, userId: userToken});
        //     } else if (tempUserId && !userToken) {
        //         socket.emit("leaveRoom", {room, tempUserId});
        //     }
        // },

        roomSocketListeners() {
            // socket.on("SomeoneJoined", (body: { room: IRoom, user: IUser | ITempUser }) => {
            //     const userStore = useUserStore()
            //     if (body.user._id === userStore.getUser?._id) {
            //         this.setActiveRoom(body.room)
            //     }
            //     this.addParticipant(body.user)
            // });
            //
            // socket.on("SomeoneLeft", (user: IUser | ITempUser) => {
            //     const userStore = useUserStore()
            //     if (user._id === userStore.getUser?._id) {
            //         this.resetActiveRoom()
            //     }
            //     this.deleteParticipant(user._id)
            // })
            //
            // socket.on("RoomClosed", () => {
            //     this.resetActiveRoom()
            // })

        },
    },
});
