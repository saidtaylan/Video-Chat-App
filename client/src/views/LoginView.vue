<template>
  <keep-alive>
    <component :is="components[activeComponent]" v-bind="props" @changeComponent="changeActiveComponent"></component>
  </keep-alive>

</template>

<script lang="ts" setup>
import LoginComponent from "@/components/Login.vue"
import RegisterComponent from "@/components/Register.vue"
import {ref} from "vue"

const activeComponent = ref('LoginComponent')

const components = {
  LoginComponent,
  RegisterComponent
}

const props = (() => {
  return {
    activeComponent
  }
})

const changeActiveComponent = (comp: string) => {
  activeComponent.value = comp
}


</script>
