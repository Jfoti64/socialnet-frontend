# SocialNet Frontend

SocialNet is a social networking platform. This repository contains the frontend code built with React and Vite.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Development](#development)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Introduction

SocialNet is a social networking application that allows users to create profiles, post updates, send friend requests, and more. This repository contains the frontend codebase, which interacts with the backend to provide a seamless user experience.

## Features

- User authentication and authorization
- Profile creation
- Posting updates with text
- Sending and accepting friend requests
- Viewing and interacting with posts
- Responsive design

## Technologies

- **React**: A JavaScript library for building user interfaces
- **Vite**: Next Generation Frontend Tooling
- **React Router**: For routing
- **Axios**: For making HTTP requests
- **Tailwind CSS**: For styling
- **React Hook Form**: For handling form validation
- **Yup**: For form validation schema

## Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/yourusername/socialnet-frontend.git
   cd socialnet-frontend
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

## Development

To run the project locally:

1. **Start the development server:**

   ```sh
   npm run dev
   ```

2. **Open your browser and navigate to:**

   ```
   http://localhost:3000
   ```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```
VITE_API_BASE_URL=https://your-backend-api-url
```

## Testing

To run tests, use the following command:

```sh
npm run test
```

## Deployment

To deploy this project on Netlify, follow these steps:

1. **Build the project:**

   ```sh
   npm run build
   ```

2. **Deploy the `dist` directory to Netlify.**

### Netlify Configuration

Ensure your `netlify.toml` file is configured correctly:

```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_BASE_URL = "https://your-backend-api-url"
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.