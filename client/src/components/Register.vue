<template>

  <div class="h-full bg-gradient-to-tl from-green-400 to-indigo-900 w-full py-16 px-4">
    <div class="flex flex-col items-center justify-center">
      <img alt="logo" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg1.svg">

      <div class="bg-white shadow rounded lg:w-1/3  md:w-1/2 w-full p-10 mt-16">
        <p class="focus:outline-none text-sm mt-4 font-medium leading-none text-gray-500" tabindex="0">Do you have
          account?
          <button @click="goToLogin"
                  class="hover:text-gray-500 focus:text-gray-500 focus:outline-none focus:underline hover:underline text-sm font-medium leading-none  text-gray-800 cursor-pointer">
            Sign in here
          </button>
        </p>
        <!--        <button aria-label="Continue with google" class="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-10"
                        role="button">
                  <img alt="google" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg2.svg">
                  <p class="text-base font-medium ml-4 text-gray-700">Continue with Google</p>
                </button>-->
        <!--        <button aria-label="Continue with github" class="focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4"
                        role="button">
                  <img alt="github" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg3.svg">
                  <p class="text-base font-medium ml-4 text-gray-700">Continue with Github</p>
                </button>-->
        <!--        <button aria-label="Continue with twitter" class="focus:outline-none  focus:ring-2 focus:ring-offset-1 focus:ring-gray-700 py-3.5 px-4 border rounded-lg border-gray-700 flex items-center w-full mt-4"
                        role="button">
                  <img alt="twitter" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg4.svg">
                  <p class="text-base font-medium ml-4 text-gray-700">Continue with Twitter</p>
                </button>-->
        <div class="w-full flex items-center justify-between py-5">
          <hr class="w-full bg-gray-400">
          <p class="text-base font-medium leading-4 px-2.5 text-gray-400">OR</p>
          <hr class="w-full bg-gray-400  ">
        </div>
        <div>
          <label id="name" class="text-sm font-medium leading-none text-gray-800">
            Name
          </label>
          <input aria-labelledby="name" v-model="user.name"
                 class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                 type="text"/>
        </div>
        <div>
          <label id="lastName" class="text-sm font-medium leading-none text-gray-800">
            Last Name
          </label>
          <input aria-labelledby="lastName" v-model="user.lastName"
                 class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                 type="text"/>
        </div>
        <div>
          <label id="email" class="text-sm font-medium leading-none text-gray-800">
            Email
          </label>
          <input aria-labelledby="email" v-model="user.email"
                 class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                 type="email"/>
        </div>
        <div>
          <label id="role" class="text-sm font-medium leading-none text-gray-800">
            Role
          </label>
          <select aria-labelledby="role" v-model="user.role"
                  class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2">
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
            <option value="normal" selected="selected">Normal</option>
          </select>
        </div>
        <div class="mt-6  w-full">
          <label class="text-sm font-medium leading-none text-gray-800" for="pass">
            Password
          </label>
          <div class="relative flex items-center justify-center">
            <input id="pass" v-model="user.password"
                   class="bg-gray-200 border rounded  text-xs font-medium leading-none text-gray-800 py-3 w-full pl-3 mt-2"
                   type="password"/>
            <div class="absolute right-0 mt-2 mr-3 cursor-pointer">
              <img alt="viewport" src="https://tuk-cdn.s3.amazonaws.com/can-uploader/sign_in-svg5.svg">
            </div>
          </div>
        </div>
        <div class="mt-8">
          <button @click="register"
                  class="focus:ring-2 focus:ring-offset-2 focus:ring-indigo-700 text-sm font-semibold leading-none text-white focus:outline-none bg-indigo-700 border rounded hover:bg-indigo-600 py-4 w-full"
                  role="button">
            Create my account
          </button>
        </div>
      </div>
    </div>
  </div>


</template>
<script setup lang="ts">
import {reactive} from "vue"
import {useUserStore} from "@/stores/user.store";

const userStore = useUserStore()
const emit = defineEmits(['changeComponent'])

const goToLogin = () => {
  emit('changeComponent', 'LoginComponent')
}

const user = reactive({
  name: '',
  lastName: '',
  email: '',
  password: '',
  role: ''
})

const register = async () => {
  await userStore.register(user)
}

</script>

