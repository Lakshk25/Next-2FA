/*
    routes that are accessible to public without authentication
    @type {string[]}
*/

export const publicRoutes = [
    "/",
    "/auth/new-verification"
];

/*
    routes that are used for authentication
    @type {string[]}
*/

export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/new-password",
    "/auth/reset"
]

/*
    prefix for API aunthentication routes 
    used for authentication purpose
    @type {string}
*/

export const apiAuthPrefix = "/api/auth";

/*
    default redirect path after logging in
    @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = "/settings";


