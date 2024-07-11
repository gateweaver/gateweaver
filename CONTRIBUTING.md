# Contributing to Gateweaver

Thank you for your interest in contributing to Gateweaver! The following guidelines will help you get started with contributing effectively.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
  - [Submitting Changes](#submitting-changes)
- [Development Setup](#development-setup)
  - [Prerequisites](#prerequisites)
  - [Installing Dependencies](#installing-dependencies)
  - [Running Development Server](#running-development-server)
  - [Running Tests](#running-tests)

## Code of Conduct

We expect all contributors to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expectations for how to interact with others in the project.

## How to Contribute

### Reporting Bugs

If you encounter a bug, please [create an issue](https://github.com/gateweaver/gateweaver/issues/new) on GitHub with the following information:

- A clear and descriptive title.
- A description of the steps to reproduce the issue.
- Any relevant logs, screenshots, or other information that can help us understand the problem.

### Suggesting Features

We welcome new feature suggestions! If you have an idea to improve Gateweaver, please [open an issue](https://github.com/gateweaver/gateweaver/issues/new) with the following details:

- A clear and descriptive title.
- A detailed description of the proposed feature.
- Any additional context or examples that would help understand the feature.

### Submitting Changes

1. **Fork the repository** to your GitHub account.
2. **Clone the forked repository** to your local machine.
3. **Create a new branch** for your changes (use a descriptive name).
4. **Make your changes** and commit them with clear and descriptive messages.
5. **Push your changes** to your forked repository.
6. **Open a pull request** to the `main` branch of the original repository.

Please ensure your pull request includes a clear description of the changes and the problem they solve.

## Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [pnpm](https://pnpm.io/) (v8)

### Installing Dependencies

After cloning the repository, install the necessary dependencies:

```bash
pnpm install
```

### Running Development Server

To start the development server located in the `dev` directory, use the following command:

```bash
pnpm dev
```

### Running Tests

To run the tests, use the following command:

```bash
pnpm test
```

Make sure all tests pass before submitting your changes.
