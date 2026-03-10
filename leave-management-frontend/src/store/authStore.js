import { create } from "zustand"
import API from "../api/axios"

const initialToken = localStorage.getItem("token")
const initialRole = localStorage.getItem("role")

const useAuthStore = create((set) => ({
    user: null,
    token: initialToken || null,
    role: initialRole || null,
    isAuthenticated: !!(initialToken && initialRole),
    loading: false,
    error: null,

    login: async (formData) => {
        try {
            set({ loading: true, error: null })

            const response = await API.post("/auth/login", formData)
            const apiData = response?.data?.data
            const token = apiData?.token
            const user = apiData

            if (!token || !user?.role) {
                throw new Error("Invalid login response")
            }

            localStorage.setItem("token", token)
            localStorage.setItem("role", user.role)

            set({
                user,
                token,
                role: user.role,
                isAuthenticated: true,
                loading: false,
                error: null
            })

            return {
                success: true,
                role: user.role
            }
        } catch (err) {
            const message = err.response?.data?.message || "Login failed"

            set({
                error: message,
                loading: false
            })

            return { success: false }
        }
    },

    logout: () => {
        localStorage.removeItem("token")
        localStorage.removeItem("role")

        set({
            user: null,
            token: null,
            role: null,
            isAuthenticated: false
        })
    },

    register: async (formData) => {
        try {
            set({ loading: true, error: null })

            const response = await API.post("/auth/register", formData)
            const apiData = response?.data?.data
            const token = apiData?.token
            const user = apiData

            if (!token || !user?.role) {
                throw new Error("Invalid register response")
            }

            localStorage.setItem("token", token)
            localStorage.setItem("role", user.role)

            set({
                user,
                token,
                role: user.role,
                isAuthenticated: true,
                loading: false,
                error: null
            })

            return {
                success: true,
                role: user.role
            }

        } catch (err) {
            const message =
                err.response?.data?.message || "Registration failed"

            set({
                error: message,
                loading: false
            })

            return { success: false }
        }
    },

    clearError: () => set({ error: null })
}))

export default useAuthStore
