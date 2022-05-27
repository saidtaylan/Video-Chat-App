import {defineStore} from "pinia";
import {socket} from "@/utils/socketio";

export const useCommonStore = defineStore({
    id: 'common',
    state: () => ({
        errors: <Partial<Record<string, string>>>{},
    }),
    getters: {
        getErrors(state: any) {
            return this.errors
        },
        getErrorByType(state: any) {
            return (errorType: string) => state.errors[errorType]
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

        commonSocketListeners() {
            socket.on("error", (error: { type: string, message: string }) => {
                this.addError(error)
                // tiplere göre swwitch case yap
            })
        }


    }


})