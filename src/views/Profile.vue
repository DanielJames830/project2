<template>
  <div class="page">
    <TitleBar title="Profile" subtitle="View and edit your profile" />
    <div class="profile-container">
      <div class="profile-body">
        <h1 v-if="user"> {{ user.firstName }} {{ user.lastName }}</h1>
        <h1 v-else>Loading...</h1>
        <div v-if="user">
          <p><strong>Username:</strong> {{ user.userName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <div v-else>
          <p>No user data found.</p>
        </div>
        <button @click="openDialog">Edit</button>
        <button @click="deleteUser">Delete</button>
      </div>
    </div>


    <dialog ref="nameDialog">
      <form method="dialog" class="dialog-content">
        <h1 class="primary-heading">Edit Profile</h1>
        <EditForm ref="form"></EditForm>
        <div class="dialog-footer">
          <button type="button" @click="cancel">Cancel</button>
          <button type="button" @click="save">Save</button>
        </div>
      </form>
    </dialog>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user';
import { ref, onMounted, useTemplateRef } from 'vue';
import EditForm from '@/components/EditForm.vue';
import TitleBar from '@/components/TitleBar.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const message = ref('')

const nameDialog = ref(null);

const form = useTemplateRef('form');

function openDialog() {
  nameDialog.value.showModal();
}

function cancel() {
  message.value = 'Cancelled';
  name.value = '';
  nameDialog.value.close();
}

async function save() {
  message.value = 'Saved ' + name.value;
  name.value = '';
  await form.value.edit();
  await getUser();
  nameDialog.value.close();
}


const userStore = useUserStore();
const token = userStore.token;


const name = ref('');
const user = ref(null);

async function getUser() {
  const url = "https://excursions-api-server.azurewebsites.net/user";
  const options = {
    method: "GET",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
  };
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();

    if (!response.ok) {
      serverResponse.value = response.status;
      console.error("Get failed:", responseData || "Unknown error");
      errorMessage.value = responseData.message || "An error occurred.";
      return;
    }

    console.log("Found User:", responseData);
    user.value = responseData.user;
    console.log(user.value)

  } catch (error) {
    console.error("An error occurred while submitting the form:", error);
  }
}

onMounted(async () => {

  await getUser();
});


async function deleteUser(e) {
  const url = "https://excursions-api-server.azurewebsites.net/user";
  const token = userStore.token;

  const options = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },

  }

  let response = await fetch(url, options);

  if (response.ok) {
    userStore.$reset();
    router.push({ name: 'home' });
  } else {
    alert("Unable to delete account");
  }


}

</script>

<style scoped>
.profile-container {
  background-color: white;
  padding: 2rem;
  border-radius: 30px;

}

.dialog-content {
  padding: 1rem;
  border: none;
  background: white;
  border-radius: 8px;
  min-width: 300px;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}
</style>
