import app_api from "@/lib/api"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

type AuthHook = {
    register: () => void
}

export type UserRegister = {
    username: string,
    password: string,
    email: string
}


export type LoginType = {
    identifier: string,
    password: string
}

export default function useAuthHook() {

    const router = useRouter();

    const register = async (user_registration_details: UserRegister) => {
        const request = await app_api.post("/user_feature/register", user_registration_details)
        toast("You're registered successfully", {
            action: {
                label: "Login",
                onClick: () => {
                    router.push("/login")
                }
            }
        })
    }

    const login = async (login_details: LoginType) => {
        const request = await app_api.post("/user_feature/login", login_details)

        if (request.status !== 200) {
            toast.error("Invalid username or password")
            return
        }

        localStorage.setItem("token", request.data.token)
        localStorage.setItem("user_uuid", request.data.uuid)

        toast("You're logged in successfully", {
            action: {
                label: "Dashboard",
                onClick: () => {
                    router.push("/dashboard")
                }
            },
            position: "top-center"
        })

        router.push("/dashboard")
    }

    return {
        register,
        login
    }
}