import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

interface RegisterPageProps {}

export const RegisterPage: React.FC<RegisterPageProps> = ({}) => {
    const { handleSubmit, register } = useForm<CreateUserInput>();
    const router = useRouter();
    const { mutate, error } = trpc.useMutation(["users.register"], {
        onSuccess: () => {
            router.push("/login");
        }
    });

    const onSubmit = (values: CreateUserInput) => {
        mutate(values);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                {error && error.message}
                <h1>Register</h1>
                <input
                    type='email'
                    placeholder='jane.does@example.com'
                    {...register("email")}
                />
                <br />
                <input
                    type='text'
                    placeholder='Jane'
                    {...register("firstName")}
                />
                <br />
                <input
                    type='text'
                    placeholder='Doe'
                    {...register("lastName")}
                />
                <br />
                <input
                    type='password'
                    placeholder='********'
                    {...register("password")}
                />
                <button type='submit'>Submit</button>
            </form>
            <Link href='/login'>Login</Link>
        </>
    );
};

export default RegisterPage;
