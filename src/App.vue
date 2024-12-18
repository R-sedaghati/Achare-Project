<template>
  <AppHeader />
  <AddressRegister />
  <router-view></router-view>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import AddressRegister from "./components/Address/AddressRegister.vue";
export default {
  name: "App",
  components: {
    AppHeader,
    AddressRegister
  },
};
</script>
