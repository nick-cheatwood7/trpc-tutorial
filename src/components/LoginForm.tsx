import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

interface LoginFormProps {}

export const LoginForm: React.FC<LoginFormProps> = ({}) => {
    const { handleSubmit, register } = useForm<LoginInput>();
    const router = useRouter();
    const { mutate, error } = trpc.useMutation(["users.login"], {
        onSuccess: () => {
            router.push("/");
        }
    });

    const onSubmit = (values: LoginInput) => {
        mutate(values);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && error.message}
                <h1>Login</h1>
                <input
                    type='email'
                    placeholder='jane.does@example.com'
                    {...register("email")}
                />
                <br />
                <input
                    type='password'
                    placeholder='********'
                    {...register("password")}
                />
                <button type='submit'>Submit</button>
            </form>
            <Link href='/register'>Register</Link>
        </>
    );
};

export default LoginForm;
