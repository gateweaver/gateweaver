import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const checkAuthorization = (request: Request) => {
  if (request.headers.get("Authorization") !== "Bearer mock-server-token") {
    return new HttpResponse("Unauthorized access", { status: 401 });
  }
};

const getBodyMessage = async (request: Request) => {
  const { name } = (await request.json()) as { name: string };
  return `Hello, ${name}!`;
};

const successResponse = (message: string, status: number = 200) => {
  return HttpResponse.json(
    { message },
    {
      status,
      headers: {
        "remove-header": "Header to remove",
        "replace-header": "Header to replace",
      },
    },
  );
};

const handlers = [
  http.get("https://example.com/api", ({ request }) => {
    checkAuthorization(request);

    const url = new URL(request.url);
    const message = url.searchParams.get("message");

    if (!message) {
      return new HttpResponse("Message not found", { status: 404 });
    }

    return successResponse(message);
  }),

  http.post("https://example.com/api", async ({ request }) => {
    checkAuthorization(request);

    const message = await getBodyMessage(request);

    return successResponse(message, 201);
  }),

  http.put("https://example.com/api", async ({ request }) => {
    checkAuthorization(request);

    const message = await getBodyMessage(request);

    return successResponse(message);
  }),

  http.patch("https://example.com/api", async ({ request }) => {
    checkAuthorization(request);

    const message = await getBodyMessage(request);

    return successResponse(message);
  }),

  http.delete("https://example.com/api", ({ request }) => {
    checkAuthorization(request);

    const message = "Delete message from mock server";

    return successResponse(message);
  }),
];

export const mockServer = setupServer(...handlers);
