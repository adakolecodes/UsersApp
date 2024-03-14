<template>
    <div class="container mt-5 mb-5">
      <h1>Users</h1>
      <div class="mt-5 mb-5">
        <RouterLink to="/">Back Home</RouterLink>
      </div>

      <div v-if="isLoading">Loading...</div>
      <div v-else>
        <div v-if="users.length > 0">
          <div class="row row-cols-1 row-cols-md-4 g-4">
            <div class="col" v-for="user in users" :key="user.id">
              <UserCard :user="user" @view-user="viewUser(user)"/>
            </div>
          </div>
        </div>
        <div v-else>No user found</div>
      </div>
    </div>
</template>

<script setup>
import UserCard from '@/components/UserCard.vue'
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter  } from "vue-router";

const store = useStore();
const isLoading = ref(true);
const router = useRouter();

onMounted(async () => {
    await store.dispatch("fetchUsers");
    isLoading.value = false;
});

const users = computed(() => store.state.users);

function viewUser(user) {
  // Navigate to UserDetails view with the user ID as a parameter
  router.push({ name: 'UserDetailsView', params: { id: user.id } });
}
</script>