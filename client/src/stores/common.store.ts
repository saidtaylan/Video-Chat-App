import {defineStore} from "pinia";
import {socket} from "@/utils/socketio";
import {useRoomStore} from "@/stores/room.store";

export const useCommonStore = defineStore({
    id: 'common',
    state: () => ({
        errors: <Partial<Record<string, string>>>{},
        micStateFunc: Function,
        cameraStateFunc: Function,
        leaveFunc: Function,
        micState: true,
        cameraState: true,
    }),
    getters: {
        getErrors(state: any) {
            return this.errors
        },
        getErrorByType(state: any) {
            return (errorType: string) => state.errors[errorType]
        },
        getCameraStateFunc(state: any) {
            return state.cameraStateFunc
        },

        getMicStateFunc(state: any) {
            return state.micStateFunc
        },
        getLeaveFunc(state: any) {
            return state.leaveFunc
        },
        getMicState(state: any) {
            return state.micState
        },
        getCameraState(state: any) {
            return this.cameraState
        },
    },
    actions: {
        addError(error: { type: string, message: string }) {
            this.errors[error.type] = error.message
        },
        deleteError(errorType: string) {
            delete this.errors[errorType]
        },
        clearErrors() {
            this.errors = []
        },
        setCameraStateFunc(func: Function) {
            this.cameraStateFunc = func
        },
        setMicStateFunc(func: Function) {
            this.micStateFunc = func
        },
        setLeaveFunc(func: Function) {
            this.leaveFunc = func
        },
        setMicState(state: boolean) {
            this.micState = state
        },
        setCameraState(state: boolean) {
            this.cameraState = state
        },
        commonSocketListeners() {
            const roomStore = useRoomStore()
            socket.on("error", (error: { type: string, message: string }) => {
                this.addError(error)
                // tiplere göre switch case yap
            })

            socket.on("disconnect", () => {
                roomStore.leaveRoom()
            })
        }


    }


})