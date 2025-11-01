# MERN Blog Manager

A full-stack MERN application designed for creating, managing, and sharing blog content. It features an interactive dashboard for content management and a clean, public-facing view for individual posts. The application is built with a modern tech stack, including secure authentication via Clerk, a RESTful API backend, and a responsive React frontend styled with Tailwind CSS.

The project serves as a comprehensive demonstration of MERN stack integration — from API design and database modeling to component-based frontend architecture and state management.

## Deployment

- **Frontend (Netlify):** [https://mern-blog-manager-v2.netlify.app/](https://mern-blog-manager.netlify.app/)
- **Backend (Render):** [https://mern-stack-integration-masmunge95.onrender.com/](https://mern-stack-integration-masmunge95.onrender.com/)

## Features

- **Full CRUD for Posts & Categories**: Create, read, update, and delete posts and their categories through a sleek admin dashboard.
- **Role-Based Authentication**: Secure user management with [Clerk](https://clerk.com/), featuring distinct roles for 'Editors' (content creators) and 'Viewers' (readers/commenters).
- **Content Ownership**: Editors have full control over their own posts and categories, which are cloned from system templates, ensuring content isolation.
- **Featured Image Uploads**: Upload and manage featured images for your blog posts using `multer`.
- **Unique View Count**: Posts track unique views from 'Viewers' over a 24-hour period, providing more accurate engagement metrics.
- **Comments System**: Logged-in users can comment on posts, with ownership rules allowing them to edit or delete their own comments.
- **Server-Side Validation**: Robust backend validation with `express-validator` to maintain data integrity.
- **Dark/Light Mode**: Built-in theme switching powered by React Context.
- **Pagination**: Smooth navigation even for large datasets of posts and categories.
- **Searching and Filtering**: Public post list includes dynamic filtering by category and searching by tags.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, React Router  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB with Mongoose  
- **Authentication**: Clerk  
- **API Communication**: Axios  
- **File Uploads**: Multer  

## Screenshots

| Public Homepage View | Editor Dashboard View |
|:--------------------:|:---------------------:|
| <img src="client/public/Dashboard-view.png" alt="Public Homepage View" height="220" /> | <img src="client/public/Editor-view.png" alt="Editor Dashboard View" height="220" /> |

| Reader View (Latest Posts) | Mobile Responsive View |
|:--------------------------:|:----------------------:|
| <img src="client/public/Reader-view.png" alt="Reader View (Latest Posts)" height="220" /> | <img src="client/public/Small-screen-view.png" alt="Mobile Responsive View" height="220" /> |

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── assets/         # Logo file directory
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── utils/          # Frontend utility functions
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── uploads/            # File uploads directory
│   ├── utils/              # Backend utility functions
│   ├── server.js           # Main server file
│   ├── netlify.toml        # Netlify configuration
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Clerk account for authentication keys
- [ngrok](https://ngrok.com/download) for handling webhooks in local development

### 1. Clone the Repository
First, clone the project to your local machine.

```bash
git clone https://github.com/PLP-MERN-Stack-Development/plp-mern-stack-development-classroom-mern-stack-integration-MERN-Stack-Week4.git
cd mern-blog
```

### 2. Backend Setup
Navigate to the server directory and install the required dependencies.

```bash
cd server
npm install
```

Next, create a `.env` file in the `server` directory by copying the `server/.env.example` file and adding your configuration values.

```ini
# server/.env
NODE_ENV=development
PORT=5000
MONGO_URI="your_mongodb_connection_string"
CLERK_SECRET_KEY="your_clerk_secret_key_starting_with_sk_..."
CLERK_WEBHOOK_SECRET_LOCAL="your_local_webhook_secret_starting_with_whsec_..."
CLERK_WEBHOOK_SECRET_PUBLISHED="your_production_webhook_secret_starting_with_whsec_..."
```

### 3. Frontend Setup
In a new terminal, navigate to the client directory and install its dependencies.

```bash
cd client
npm install
```

Then, create a `.env` file in the client directory by copying the `client/.env.example` file and add your configuration values.

```ini
# client/.env
VITE_API_URL="your_production_backend_url"
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key_starting_with_pk_..."
```

### 4. Clerk Configuration
1. **API Keys**: In your Clerk Dashboard, go to *API Keys* and copy your Publishable key and Secret key into the respective `.env` files.  
2. **JWT Template**: Go to *JWT Templates*, create a new template named `Metadata-claims`, and add a new claim with:

```bash
   {
	"metadata": "{{user.public_metadata}}"
   }
```

   Set this template as the default.  
3. **Webhooks**:  
   - **Production**: Set the URL to `https://<your-backend-url>/api/webhooks/clerk`. Subscribe to the `user.created` event. Copy the signing secret to `CLERK_WEBHOOK_SECRET_PUBLISHED`.  
   - **Local Development**: Run `ngrok http 5000` and use the public URL it provides (e.g., `https://<random-string>.ngrok-free.app/api/webhooks/clerk`). Subscribe to `user.created` and copy the secret to `CLERK_WEBHOOK_SECRET_LOCAL`.

### 5. Run the Application
You will need two separate terminal windows to run both the client and server concurrently.

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

The application will be available at [http://localhost:5173](http://localhost:5173).  
For local webhook testing, you will also need a third terminal running `ngrok http 5000`.

### 6. Deploy to Netlify
To deploy the frontend of this application, you will use Netlify. Since you won't have permissions to connect the original classroom repository, you must first create your own fork.

1.  **Fork the Repository**: Go to the main repository page on GitHub and click the "Fork" button to create a copy under your own account.
2.  **Create a New Netlify Site**: Log in to your Netlify account and click "Add new site" > "Import an existing project".
3.  **Connect to GitHub**: Choose GitHub and authorize Netlify to access your repositories. Select the fork you just created.
4.  **Configure Build Settings**: Configure the site with the following settings to ensure it builds correctly:
    -   **Base directory**: `client`
    -   **Build command**: `npm run build`
    -   **Publish directory**: `client/dist`
5.  **Add Environment Variables**: Before deploying, go to **Site configuration > Environment variables** and add the following:
    -   `VITE_API_URL`: The URL of your deployed backend (e.g., from Render).
    -   `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key.
    -   `NPM_FLAGS`: Set the value to `--legacy-peer-deps`. This is crucial to prevent build failures due to peer dependency conflicts.
6.  **Deploy Site**: Click "Deploy site". Netlify will start the build process and deploy your frontend.

### 7. Deploy to Render (Backend)
To deploy the backend, you can use a service like Render.

1.  **Create a New Web Service**: In your Render dashboard, click "New +" and select "Web Service".
2.  **Connect Repository**: Connect the GitHub repository fork you created.
3.  **Configure Settings**: Fill in the details for your service:
    -   **Name**: Give your service a name (e.g., `mern-blog-backend`).
    -   **Root Directory**: `server`
    -   **Build Command**: `npm install`
    -   **Start Command**: `npm start`
    -   **Node Version**: Select 18 or later.
4.  **Add Environment Variables**: Go to the "Environment" tab and add the following variables. **This is a critical step.**
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `CLERK_SECRET_KEY`: Your Clerk Secret Key (starts with `sk_...`).
    -   `CLERK_WEBHOOK_SECRET_PUBLISHED`: Your production webhook signing secret from the Clerk dashboard.
    -   `NODE_ENV`: Set this to `production`.

5.  **Create Web Service**: Click "Create Web Service". Render will build and deploy your backend.
6.  **Update URLs**:
    -   Once deployed, copy the new backend URL and update the `VITE_API_URL` environment variable in your Netlify site settings.
    -   Update your production webhook endpoint in the Clerk dashboard to point to your new Render URL (e.g., `https://<your-render-url>/api/webhooks/clerk`).


## API Documentation

| Method   | Endpoint                       | Description                                      | Access        |
|----------|--------------------------------|--------------------------------------------------|---------------|
| `GET`    | `/api/posts`                   | Get posts (published for public, all for editor) | Public/Editor |
| `POST`   | `/api/posts`                   | Create a new blog post                           | Editor        |
| `GET`    | `/api/posts/:id`               | Get a single post (public)                       | Public        |
| `GET`    | `/api/posts/authenticated/:id` | Get a single post (for logged-in users)          | Viewer/Editor |
| `PUT`    | `/api/posts/:id`               | Update a blog post by ID                         | Owner         |
| `PATCH`  | `/api/posts/:id/status`        | Update a post's status (draft, published, etc.)  | Owner         |
| `DELETE` | `/api/posts/:id`               | Delete a blog post by ID                         | Owner         |
| `POST`   | `/api/posts/:id/comments`      | Add a comment to a post                          | Viewer/Editor |
| `PUT`    | `/api/posts/:id/comments/:cid` | Update a user's own comment                      | Owner         |
| `DELETE` | `/api/posts/:id/comments/:cid` | Delete a user's own comment                      | Owner         |
| `GET`    | `/api/categories`              | Get categories (public or user-specific)         | Public/Editor |
| `POST`   | `/api/categories`              | Create a new category                            | Editor        |
| `PUT`    | `/api/categories/:id`          | Update a category by ID (copy-on-edit)           | Owner         |
| `DELETE` | `/api/categories/:id`          | Delete a category by ID                          | Owner         |

## Troubleshooting

1. **Module Not Found Errors (Client)**  
   - **Issue:** Errors like `Failed to resolve import 'axios'` or missing dependencies.  
   - **Fix:** Run `npm install` in the `client` directory. Ensure packages such as `axios`, `react-router-dom`, and `prop-types` are installed.

2. **Incorrect Import Paths**  
   - **Issue:** Components fail to load due to misreferenced paths.  
   - **Fix:** A `@` alias was added in `vite.config.js` to reference the `src` directory for cleaner imports, e.g. `import Component from '@/components/Component'`.

3. **API 404 Errors in Development**  
   - **Issue:** Frontend requests to `/api/...` return 404.  
   - **Fix:** A proxy in `vite.config.js` forwards `/api` and `/uploads` requests to the backend server running on `http://localhost:5000`.

4. **500 Error on Deployed Backend (Render)**
   - **Issue:** The deployed backend returns a 500 Internal Server Error, and logs show "Missing Clerk Secret Key".
   - **Fix:** This means the `CLERK_SECRET_KEY` environment variable is missing or incorrect in your Render service. Go to your service's "Environment" tab in the Render dashboard and ensure the `CLERK_SECRET_KEY` is set correctly. It should be the key from your Clerk dashboard that starts with `sk_...`.

---

**Happy coding and blogging! 🚀**
