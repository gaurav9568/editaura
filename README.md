# Video Editing Agency Web App

This is a Next.js application built for a video editing agency. The project provides a professional landing page and a secure admin panel for managing packages, video links, FAQs, and more. Both the frontend and backend are powered by Next.js, styled with TailwindCSS, and deployed on Vercel.

## Live Demo

The app is live at [https://thepremieredits.com](https://thepremieredits.com)  
You can view the client-facing landing page there.

---

## Features

- **Landing Page** (`/`): Public-facing site for clients to view services, pricing, testimonials, and contact information.
- **Admin Panel** (`/admin`): Secure dashboard for the agency to manage content such as packages, video links, and FAQs.
- **Authentication**: JWT-based authentication for admin access.
- **Database**: Uses MongoDB for persistent data storage.
- **Styling**: Built with TailwindCSS for fast and responsive design.
- **Deployment**: Ready to deploy on Vercel.

---

## Getting Started

### 1. Clone the Repository

```bash
https://github.com/MHamzaAamir/video-portfolio-website.git
cd video-portfolio-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB connection string
MONGODB_URI=your_mongodb_connection_string

# Secret key for JWT authentication
JWT_SECRET=your_super_secret_jwt_key
```

**Note:**  
- Replace `your_mongodb_connection_string` with your actual MongoDB URI.
- Replace `your_super_secret_jwt_key` with a strong, random string.

### 4. Admin Account Setup

To log in to the `/admin` panel, you need at least one admin account in your MongoDB database.  
Create a document in the `admins` collection with the following structure:

```json
{
  "username": "your_admin_username",
  "passwordHash": "bcrypt_hashed_password"
}
```
- The `passwordHash` field must contain a password hashed using [bcrypt](https://www.npmjs.com/package/bcrypt).
- You can generate a bcrypt hash using a Node.js script or an online tool. Example with Node.js:
  ```js
  const bcrypt = require('bcrypt');
  const password = 'your_plaintext_password';
  bcrypt.hash(password, 10).then(console.log);
  ```
- Insert the resulting document into your `admins` collection using MongoDB Compass or Atlas.

### 5. Running the App Locally

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

- **Landing Page:** [http://localhost:3000/](http://localhost:3000/)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Deployment

This app is ready to deploy on [Vercel](https://vercel.com/):

1. Push your code to GitHub, GitLab, or Bitbucket.
2. Import your repository into Vercel.
3. Set the environment variables `MONGODB_URI` and `JWT_SECRET` in your Vercel project dashboard.
4. Deploy!

---

