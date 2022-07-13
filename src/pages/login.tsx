import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { LoginInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

const LoginForm = dynamic(() => import("../components/LoginForm"), {
    ssr: false
});

interface LoginPageProps {}

export const LoginPage: React.FC<LoginPageProps> = ({}) => {
    return (
        <div>
            <LoginForm />
        </div>
    );
};

export default LoginPage;
