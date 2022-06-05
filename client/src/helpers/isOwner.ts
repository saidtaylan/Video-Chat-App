import {computed} from "vue";
import {useRoomStore} from "@/stores/room.store";
import {useUserStore} from "@/stores/user.store";

const roomStore = useRoomStore()
const userStore = useUserStore()

export const isOwner = computed(() => {
    if (roomStore.getActiveRoom.owner && userStore.getUser)
        return (
            roomStore.getActiveRoom.owner.onlineId === userStore.getUser.onlineId
        );
});