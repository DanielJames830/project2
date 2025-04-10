import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '@/views/SignIn.vue';
import Join from '@/views/Join.vue';
import MainView from '@/views/MainView.vue';
import { useUserStore } from '@/stores/user';
import Profile from '@/views/Profile.vue';
import ExcursionList from '@/components/excursions/ExcursionList.vue';
import TripList from '@/components/trips/TripList.vue';

const isAuthenticated = () => {
  const userStore = useUserStore();
  console.log(userStore.token);
  return userStore.token;
};


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: SignIn
    },
    {
      path: "/join",
      name: "join",
      component: Join,
      meta: { authRequired: false },
    },
    {
      path: "/signin",
      name: "signin",
      component: SignIn,
      meta: { authRequired: false },
    },
    {
      path: "/main",
      name: "",
      component: MainView,
      meta: { authRequired: true },
      children: [
        {
          path: "",
          name: "main",
          components: {
            focus: ExcursionList,
          }
        },
        {
          path: "/excursions",
          name: "excursions",
          components: {
            focus: ExcursionList,
          },
          meta: { authRequired: true },
        },
        {
          path: "/trips",
          name: "trips",
          components: {
            focus: TripList,
          },
          meta: { authRequired: true },
        },
        {
          path: "/profile",
          name: "profile",
          components: {
            focus: Profile,
          },
          meta: { authRequired: true },
        }
      ]
    },

    {
      path: "/:pathMatch(.*)*",
      redirect: "signin",
    }
  ],



})

router.beforeEach((to, from, next) => {
  if (to.meta.authRequired && !isAuthenticated()) {
    next("/");
  } else {
    next();
  }
});


export default router;
