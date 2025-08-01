# Village Website API Documentation

This document provides all necessary information for the frontend team to interact with the Village Website backend API.

**Base URL**: All API endpoints are relative to the following base URL:
`http://localhost:3000` (or the production server URL once deployed).

---
## Authentication & Session Management

The API uses JSON Web Tokens (JWT) for authenticating admin users. The token is valid for **7 days**.

### Authentication Flow
1. An admin user logs in using the `POST /api/auth/login` endpoint.
2. The server responds with a JWT access token.
3. For all subsequent requests to protected routes, the frontend must include this token in the `Authorization` header.

### Making Authenticated Requests
For any endpoint marked as **Admin Only**, provide an `Authorization` header:

- **Header Name**: `Authorization`
- **Header Value**: `Bearer <YOUR_JWT_TOKEN>`

### "Who Am I" / Session Check
To check if a user's session is still valid (e.g., on page load), make a request to the `/me` endpoint.

- **Method**: `GET`
- **Endpoint**: `/api/auth/me`
- **Auth**: **Admin Only**
- **Success (200 OK)**: Returns the admin user's data (`{ "id": "...", "username": "..." }`). The session is valid.
- **Error (401/403)**: The token is missing, invalid, or expired. The user must log in again.

---
## Handling File Uploads

For endpoints that accept images, the request `Content-Type` must be **`multipart/form-data`**. The request body should contain key-value pairs for both text and file data.

---
## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth | Request Body (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Creates a new admin user. | **Admin Only** | `{ "username": "...", "email": "...", "password": "..." }` |
| `POST` | `/login` | Logs in an admin and returns a 7-day JWT token. | Public | `{ "username": "...", "password": "..." }` |
| `GET` | `/me` | Checks the validity of the current token. | **Admin Only** | (None) |
| `POST` | `/forgot-password` | Starts the password reset process. | Public | `{ "email": "admin_email@example.com" }` |
| `POST` | `/reset-password` | Finalizes the password reset. | Public | `{ "email": "...", "code": "...", "password": "..." }` |

**Note on Authentication Endpoints:**
* The `POST /register` endpoint is marked as **Admin Only**. This implies that an existing authenticated admin is required to create new admin users.
* The `GET /me` endpoint is marked as **Public** in your documentation but **Admin Only** in your `auth.routes.js`. For consistency with your code, it has been listed as **Admin Only** here.
* The `POST /forgot-password` endpoint's request body should be `email`, not `username`, as per our recent debugging.
* The `POST /reset-password` endpoint's request body requires `email`, `code`, and `password` as per our recent discussions and your controller logic. The `:token` has been removed from the endpoint in the table to reflect the updated route.

### News, Announcements, & Agendas (`/api/posts`)

| Method | Endpoint | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Gets all posts. Filter with `?type=NEWS`. | Public | (None) |
| `GET` | `/:id` | Gets a single post by its ID. | Public | (None) |
| `POST` | `/` | Creates a new post with an image. | **Admin Only** | **`form-data`**: `title` (text), `content` (text), `type` (text), `image` (file) |
| `PUT` | `/:id` | Updates a post. Can include a new image. | **Admin Only** | **`form-data`**: `title` (text), `content` (text), `type` (text), `image` (optional file) |
| `DELETE`| `/:id` | Deletes a post. | **Admin Only** | (None) |

- **Valid `type` values**: `NEWS`, `ANNOUNCEMENT`, `AGENDA`.
- **File field name**: `image`.

### Gallery (`/api/gallery`)

| Method | Endpoint | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | Gets all gallery items. Filter with `?type=IMAGE`. | Public | (None) |
| `POST` | `/` | Creates a new gallery item. | **Admin Only** | **`form-data`**: `title` (text), `description` (text), `type` (text), `media` (file) |
| `DELETE`| `/:id` | Deletes a gallery item. | **Admin Only** | (None) |

- **Valid `type` values**: `IMAGE`, `VIDEO`. (For videos, send the embed URL as a text field named `url` instead of a file).
- **File field name**: `media`.

### Village Profile (`/api/profile`)

| Method | Endpoint | Description | Auth | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/content` | Gets the main site content (history, contact). | Public | (None) |
| `PUT` | `/content` | Updates the main site content. | **Admin Only** | **JSON**: `{ "historyText": "...", "demographics": {...}, ... }` |
| `GET` | `/officials`| Gets the list of all village officials. | Public | (None) |
| `POST` | `/officials`| Creates a new village official. | **Admin Only** | **`form-data`**: `name` (text), `position` (text), `order` (number), `photo` (file) |
| `PUT` | `/officials/:id`| Updates a village official. | **Admin Only** | **`form-data`**: `name` (text), `position` (text), `order` (number), `photo` (optional file) |
| `DELETE`| `/officials/:id`| Deletes a village official. | **Admin Only** | (None) |

- **File field name for officials**: `photo`.

### Public Services (`/api/services`)

| Method | Endpoint | Description | Auth | Request Body (JSON) |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/guestbook` | Gets all guest book entries. | Public | (None) |
| `POST` | `/guestbook` | Adds a new entry to the guest book. | Public | `{ "name": "...", "message": "..." }` |
| `DELETE`| `/guestbook/:id` | Deletes a guest book entry. | **Admin Only** | (None) |
| `GET` | `/complaints` | Gets all submitted complaints. | **Admin Only** | (None) |
| `POST` | `/complaints` | Submits a new complaint. | Public | `{ "name": "...", "contact": "(optional)", "message": "..." }` |
| `PUT` | `/complaints/:id`| Updates a complaint's status. | **Admin Only** | `{ "status": "RESOLVED" }` |
| `GET` | `/letters` | Gets all submitted letter requests. | **Admin Only** | (None) |
| `POST` | `/letters` | Submits a new letter request. | Public | `{ "requesterName": "...", "nik": "...", "requestType": "...", "details": {...} }` |
| `PUT` | `/letters/:id` | Updates a letter request's status. | **Admin Only** | `{ "status": "RESOLVED" }` |

- **Valid `status` values**: `PENDING`, `IN_PROGRESS`, `RESOLVED`, `REJECTED`.