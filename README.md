# StreamFlix - Netflix-like Streaming Platform

A full-stack streaming platform with Netflix-like UX for end-users and a comprehensive admin dashboard for content management. Built with modern web technologies and designed for legal content distribution.

## ✨ Features

### End-User Features
- **Netflix-style Interface**: Hero sections, content carousels, hover previews
- **Advanced Video Player**: HLS streaming support with quality selection and subtitles
- **Content Discovery**: Search, filtering, categories, trending, and recommendations
- **Responsive Design**: Mobile-first with RTL support for Arabic/English
- **Personal Lists**: Add/remove content from personal watchlists
- **Dark Theme**: Beautiful dark UI with smooth animations

### Admin Dashboard
- **Content Management**: Full CRUD for movies, series, seasons, and episodes
- **Series Builder**: Intuitive tree editor for managing complex series structures
- **People Management**: Cast and crew database with roles
- **Subtitle Management**: WebVTT subtitle tracks with preview
- **Web Scraper**: Configurable scraping system (legal content only)
- **Analytics Dashboard**: KPIs and content statistics
- **Role-based Access**: Admin/user authentication system

### Technical Features
- **HLS Video Streaming**: Industry-standard adaptive bitrate streaming
- **TypeScript**: Full type safety across the entire application
- **API Layer**: RESTful APIs with Zod validation
- **Repository Pattern**: Flexible data layer (JSON files or SQLite/Prisma)
- **State Management**: TanStack Query for server state, Zustand for UI state
- **Internationalization**: Arabic/English with RTL support
- **Authentication**: NextAuth with role-based access control

## 🛠️ Tech Stack

- **Framework**: Next.js 13 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui + Lucide React icons
- **State Management**: TanStack Query + Zustand
- **Forms**: React Hook Form + Zod validation
- **Video Playback**: HLS.js with external .m3u8 streams
- **Authentication**: NextAuth (Credentials provider)
- **Internationalization**: next-intl (Arabic/English, RTL)
- **Database**: JSON files (dev) or Prisma + SQLite (production ready)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd netflix-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Seed the database**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 👥 Demo Users

The application comes with pre-configured demo users:

- **Admin User**: `admin@example.com` / `admin123`
- **Regular User**: `user@example.com` / `user123`

## 📁 Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API route handlers
│   ├── admin/             # Admin dashboard pages
│   ├── watch/             # Video player pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── providers/        # React context providers
├── lib/                   # Core utilities and configuration
│   ├── auth/             # Authentication configuration
│   ├── repository/       # Data access layer
│   ├── stores/           # Zustand stores
│   ├── schemas.ts        # Zod validation schemas
│   └── types.ts          # TypeScript type definitions
├── data/                  # JSON data storage (created automatically)
└── scripts/              # Utility scripts (seeding, etc.)
```

## 🎬 Content Management

### Adding Content

1. **Movies**: Navigate to Admin Dashboard → Content → Movies
2. **Series**: Use the Series Builder for complex season/episode structures
3. **People**: Add cast and crew members with photos and bios
4. **Subtitles**: Upload WebVTT files for multiple languages

### Video Sources

The platform supports HLS streaming (.m3u8 files). For demo purposes, we include public domain content URLs. In production, ensure you have proper licensing for all content.

**Example HLS sources for testing**:
- `https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8`

### Web Scraping (Legal Content Only)

The platform includes a configurable web scraping system for content discovery:

1. **Only scrape sites that explicitly allow it**
2. **Respect robots.txt files**
3. **Use only for public domain or licensed content**
4. **Example configuration for legal sources like Archive.org**

## 🌍 Internationalization

The platform supports Arabic and English with RTL layout:

- **Language Switching**: Users can toggle between Arabic and English
- **RTL Support**: Full right-to-left layout for Arabic
- **Content Preservation**: All content remains in its original language

## 🔒 Security Features

- **Role-based Authentication**: Admin and user roles
- **Protected Routes**: Admin dashboard requires admin role
- **Form Validation**: Client and server-side validation with Zod
- **XSS Protection**: Sanitized content rendering
- **CSRF Protection**: Built-in Next.js security features

## 📊 Data Storage

The platform supports two storage options:

### 1. JSON Files (Default/Development)
- Simple file-based storage in `/data` directory
- Perfect for development and demos
- No database setup required

### 2. Prisma + SQLite (Production Ready)
- Robust relational database
- Better performance and scalability
- Database migrations and schema management

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

```env
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your-database-url (if using Prisma)
```

## 🧪 Testing

The project includes comprehensive testing setup:

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚖️ Legal Notice

This platform is designed for legal content distribution only. Users must:

- Only upload content they own or have proper licenses for
- Respect copyright laws and intellectual property rights
- Use web scraping features only on sites that explicitly allow it
- Comply with all applicable laws and regulations

## 🆘 Support

For support and questions:

1. Check the [documentation](./docs)
2. Search [existing issues](../../issues)
3. Create a [new issue](../../issues/new)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components  
- [HLS.js](https://github.com/video-dev/hls.js/) for video streaming
- [TanStack Query](https://tanstack.com/query) for server state management
- [Pexels](https://pexels.com) for demo images

---

**Note**: This is a demonstration project. Ensure you have proper licensing for any content you distribute through this platform.