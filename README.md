## Link [Next 2FA](https://next-2-fa.vercel.app)

# AuthShield

AuthShield is a robust authentication system built with Next.js, Auth0, Prisma, Tailwind CSS, TypeScript, Shadcn, Resend, React, and Zod. It provides seamless user authentication, including options for social login via Google and GitHub OAuth providers, as well as traditional email registration with email verification. Additionally, AuthShield supports two-factor authentication for enhanced security.

## Features

- **Social Login**: Users can sign in using their Google or GitHub accounts via OAuth providers.
- **Email Registration**: Users can create accounts using their email addresses. Upon registration, an email verification link is sent to the user's email for account activation.
- **Email Verification**: AuthShield ensures account security by requiring users to verify their email addresses. This helps prevent unauthorized access and ensures the integrity of user accounts.
- **Two-Factor Authentication (2FA)**: Users can enable two-factor authentication for an extra layer of security. A 6-digit verification code is sent to the user's email for authentication during login.

## Tech Stack

- **Next.js**: A React framework for building server-side rendered and statically generated web applications.
- **Auth0**: A flexible authentication and authorization platform, used here for managing authentication flows and integrating OAuth providers.
- **Prisma**: A modern database toolkit for TypeScript and Node.js that simplifies database access with type-safe queries.
- **Tailwind CSS**: A utility-first CSS framework for building custom designs quickly and without writing custom CSS.
- **TypeScript**: A statically typed superset of JavaScript that enhances code quality and developer productivity.
- **Shadcn**: (Could not find any specific information on this library, assuming it's a custom or internal library. Please update with accurate information.)
- **Resend**: (Could not find any specific information on this library, assuming it's a custom or internal library. Please update with accurate information.)
- **React**: A JavaScript library for building user interfaces.
- **Zod**: A TypeScript-first schema declaration and validation library, used here for data validation.

## Getting Started

1. **Clone the repository**:

   ```bash
   git clone <repository-url>


2. **Install dependencies:**:

   ```bash
   npm install


3. **Install dependencies:**:

   ```bash
   npm run dev

# Environment Variables

To run the AuthShield project, you need to set up the following environment variables:

- `DATABASE_URL`: Connection URL for your PostgreSQL database.
- `AUTH_SECRET`: Secret key used for authentication.
- `GITHUB_CLIENT_ID`: Client ID for GitHub OAuth.
- `GITHUB_CLIENT_SECRET`: Client secret for GitHub OAuth.
- `GOOGLE_CLIENT_ID`: Client ID for Google OAuth.
- `GOOGLE_CLIENT_SECRET`: Client secret for Google OAuth.
- `RESEND_API_KEY`: API key for Resend service.
- `NEXT_PUBLIC_URL`: Public URL for your project, typically `http://localhost:3000`.

Please replace the placeholder values with your actual credentials before running the project.

