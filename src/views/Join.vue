<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <main>
    <div class="container">
      <img class="logo-image" src="https://cdn-icons-png.flaticon.com/256/99/99398.png" alt="Logo" />
      <h2>Create your account</h2>
      <form @submit.prevent="join">
        <input id="email" v-model="formData.email" type="email" placeholder="Email" required />
        <input id="username" v-model="formData.userName" type="text" placeholder="Username" required />
        <input id="firstName" v-model="formData.firstName" type="text" placeholder="First Name" required />
        <input id="lastName" v-model="formData.lastName" type="text" placeholder="Last Name" required />
        <input id="password" v-model="formData.password" type="password" placeholder="Password" required />
        <input id="password" v-model="formData.password" type="text" placeholder="Confirm Password" required />
      </form>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <button @click.prevent="join">Join</button>
    </div>
    <p class="suggestion-p">Already a member? <a @click.prevent="onJoin">Sign in</a></p>
  </main>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { signUp } from '@/services/users';

export default {
  setup() {
    const userStore = useUserStore();
    const router = useRouter();

    const formData = reactive({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
    });

    const errorMessage = ref(null);

    async function join() {
      errorMessage.value = '';

      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(formData.email)) {
        errorMessage.value = 'Please enter a valid email address.';
        return;
      }

      try {
        const responseData = await signUp(formData);

        userStore.$patch({
          email: responseData.email,
          userName: responseData.userName,
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          token: responseData.token,
        });

        router.push({ name: 'excursions' });
      } catch (error) {
        console.error('Error during sign-up:', error);
        errorMessage.value = error.message || 'There has been an error joining.';
      }
    }

    function onJoin() {
      router.push({ name: 'signin' });
    }

    return {
      formData,
      errorMessage,
      join,
      onJoin,
    };
  },
};
</script>

<style scoped></style>
