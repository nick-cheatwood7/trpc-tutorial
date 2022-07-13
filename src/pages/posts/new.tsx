import { useRouter } from "next/router";
import React from "react";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { trpc } from "../../utils/trpc";

interface NewPostPageProps {}

export const NewPostPage: React.FC<NewPostPageProps> = ({}) => {
    const { handleSubmit, register } = useForm<CreatePostInput>();
    const router = useRouter();
    const { mutate, error } = trpc.useMutation(["post.createPost"], {
        onSuccess: ({ id }) => {
            router.push(`/posts/${id}`);
        }
    });
    const onSubmit = (values: CreatePostInput) => {
        mutate(values);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && error.message}
            <h1>Create Post</h1>
            <input
                type='text'
                placeholder='Your Post Title'
                {...register("title")}
            />
            <br />
            <textarea
                placeholder='What do you want to say?'
                {...register("body")}
            />
            <button type='submit'>Create Post</button>
        </form>
    );
};

export default NewPostPage;
