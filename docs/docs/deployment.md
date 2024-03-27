---
sidebar_position: 5
---

# Deployment

Deploying the Gateweaver server can be streamlined using Docker. Begin by creating a Dockerfile in the same directory as your `gateweaver.yaml` configuration file. Here's a simple template to get started:

```Dockerfile title="Dockerfile"
FROM gateweaver/server:<version>
COPY gateweaver.yaml /app/gateweaver.yaml
ENV NODE_ENV=production
```

This Dockerfile uses the official Gateweaver server image as the base image and copies your `gateweaver.yaml` configuration file into the container. The `NODE_ENV` environment variable is set to `production` to ensure that Gateweaver runs in production mode.

**Note:** Ensure to replace `<version>` with the specific version of Gateweaver you are using. If you have been developing locally using the CLI, it is best to use the same version of `@gateweaver/cli` from your project's `package.json` to maintain compatibility. You can also find the latest version of the Gateweaver server image on the [Docker Hub page](https://hub.docker.com/r/gateweaver/server).

## Deploying with Cloud Services

For an even smoother deployment experience, consider using a cloud service like Render or Google Cloud Run. These platforms offer a hassle-free way to deploy your Gateweaver server by leveraging the power of containers. Here’s a general approach to follow:

1. **Prepare Your Repository:** Ensure your project, including the `Dockerfile` and `gateweaver.yaml`, is pushed to your source code repository.

2. **Choose a Deployment Service:** Services like Render and Google Cloud Run simplify the deployment process by building containers directly from your repository.

3. **Configure the Service:** While each service has its own setup process, you'll typically need to:

   - Point the service to your repository.
   - Specify the location of your `Dockerfile`.
   - Configure any necessary environment variables or settings specific to Gateweaver.

4. **Deploy:** Follow the service's instructions to deploy your application. These platforms take care of the complexities of container building and deployment, allowing you to focus on development.

:::tip
Make sure to set the `NODE_ENV` environment variable to `production` to ensure that Gateweaver runs in production mode.
:::

Remember, this guide provides a general overview. For specific details, consult the documentation of the deployment service you choose to use.

Here are some resources to help you get started with popular deployment services:

- [Render Documentation](https://docs.render.com/docker#getting-started-with-docker-containers)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs/continuous-deployment-with-cloud-build)

While this guide highlights deployment using Docker and specific cloud services, it's important to note that the Dockerfile provided can be utilized in a variety of deployment environments. Whether you prefer to deploy your application on a bare-metal server, a different cloud provider, or even a Kubernetes cluster, the flexibility of Docker ensures you can easily adapt the deployment process to fit your preferred infrastructure. Choose the deployment method that best aligns with your operational requirements and expertise.
