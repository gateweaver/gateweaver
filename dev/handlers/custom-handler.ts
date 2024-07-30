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
/**
 * @openapi
 * /handler/{postId}:
 *   get:
 *     summary: Custom handler for posts
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TransformedPost'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 *
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         userId:
 *           type: number
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         body:
 *           type: string
 *     TransformedPost:
 *       type: object
 *       properties:
 *         id:
 *           type: number
 *         title:
 *           type: string
 *         snippet:
 *           type: string
 */
export const customHandler = async (req: Request, res: Response) => {
  try {
    const postId = req.params.postId;

    if (!postId) {
      res.status(400).json({ error: "postId is required" });
      return;
    }

    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}`,
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch posts: ${response.status} ${response.statusText}`,
      );
    }

    const post: Post = await response.json();

    const transformedPost: TransformedPost = {
      id: post.id,
      title: post.title,
      snippet: post.body.slice(0, 100) + (post.body.length > 100 ? "..." : ""),
    };

    res.json(transformedPost);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};

export const components = {
  schemas: {
    Post: {
      type: "object",
      properties: {
        userId: {
          type: "number",
        },
        id: {
          type: "number",
        },
        title: {
          type: "string",
        },
        body: {
          type: "string",
        },
      },
    },
    TransformedPost: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        title: {
          type: "string",
        },
        snippet: {
          type: "string",
        },
      },
    },
  },
};

export const paths = {
  "/handler/{postId}": {
    get: {
      summary: "Custom handler for posts",
      parameters: [
        {
          in: "path",
          name: "postId",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      responses: {
        200: {
          description: "Successful response",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/TransformedPost",
              },
            },
          },
        },
        500: {
          description: "Server error",
        },
      },
    },
  },
};
