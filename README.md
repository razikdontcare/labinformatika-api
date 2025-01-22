# Lab Informatika API

This is the official API for Lab Informatika. It provides endpoints for managing projects and user authentication.

## Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/razikdontcare/labinformatika-api.git
    cd labinformatika-api
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Rename `.env.example` to `.env` and fill in the required environment variables:
    ```sh
    mv .env.example .env
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

The server should now be running on `http://localhost:8000`

## Scripts

- `npm run dev`: Start the development server with hot reloading.
- `npm run build`: Compile the TypeScript code to JavaScript.
- `npm start`: Start the production server using PM2.

## Environment Variables

- `FIREBASE_CLIENT_EMAIL`: Firebase client email.
- `FIREBASE_PRIVATE_KEY`: Firebase private key.
- `FIREBASE_PROJECT_ID`: Firebase project ID.
- `IMAGEKIT_PUBLIC_KEY`: ImageKit public key.
- `IMAGEKIT_PRIVATE_KEY`: ImageKit private key.
- `IMAGEKIT_URL_ENDPOINT`: ImageKit URL endpoint.

## Production Deployment

1. Build the project:
    ```sh
    npm run build
    ```

2. Start the production server:
    ```sh
    npm start
    ```

The server should now be running in production mode using PM2.
This using `pm2-runtime` to make sure it's running properly in dockerized environment.

## API Routes

### Authentication Routes

- `POST /auth/login`: Login with username and password.
  - **Body**: `{ "username": "string", "password": "string" }`
- `POST /auth/register`: Register a new user.
  - **Body**: `{ "username": "string", "password": "string", "email": "string", "role": "string", "emailVerified": "boolean" }`
- `GET /auth/users`: List all users (admin only).
- `GET /auth/generate-id`: Generate a new user ID.
- `POST /auth/upload-image`: Upload a profile image.
  - **Body**: `FormData` with `file` and optional `filename`
- `PUT /auth/update`: Update user information.
  - **Body**: `{ "id": "string", "username": "string", "email": "string", "role": "string", "emailVerified": "boolean" }`
- `POST /auth/check-username`: Check if a username exists.
  - **Body**: `{ "username": "string" }`
- `POST /auth/check-email`: Check if an email exists.
  - **Body**: `{ "email": "string" }`

### Project Routes

- `POST /project/upload-image`: Upload an image for a project.
  - **Body**: `FormData` with `file` and optional `filename`
- `GET /project/generate-id`: Generate a new project ID.
- `POST /project/add`: Add a new project.
  - **Body**: `{ "id": "string", "name": "string", "description": "string", "picture": { "url": "string", "id": "string" }, "createdAt": "Date", "updatedAt": "Date" }`
- `GET /project/get/:id`: Get a project by ID.
  - **Params**: `id` (string)
- `GET /project/list`: List all projects.
- `DELETE /project/delete/:id`: Delete a project by ID.
  - **Params**: `id` (string)
- `PUT /project/update/:id`: Update a project by ID.
  - **Params**: `id` (string)
  - **Body**: `{ "name": "string", "description": "string", "picture": { "url": "string", "id": "string" }, "updatedAt": "Date" }`

## Middleware

- **Authorization Middleware**: Verifies the ID token for protected routes.
- **Logging Middleware**: Logs the request method and path with the date and time.

## Contributors

- [Razik](https://github.com/razikdontcare)
