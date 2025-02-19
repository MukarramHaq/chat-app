// Here we will have a bunch of states and functions that we can use in different components
// this is a custom hook that we can use to manage our authentication state

import { create } from "zustand";
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast";

// setter function
const useAuthStore = create((set) => ({
    authUser: null, // stores authenticated users data if user is authenticated
    // boolean flags to indicate the status of various authentication-related processes
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],

    // If we refresh our page, we would for a quick second would like to know if the user is authenticated or not
    // while its checking we show the loading animation inthe middle of the screen.
    isCheckingAuth: true,

    checkAuth: async() => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({authUser: res.data})
        } catch (error) {
            console.log("Error in checkAuth", error);
            set({authUser: null});
        } finally{
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        // signup logic
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    updateProfile: async(data) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: res.data });
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("error in update profile:", error);
            toast.error(error.response.data.message);
        }finally{
            set({ isUpdatingProfile: false });
        }
    },

}))

export { useAuthStore };