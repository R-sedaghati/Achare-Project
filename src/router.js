import { createRouter, createWebHistory } from "vue-router";

// Import components
import AddressesView from "./components/Address/AddressesView.vue";
import AddressRegister from "./components/Address/AddressRegister.vue";

// Define routes
const routes = [
  {
    path: "/",
    name: "AddressesView",
    component: AddressesView,
    meta: {
      title: "Addresses List", // Optional metadata
    },
  },
  {
    path: "/register",
    name: "AddressRegister",
    component: AddressRegister,
    meta: {
      title: "Register Address", // Optional metadata
    },
  },
];

// Create router instance
const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Optionally set document titles based on route metadata
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

// Export router instance
export default router;
