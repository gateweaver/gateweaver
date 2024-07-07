import { Request, Response } from "express";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface TransformedPost {
  id: number;
  title: string;
  snippet: string;
}

export const customHandler = async (_: Request, res: Response) => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts: ${response.status} ${response.statusText}`,
      );
    }
    const posts: Post[] = await response.json();

    const transformedPosts: TransformedPost[] = posts.map((post) => ({
      id: post.id,
      title: post.title,
      snippet: post.body.slice(0, 100) + (post.body.length > 100 ? "..." : ""),
    }));

    res.json(transformedPosts);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
