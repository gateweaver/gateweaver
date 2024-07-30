import { Request, Response } from "express";

interface CreatePostRequest {
  title: string;
  body: string;
  userId: number;
}

interface CreatePostResponse {
  id: number;
  title: string;
  body: string;
  userId: number;
}

/**
 * @openapi
 * /posts:
 *   post:
 *     summary: Create a new post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostRequest'
 *     responses:
 *       201:
 *         description: Successfully created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreatePostResponse'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     CreatePostRequest:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - userId
 *       properties:
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         userId:
 *           type: number
 *     CreatePostResponse:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         body:
 *           type: string
 *         userId:
 *           type: number
 */
export const createPostHandler = async (req: Request, res: Response) => {
  try {
    const { title, body, userId }: CreatePostRequest = req.body;

    // Input validation
    if (!title || !body || !userId) {
      res.status(400).json({ error: "title, body, and userId are required" });
      return;
    }

    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        title,
        body,
        userId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create post: ${response.status} ${response.statusText}`,
      );
    }

    const createdPost: CreatePostResponse = await response.json();

    res.status(201).json(createdPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
