import {defineStore} from "pinia";
import {MainServerAxios as axios} from "@/utils/appAxios";
import router from "../router/index"

const baseUrl = import.meta.env.VITE_BASE_URL
const serverUrl = import.meta.env.VITE_SERVER_URL

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: <IUser | ITempUser>{},
    }),
    getters: {
        getUser: (state: any) => {
            return state.user
        },
        /*        getUserProperty: (state:any) => {
                    return (property: string) => state.user[property]
        }*/
    },
    actions: {
        setUser(user: IUser | ITempUser) {
            this.user = user;
        },

        setDisplayName(displayName: string) {
            const user: ITempUser = this.user as ITempUser
            user.displayName = displayName;
        },
        deleteUser() {
            this.user = <IUser | ITempUser>{}
        },

        async enterSite() {
            const userLoginTime: string | undefined = this.getUserFromLocal()
            if (userLoginTime && "_id" in this.getUser) {
                await axios.get(`${serverUrl}/enter-site?id=${this.getUser._id}`)
                const userLoginLocalStorageTime = import.meta.env.VITE_USER_LOCAL_STORAGE_TIME
                if (new Date().getTime() < (userLoginLocalStorageTime * 60 * 60 * 24)) {
                    this.clearUserLocal()
                    const tempUser: ITempUser = await axios.get(`${serverUrl}/enter-site`)
                    this.setUser(tempUser)

                }
            } else {
                const tempUser: ITempUser = await axios.get(`${serverUrl}/enter-site`)
                this.setUser(tempUser)
            }
        },

        async fetchUser(id: string) {
            const resp = await axios.get(
                `${serverUrl}/users/${id}`,
                {headers: {Authorization: `Bearer ${this.getUser.accessToken}`}}
            );
            return resp.data;
        },


        async login(body: { email: string, password: string }) {
            try {
                // this returns user data
                const resp = await axios.post(`${serverUrl}/users/login`, {...body, onlineId: this.getUser.onlineId})
                if (resp.data) {
                    this.setUser(resp.data)
                    this.localizeUser()
                    await router.replace({name: 'home'})
                }

            } catch (err) {
                console.log(err)
            }
        },

        async register(body: { name: string, lastName: string, email: string, password: string, role: string }) {
            try {
                const resp = await axios.post(`${serverUrl}/users/register`, {...body, onlineId: this.getUser.onlineId})
                if (resp.data) {
                    this.setUser(resp.data)
                    await router.replace({name: 'home'})
                }
            } catch (err) {
                console.log(err)
            }
        },

        localizeUser() {
            window.localStorage.setItem("user", JSON.stringify(this.getUser))
            window.localStorage.setItem("userLoginTime", new Date().getTime().toString())
        },

        getUserFromLocal(): string | undefined {
            const user: string | null = window.localStorage.getItem("user")
            const userLoginTime: string | null = window.localStorage.getItem("userLoginTime")
            if (user && userLoginTime) {
                this.setUser(<IUser>JSON.parse(user))
                return userLoginTime
            }
            return undefined
        },

        clearUserLocal() {
            window.localStorage.removeItem("user")
            window.localStorage.removeItem("userLoginTime")
        },

        userSocketListeners() {

        }

    }
})