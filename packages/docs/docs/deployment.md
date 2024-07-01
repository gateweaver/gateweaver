---
sidebar_position: 5
---

# Deployment

Deploying Gateweaver can be streamlined using Docker. Begin by creating a Dockerfile in the same directory as your `gateweaver.yml` configuration file. Here's a simple Dockerfile to get you started:

```Dockerfile title="Dockerfile"
FROM gateweaver/server:<version>
COPY gateweaver.yml /app/gateweaver.yml

# Copy handlers and middleware if they exist and are being used
COPY handlers /app/handlers
COPY middleware /app/middleware

ENV NODE_ENV=production
```

This Dockerfile uses the official Gateweaver server image as the base. The `COPY` commands add your `gateweaver.yml` configuration file, handlers, and middleware to the `/app` directory, which is the working directory of the server. If you're not using custom handlers or middleware, you can omit those `COPY` lines. The `NODE_ENV` environment variable is set to production to ensure that Gateweaver runs in production mode. This setup allows Gateweaver to find your configuration and custom code at runtime, integrating seamlessly with the prebuilt server in the base image.

:::note
Ensure to replace `<version>` with the specific version of Gateweaver you are using. If you have been developing locally using the CLI, it is best to use the same version of `@gateweaver/cli` from your project's `package.json` to maintain compatibility. You can also find the latest version of the Gateweaver server image on the [Docker Hub page](https://hub.docker.com/r/gateweaver/server).
:::

## Deploying with Cloud Services

For an even smoother deployment experience, consider using a cloud service like Render or Google Cloud Run. These platforms offer a hassle-free way to deploy your Gateweaver server by leveraging the power of containers. Here’s a general approach to follow:

1. **Prepare Your Repository:** Ensure your project, including the `Dockerfile` and `gateweaver.yml`, is pushed to your source code repository.

2. **Choose a Deployment Service:** Services like Render and Google Cloud Run simplify the deployment process by building containers directly from your repository.

3. **Configure the Service:** While each service has its own setup process, you'll typically need to:

   - Point the service to your repository.
   - Specify the location of your `Dockerfile`.
   - Configure any necessary environment variables.

4. **Deploy:** Follow the service's instructions to deploy your application. These platforms take care of the complexities of container building and deployment, allowing you to focus on development.

:::note
Make sure to set the `NODE_ENV` environment variable to `production` to ensure that Gateweaver runs in production mode.
:::

Remember, this guide provides a general overview. For specific details, consult the documentation of the deployment service you choose to use.

Here are some resources to help you get started with popular deployment services:

- [Render Documentation](https://docs.render.com/docker#getting-started-with-docker-containers)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build)

While this guide highlights deployment using Docker and specific cloud services, it's important to note that the Dockerfile provided can be utilized in a variety of deployment environments. Whether you prefer to deploy your application on a bare-metal server, a different cloud provider, or even a Kubernetes cluster, the flexibility of Docker ensures you can easily adapt the deployment process to fit your preferred infrastructure. Choose the deployment method that best aligns with your operational requirements and expertise.

:::note
If you choose not to use Docker, you can still deploy the Gateweaver server, but it's advisable for Gateweaver to have its own package.json file to avoid installing unnecessary dependencies from the rest of your project. Once set up, you can start the server using the `gateweaver start` command.
:::
