<template>
  <div class="page">
    <p>Welcome to</p>
    <h1><span class="brand">Excursions.</span></h1>
    <div class="sign-in-container">
      <h2>Sign In</h2>
      <form @submit.prevent="onSubmit">
        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" placeholder="Password" required />
        </div>
        <div class="buttons">
          <button type="button" class="join-btn" @click="onJoin">Join</button>
          <button type="submit" class="sign-in-btn">Sign In</button>
        </div>
      </form>
    </div>
  </div>
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
    const userStore = useUserStore();
    const router = useRouter();

    const onSubmit = async () => {
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
        alert('Sign-in failed: ' + error.message);
      }
    };

    const onJoin = () => {
      router.push({ name: 'join' });
    };

    return { email, password, onSubmit, onJoin };
  },
};
</script>

<style scoped>
p {
  font-size: 2rem;
  color: white;
  margin-bottom: 0rem;
}

h1 {
  font-size: 3rem;
  color: black;
  margin-top: 0.5rem;
}

.sign-in-container {
  padding: 2rem;
  width: 300px;
  text-align: center;
}

h2 {
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: white;
}

.brand {
  color: black;
}

form {
  display: flex;
  flex-direction: column;
}

.input-group {
  margin-bottom: 1rem;
  text-align: left;
}


.buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.join-btn,
.sign-in-btn {
  cursor: pointer;
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 1rem;
  transition: background-color 0.3s ease;
}

.sign-in-btn {
  background-color: #FFC15E;
  color: #21272a;
}

.sign-in-btn:hover {
  background-color: #f3debd;
}

.join-btn {
  background-color: transparent;
  color: #21272a;
}
</style>
