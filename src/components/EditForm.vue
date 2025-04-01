<template>
    <form ref="form" @submit.prevent="edit">
        <label><strong>First Name</strong></label>
        <div class="inline-input">
            <input type="te xt" name="firstName" placeholder="First Name" v-model="formData.firstName" required />
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
            <input type="password" name="password" placeholder="Password" v-model="formData.password" required />
        </div>
        <div class="inline-input">
            <PasswordMeter @score="onScore" :password="formData.password" />
        </div>
        <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
        </div>

    </form>
</template>

<script>
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref, reactive, defineExpose } from 'vue';
import { useRouter } from 'vue-router';
import PasswordMeter from 'vue-simple-password-meter';

export default {
    components: {
        PasswordMeter,
    },
    setup() {
        const form = ref(null);
        const errorMessage = ref();
        const serverResponse = ref();

        const userStore = useUserStore();
        const { wholeName, userName, email, token } = storeToRefs(userStore);

        console.log("token:", token.value);

        const formData = reactive({
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
        });

        const router = useRouter();

        const score = ref(null);

        const onScore = (payload) => {
            console.log(payload.score); // from 0 to 4
            console.log(payload.strength); // one of : 'risky', 'guessable', 'weak', 'safe' , 'secure'
            score.value = payload.score;
        };

        async function edit() {


            errorMessage.value = "";

            const { email, password, userName, firstName, lastName } = formData;

            // Ensure score is properly defined
            if (typeof score === "undefined" || typeof score.value === "undefined") {
                console.error("Score is not initialized properly.");
                errorMessage.value = "An error occurred with password validation.";
                return;
            }

            // Password strength validation (only if password is provided)
            if (password && score.value < 3) {
                errorMessage.value = "Password is too weak!";
                return;
            }

            // Email pattern validation (only if email is provided)
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            if (email && !emailPattern.test(email)) {
                errorMessage.value = "Email is not a valid email address.";
                console.error("Please enter a valid email address.");
                return;
            }

            // Build the request payload, only including non-empty fields
            const data = {};
            if (email) data.email = email;
            if (password) data.password = password;
            if (userName) data.userName = userName;
            if (firstName) data.firstName = firstName;
            if (lastName) data.lastName = lastName;

            const url = "https://excursions-api-server.azurewebsites.net/user";
            const options = {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token.value}` // Fixed token reference
                },
                body: JSON.stringify(data),
            };

            console.log("Sending request with data:", data);

            try {
                const response = await fetch(url, options);
                const responseData = await response.json();

                if (!response.ok) {
                    serverResponse.value = response.status;
                    console.error("Update failed:", responseData || "Unknown error");
                    errorMessage.value = responseData.message || "An error occurred.";
                    return;
                }

                console.log("Form data submitted successfully:", responseData);
                userStore.$patch((state) => {
                    state.email = responseData.email;
                    state.userName = responseData.userName;
                    state.firstName = responseData.firstName;
                    state.lastName = responseData.lastName;
                });

            } catch (error) {
                console.error("An error occurred while submitting the form:", error);
                errorMessage.value = "There has been an error updating the profile.";
            }
        }


        // Expose edit method
        defineExpose({ edit });

        return {
            form,
            formData,
            edit,
            errorMessage,
            score,
            onScore,
        };
    },
};
</script>
