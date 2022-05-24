import {defineStore} from "pinia";
import {socket} from "@/utils/socketio";

export const useCommonStore = defineStore({
    id: 'common',
    state: () => ({
        errors: <Partial<Record<string, string>>>{},
    }),
    getters: {
        getErrors() {
            return this.errors
        },
        getErrorByType(errorType: string) {
            return this.errors[errorType]
        },
    },
    actions: {
        addError(error: { type: string, message: string }) {
            this.errors[error.type] = error.message
        },
        deleteError(errorType: string) {
            delete this.errors[error.type]
        },
        clearErrors() {
            this.errors = []
        },

        commonSocketListeners() {
            socket.on("error", (error: { type: string, message: string }) => {
                addError(error)
                // tiplere göre swwitch case yap
            })
        }


    }


})