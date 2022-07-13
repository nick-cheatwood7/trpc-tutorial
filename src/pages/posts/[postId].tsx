import Error from "next/error";
import { useRouter } from "next/router";
import React from "react";
import { trpc } from "../../utils/trpc";

interface SinglePostProps {}

const SinglePost: React.FC<SinglePostProps> = ({}) => {
    const router = useRouter();
    const postId = router.query.postId as string;
    const { data, isLoading } = trpc.useQuery([
        "post.postById",
        { id: postId }
    ]);

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (!data) {
        return <Error statusCode={404} />;
    }

    return (
        <div>
            <h1>{data.title}</h1>
            <p>{data.body}</p>
        </div>
    );
};

export default SinglePost;
