import { z } from "zod"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { authService } from "../../../services/authService"
import { toast } from "sonner"

interface RegisterFormProps {
    onSwitch: () => void
}

const registerSchema = z.object({
    fullName: z.string().trim().min(2, {message: "Full name is too short"}),
    username: z.string()
               .regex(/^[a-z0-0_]+$/, {message: "Username can only contain lowercase letters, numbers, and underscores"})
               .min(2, {message: "Username is too short"})
               .max(12, {message: "Username is too long"})
               .transform(val => val.toLocaleLowerCase()),
    email: z.email({message: "Invalid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long"}),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitch }) => {
    const {
        register, handleSubmit, formState: { errors }
    } = useForm({
        resolver: zodResolver(registerSchema)
    })

    const mutation = useMutation({
        mutationFn: authService.register,
        onSuccess: () => {
            onSwitch();
            toast.success("Account created! You can now sign in!")
        },
        onError: (error) => {
            const msg = error.response?.data?.message || "Registration failed"
            toast.error(msg)
        },
    })

    const onSubmit = (data: RegisterFormData) => mutation.mutate(data);

    return <>
        register form
    </>
}

export default RegisterForm;