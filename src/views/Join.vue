<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="join-page">
    <p>welcome to</p>
    <h1><span class="brand">excursions.</span></h1>
    <div class="join-container">
      <h2>Sign In</h2>
      <form @submit.prevent="join">
        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="formData.email" type="email" placeholder="Email" required />
        </div>

        <div class="input-group">
          <label for="username">Username</label>
          <input id="username" v-model="formData.userName" type="text" placeholder="Username" required />
        </div>

        <div class="input-group">
          <label for="name">First Name</label>
          <input id="name" v-model="formData.firstName" type="text" placeholder="First Name" required />
        </div>

        <div class="input-group">
          <label for="name">Last Name</label>
          <input id="name" v-model="formData.lastName" type="text" placeholder="Last Name" required />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input id="password" v-model="formData.password" type="password" placeholder="Password" required />
        </div>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <div class="buttons">
          <button type="button" class="sign-in-btn" @click="onJoin">Sign In</button>
          <button type="submit" class="join-btn">Join</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

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

      // Validate email format
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      if (!emailPattern.test(formData.email)) {
        errorMessage.value = 'Please enter a valid email address.';
        return;
      }

      const url = 'https://excursions-api-server.azurewebsites.net/user';
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };

      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
          errorMessage.value = responseData.message || 'An error occurred.';
          return;
        }

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
        errorMessage.value = 'There has been an error joining.';
      }
    }

    function onJoin() {
      console.log('Redirect to sign-in page or process sign-in.');
      router.push({ name: 'sign-in' });
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

<style scoped>
.join-page {
  background: linear-gradient(135deg, #6985af, #476593);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0;
}

p {
  font-size: 2rem;
  color: white;
  margin-bottom: 0rem;
}

h1 {
  font-size: 3rem;
  margin-top: 0.5rem;
}

.join-container {
  padding: 2rem;
  width: 300px;
  text-align: center;
}

.join-container h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
}

.brand {
  color: #000000;
}

form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: #21272a;
}

.input-group input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #f2f4f8;
  color: #697077;
}

.error-message {
  color: red;
  margin-top: 0.5rem;
}

.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.sign-in-btn,
.join-btn {
  cursor: pointer;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 1rem;
  transition: background-color 0.3s ease;
}

.sign-in-btn {
  background-color: transparent;
  color: white;
}

.sign-in-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.join-btn {
  background-color: #ffc15e;
  color: #21272a;
}

.join-btn:hover {
  background-color: #f3debd;
}
</style>
