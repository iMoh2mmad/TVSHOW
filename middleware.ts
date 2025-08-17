import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // Admin routes protection
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (req.nextauth.token?.role !== 'admin') {
        return Response.redirect(new URL('/', req.url));
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (!req.nextUrl.pathname.startsWith('/admin')) {
          return true;
        }
        
        // Require authentication for admin routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*']
};