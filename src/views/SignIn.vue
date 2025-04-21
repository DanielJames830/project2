<template>
  <main>
    <div class="container">
      <img class="logo-image" src="https://cdn-icons-png.flaticon.com/256/99/99398.png" alt="Logo" />
      <h2>Sign in to your account</h2>
      <form @submit.prevent="onSubmit">
        <input id="email" v-model="email" type="email" placeholder="Email" required />
        <input id="password" v-model="password" type="password" placeholder="Password" required />
      </form>
      <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
      <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">Forgot password?</a>
      <button @click.prevent="onSubmit">Continue</button>
    </div>
    <p class="suggestion-p">Not a member? <a @click.prevent="onJoin">Create an account</a></p>
  </main>
</template>

<script>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { signIn } from '@/services/users';

export default {
  name: 'SignIn',
  setup() {
    const email = ref('');
    const password = ref('');
    const errorMessage = ref(null);
    const userStore = useUserStore();
    const router = useRouter();

    const onSubmit = async () => {
      errorMessage.value = null;
      try {
        const responseData = await signIn(email.value, password.value);

        userStore.$patch({
          email: responseData.email,
          userName: responseData.userName,
          firstName: responseData.firstName,
          lastName: responseData.lastName,
          token: responseData.token,
        });

        router.push({ name: 'excursions' });
      } catch (error) {
        console.error('Error:', error.message);
        errorMessage.value = error.message || 'Sign-in failed. Please try again.';
      }
    };

    const onJoin = () => {
      router.push({ name: 'join' });
    };

    return { email, password, errorMessage, onSubmit, onJoin };
  },
};
</script>

<style scoped></style>
