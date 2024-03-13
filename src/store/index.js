import { createStore } from "vuex"; // Importing createStore function from Vuex to create a new store
import axios from "axios"; // Importing axios for making HTTP requests

export default createStore({
    state: {
        users: [],
        selectedUser: null,
    },

    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },

        SET_SELECTED_USER(state, user) {
            state.selectedUser = user;
        },

        ADD_USER(state, user) {
            state.users.unshift(user);
        },

        DELETE_USER(state, id) {
            state.users = state.users.filter((user) => user.id !== id);
        },

        UPDATE_USER(state, updatedUser) {
            const index = state.users.findIndex(user => user.id === updatedUser.id);
            if (index !== -1) {
              state.users.splice(index, 1, updatedUser);
            }
        },
    },

    actions: {
        async fetchUsers({ commit }) {
            const response = await axios.get(
              "https://jsonplaceholder.typicode.com/users"
            );
            commit("SET_USERS", response.data);
        },

        async fetchUserById({ commit }, id) {
            const response = await axios.get(
              `https://jsonplaceholder.typicode.com/users/${id}`
            );
            commit("SET_SELECTED_USER", response.data);
        },

        async addUser({ commit }, user) {
            try {
              const response = await axios.post('https://jsonplaceholder.typicode.com/users', user);
              commit('ADD_USER', response.data); // Assuming your mutation is called 'ADD_USER'. Assuming your API returns the added user
            //   return response;
            } catch (error) {
              throw error;
            }
        },

        async deleteUser({ commit }, id) {
            await axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`);
            commit("DELETE_USER", id);
        },

        async updateUser({ commit }, updatedUser) {
            try {
              await axios.put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser);
              commit('UPDATE_USER', updatedUser);
            } catch (error) {
              throw error;
            }
        },
    },
});

/*
an asynchronous addUser action sends a POST request to your API endpoint (https://jsonplaceholder.typicode.com/users) 
with the new user's data. If the request is successful, the response from the API (which typically includes the newly added user) 
is committed to the Vuex state using the ADD_USER mutation.
*/

// The ADD_USER mutation in your Vuex store will only update the local state in your application. It does not directly interact with your API.
// The addUser function is what interacts with your API to post the added user to the API and then it returns the added user (commit('ADD_USER', response.data);)
// Then your ADD_USER mutation updates the local state in your application to reflect the changes in your UI
// In summary, mutation is not responsible for interacting with the API, the mutation only mutates/commits to the state in our store.
// For example, when users are fetched by the fetchUsers function, the mutation (SET_USERS) sets the users array (users: []) in our state with fetched data
// Whenever any changes are made to our data, the data is returned, and the mutation sets the users array with the changes