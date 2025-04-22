<template>
    <form ref="form" @submit.prevent="submitEdit">
        <label><strong>First Name</strong></label>
        <div class="inline-input">
            <input type="text" name="firstName" placeholder="First Name" v-model="formData.firstName" required />
        </div>

        <label><strong>Last Name</strong></label>
        <div class="inline-input">
            <input type="text" name="lastName" placeholder="Last Name" v-model="formData.lastName" required />
        </div>

        <label><strong>Username</strong></label>
        <div class="inline-input">
            <input type="text" name="userName" placeholder="Username" v-model="formData.userName" required />
        </div>

        <label><strong>Email Address</strong></label>
        <div class="inline-input">
            <input type="email" name="email" placeholder="Email Address" v-model="formData.email" required />
        </div>

        <label><strong>Password</strong></label>
        <div class="inline-input">
            <input type="password" name="password" placeholder="Password" v-model="formData.password" />
        </div>

        <div class="inline-input">
            <PasswordMeter @score="onScore" :password="formData.password" />
        </div>

        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>
    </form>
</template>

<script setup>
import { reactive, ref, defineExpose } from 'vue';
import { updateUser } from '@/services/users';
import { useUserStore } from '@/stores/user';
import PasswordMeter from 'vue-simple-password-meter';

const userStore = useUserStore();

// Initialize formData with current store values
const formData = reactive({
    firstName: userStore.firstName,
    lastName: userStore.lastName,
    userName: userStore.userName,
    email: userStore.email,
    password: '',
});

const errorMessage = ref('');
const score = ref(0);

const onScore = ({ score: s }) => {
    score.value = s;
};

async function submitEdit() {
    errorMessage.value = '';
    const { email, password, userName, firstName, lastName } = formData;

    // Password strength check
    if (password && score.value < 3) {
        errorMessage.value = 'Password is too weak!';
        throw new Error(errorMessage.value);
    }

    // Email format validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailPattern.test(email)) {
        errorMessage.value = 'Email is not a valid email address.';
        throw new Error(errorMessage.value);
    }

    // Build payload
    const data = {};
    if (firstName) data.firstName = firstName;
    if (lastName) data.lastName = lastName;
    if (userName) data.userName = userName;
    if (email) data.email = email;
    if (password) data.password = password;

    // Call service to update
    const responseData = await updateUser(data);

    // Sync Pinia store
    userStore.$patch({
        firstName: responseData.firstName,
        lastName: responseData.lastName,
        userName: responseData.userName,
        email: responseData.email,
    });

    // Return updated user data
    return responseData;
}

defineExpose({ submitEdit });
</script>

<style scoped>
.inline-input {
    margin-bottom: 1rem;
}

.error-message {
    color: red;
    margin-bottom: 1rem;
}
</style>
