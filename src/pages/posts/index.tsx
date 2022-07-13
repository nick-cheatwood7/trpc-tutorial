import Link from "next/link";
import React from "react";
import { trpc } from "../../utils/trpc";

interface PostsPageProps {}

const PostsPage: React.FC<PostsPageProps> = ({}) => {
    const { data, isLoading } = trpc.useQuery(["post.posts"]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            {data?.map((post) => {
                return (
                    <article key={post.id}>
                        <p>{post.title}</p>
                        <Link href={`/posts/${post.id}`}>View Post</Link>
                    </article>
                );
            })}
        </div>
    );
};

export default PostsPage;
