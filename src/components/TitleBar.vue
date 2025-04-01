<script setup>
import { defineProps } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const props = defineProps({
    title: {
        type: String,
        required: true,
    },
});

async function signOut(e) {

    const url = "https://excursions-api-server.azurewebsites.net/user/sign-out";
    const token = userStore.token;

    const options = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }

    let response = await fetch(url, options);

    if (response.ok) {
        if (response.status === 200) {
            const userStore = useUserStore();
            userStore.$reset();
            router.push({ name: "signin" });
        }
    } else {
        console.log("HTTP-Error: " + response.status)
    }
};

</script>

<template>
    <div class="title-bar">
        <h1 class="title">{{ title }}</h1>
        <button class="logout-button" @click="signOut">Logout</button>
    </div>
</template>

<style scoped>
.title-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-around;
    background: #ffffff;
    padding: 10px 0;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
}

h1 {
    font-size: 1.5rem;
    color: #21272a;
    margin: 0;
    text-align: center;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.logout-button {
    background-color: transparent;
    color: 21272a;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    text-transform: uppercase;
    font-weight: bold;
    transition: background-color 0.3s ease;
}

.logout-button:hover {
    color: #ffffff;
    background-color: #d9363e;
}
</style>