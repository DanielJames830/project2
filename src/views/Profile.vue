<template>
  <div class="page">
    <div class="profile-container">
      <div class="profile-body">
        <h1 v-if="user">{{ user.firstName }} {{ user.lastName }}</h1>
        <h1 v-else>Loading...</h1>

        <div v-if="user">
          <p><strong>Username:</strong> {{ user.userName }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
        </div>
        <div v-else>
          <p>No user data found.</p>
        </div>

        <button @click="openDialog" class="btn-secondary">Edit</button>
        <button @click="handleDeleteUser" class="btn-danger">Delete</button>
      </div>
    </div>

    <dialog ref="nameDialog">
      <div class="dialog-content">
        <h2 class="primary-heading">Edit Profile</h2>
        <EditForm ref="editForm" />
        <div class="dialog-footer">
          <button @click="cancel" type="button">Cancel</button>
          <button @click="save" type="button">Save</button>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { fetchUser, deleteUser } from '@/services/users';
import EditForm from '@/components/EditForm.vue';

const router = useRouter();
const userStore = useUserStore();

const nameDialog = ref(null);
const editForm = ref(null);
const user = ref(null);

// Fetch current user on mount
async function getUser() {
  try {
    const { user: fetched } = await fetchUser();
    user.value = fetched;
  } catch (err) {
    console.error('Error fetching user:', err);
  }
}

function openDialog() {
  if (nameDialog.value) nameDialog.value.showModal();
}

async function save() {
  if (!editForm.value) return;
  try {
    const updated = await editForm.value.submitEdit();
    // Only close if update succeeded
    if (updated) {
      user.value = { ...user.value, ...updated };
      nameDialog.value.close();
    }
  } catch (err) {
    console.error('Error updating user:', err);
    // Leave dialog open so user can correct errors
  }
}

function cancel() {
  if (nameDialog.value) nameDialog.value.close();
}

async function handleDeleteUser() {
  try {
    await deleteUser();
    userStore.$reset();
    router.push({ name: 'home' });
  } catch {
    alert('Unable to delete account');
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
  min-width: 320px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-danger {
  background-color: #dc2626;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

.btn-danger:hover {
  background-color: #b91c1c;
}
</style>
