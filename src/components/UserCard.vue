<template>
    <div class="card h-100 shadow-sm border-0">
        <div class="card-body">
            <h3 class="card-title">{{ user.name }}</h3>
            <h5 class="card-title">{{ user.email}}</h5>
            <p class="card-text">{{ user.username }}</p>
            <button class="btn btn-secondary btn-sm" @click="$emit('view-user', user)">View User</button>
        </div>
    </div>
</template>

<script setup>
defineProps({
    user: Object
})
</script>