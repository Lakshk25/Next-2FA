import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "./routes";

const { auth } = NextAuth(authConfig);

// return null means that route is allowed

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    // if user is not logged in , they can access this routes
    if(isApiAuthRoute){
        return null;
    }

    if(isAuthRoute){
        // if logged in prevent user to go on login and signup page
        if(isLoggedIn){
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
        }
        return null;
    }

    // if not logged in protect (isAuthRoute) and return them to login page
    if(!isLoggedIn && !isPublicRoute){
        let callbackUrl = nextUrl.pathname;

        // user redirected to their last visited page before log out
        if(nextUrl.search){
            callbackUrl += nextUrl.search;
        }
        const encodedCallbackUrl = encodeURIComponent(callbackUrl);

        return Response.redirect(new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl))
    }

    // else on other routes allow them
    return null;
})

// runs middleware for all paths 
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],       // clerk docs middleware
}