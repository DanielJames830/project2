<template>
  <div class="page">

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
        <button @click="handleDeleteUser">Delete</button>
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
import { ref, onMounted, useTemplateRef, reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
import { fetchUser, deleteUser, updateUser } from '@/services/users';
import EditForm from '@/components/EditForm.vue';
import TitleBar from '@/components/TitleBar.vue';

const router = useRouter();
const userStore = useUserStore();
const nameDialog = ref(null);
const form = useTemplateRef('form');
const user = ref(null);

const formData = reactive({
  firstName: '',
  lastName: '',
  userName: '',
  email: ''
});

async function getUser() {
  try {
    const responseData = await fetchUser();
    user.value = responseData.user;
  } catch (error) {
    console.error('Error fetching user:', error.message);
  }
}

async function handleDeleteUser() {
  try {
    await deleteUser();
    userStore.$reset();
    router.push({ name: 'home' });
  } catch (error) {
    alert('Unable to delete account');
  }
}

function openDialog() {
  if (nameDialog.value) {
    formData.firstName = user.value.firstName;
    formData.lastName = user.value.lastName;
    formData.userName = user.value.userName;
    formData.email = user.value.email;
    nameDialog.value.showModal();
  }
}

async function save() {
  try {
    await updateUser(formData);
    user.value = { ...user.value, ...formData };
    nameDialog.value.close();
  } catch (error) {
    console.error('Error updating user:', error.message);
  }
}

function cancel() {
  if (nameDialog.value) {
    nameDialog.value.close();
  }
}

onMounted(getUser);
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
