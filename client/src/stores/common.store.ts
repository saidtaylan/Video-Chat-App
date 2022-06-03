import {defineStore} from "pinia";
import {socket} from "@/utils/socketio";

export const useCommonStore = defineStore({
    id: 'common',
    state: () => ({
        errors: <Partial<Record<string, string>>>{},
        micStateFunc: Function,
        cameraStateFunc: Function,
        leaveFunc: Function
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
        }
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

        commonSocketListeners() {
            socket.on("error", (error: { type: string, message: string }) => {
                this.addError(error)
                // tiplere göre swwitch case yap
            })
        }


    }


})