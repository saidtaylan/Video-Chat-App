import {defineStore} from "pinia";
import {MainServerAxios as axios} from "@/utils/appAxios";
import router from "../router/index"

const baseUrl = import.meta.env.VITE_BASE_URL

export const useUserStore = defineStore({
    id: 'user',
    state: () => ({
        user: <IUser | ITempUser>{

        },
    }),
    getters: {
        getUser: (state) => {
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

        async fetchUser(id: string, userToken: string) {
            const user = await axios.get(
                `${baseUrl}/users`,
                {headers: {Authorization: `Bearer ${userToken}`}}
            );
            console.log("user :>> ", user);
            return user;
        },

        async login(body: { email: string, password: string }) {
            try {
                // this returns user data
                const resp = await axios.post(`${baseUrl}/users/login`, body)
                if (resp.data) {
                    this.setUser(resp.data)
                    await router.replace({name: 'home'})
                }

            } catch (err) {
                console.log(err)
            }
        },

        async register(body: { name: string, lastName: string, email: string, password: string, role: string }) {
            try {
                const resp = await axios.post(`${baseUrl}/users/register`, body)
                if (resp.data) {
                    this.setUser(resp.data)
                    await router.replace({name: 'home'})
                }
            } catch (err) {
                console.log(err)
            }
        },


        userSocketListeners() {

        }

    }
})