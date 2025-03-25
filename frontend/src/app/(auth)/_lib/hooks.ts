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

    return {
        register
    }
}