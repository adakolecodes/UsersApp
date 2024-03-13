<template>
    <div class="container mt-5 mb-5">
      <!-- Edit User Form -->
        <div v-if="editingUser" class="mt-5">
          <h1>Edit User</h1>
          <div class="row">
            <div class="col-md-4">
              <input class="form-control mb-3" type="text" placeholder="Name" v-model="editingUser.name" />
            </div>
            <div class="col-md-4">
              <input class="form-control mb-3" type="email" placeholder="Email" v-model="editingUser.email" />
            </div>
            <div class="col-md-4">
              <input class="form-control mb-3" type="text" placeholder="Username" v-model="editingUser.username" />
            </div>
          </div>
          <div class="row">
            <div class="col-md-6">
              <button class="btn btn-secondary btn-sm mb-3" @click="submitEdit" :disabled="isOperationInProgress">Update User</button>
              <button class="btn btn-link btn-sm mb-3" @click="cancelEdit">Cancel</button>
            </div>
          </div>
        </div>
        <!-- Add User Form -->
        <div v-else>
          <h1>Add User</h1>
          <div class="row">
              <div class="col-md-4">
                  <input class="form-control mb-3" type="text" placeholder="Name" v-model="userName" />
              </div>
              <div class="col-md-4">
                  <input class="form-control mb-3" type="email" placeholder="Email" v-model="userEmail" />
              </div>
              <div class="col-md-4">
                  <input class="form-control mb-3" type="text" placeholder="Username" v-model="userUsername" />
              </div>
          </div>
          <div class="row">
              <div class="col-md-6">
                  <button class="btn btn-secondary btn-sm mb-3" @click="addUser" :disabled="isOperationInProgress">Add User</button>
              </div>
          </div>
        </div>

        <!-- Users Table -->
        <div class="mt-5" v-if="isLoading">Loading user data...</div>
        <div class="mt-5" v-else>
          <div v-if="users.length > 0">
            <hr>
            <h1>Users</h1>
            <p>Total Users: {{ userCount }}</p>
            <hr>
            <table class="table table-sm">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Username</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.username }}</td>
                  <td><button class="btn btn-link btn-sm" @click="editUser(user)">Edit</button></td>
                  <td><button class="btn btn-link btn-sm" @click="deleteUser(user.id)">Remove</button></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>No user found</div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useToast } from "vue-toastification";

const store = useStore();
const toast = useToast();
const userName = ref('');
const userEmail = ref('');
const userUsername = ref('');
const isLoading = ref(true);
const editingUser = ref(null);
const isOperationInProgress = ref(false);

const addUser = async () => {
  if (!userName.value || !userEmail.value || !userUsername.value) {
    toast.error('Please fill in all fields.');
    return;
  }

  const existingUser = store.state.users.find(user => user.username === userUsername.value.trim());
  if (existingUser) {
    toast.error('Username already taken');
    return;
  }

  isOperationInProgress.value = true; // Disable the button

  const user = {
    id: Date.now().toString(),
    name: userName.value.trim(),
    email: userEmail.value.trim(),
    username: userUsername.value.trim(),
  };

  try {
    await store.dispatch('addUser', user);
    toast.success('User added successfully');
    userName.value = '';
    userEmail.value = '';
    userUsername.value = '';
  } catch (error) {
    toast.error(`Error adding user: ${error.message}`);
  }

  isOperationInProgress.value = false; // Re-enable the buttons
};

const editUser = (user) => {
  editingUser.value = { ...user };
};

//EDITING A USER
const submitEdit = async () => {
  if (!editingUser.value.name || !editingUser.value.email || !editingUser.value.username) {
    toast.error('Please fill in all fields.');
    return;
  }

  // Check if another user has the same username
  const existingUser = store.state.users.find(user => 
    user.username === editingUser.value.username.trim() && user.id !== editingUser.value.id);

  if (existingUser) {
    toast.error('Username already taken by another user');
    return;
  }

  isOperationInProgress.value = true; // Disable the button

  try {
    await store.dispatch('updateUser', editingUser.value);
    toast.success('User updated successfully');
    editingUser.value = null; // Reset the editing user
    // Close the edit form
  } catch (error) {
    toast.error(`Error updating user: ${error.message}`);
  }

  isOperationInProgress.value = false; // Re-enable the button
};

const cancelEdit = () => {
  editingUser.value = null;
};

//DISPLAY USERS
onMounted(async () => {
  await store.dispatch("fetchUsers");
  isLoading.value = false;
});

const users = computed(() => store.state.users);
const userCount = computed(() => users.value.length);

//REMOVE USER
const deleteUser = (id) => {
  if(store.dispatch("deleteUser", id)){
    toast.success("User deleted successfully");
  }
};
</script>