# Petition & Prayer Wall Frontend (Next.js)

A modern, responsive platform for community prayer and petition support, built with Next.js, React, and Tailwind CSS.

## Features

### Prayer Wall
- ✅ Interactive prayer wall with 4 prayer types (petition 🙏, thanksgiving ✨, lament 💧, intercession 🕊️)
- ✅ "Amen" support system (one amen per prayer per IP)
- ✅ Auto-generated petitions from prayers (one petition per prayer)
- ✅ Real-time prayer statistics
- ✅ Responsive grid layout with filtering

### Petition System
- ✅ Dynamic petition pages with shareable links
- ✅ Real-time signature counter
- ✅ Social media sharing (Twitter, Facebook, WhatsApp)
- ✅ Form validation and error handling
- ✅ Honeypot anti-bot protection
- ✅ Success animations and feedback

### Authentication
- ✅ GitHub OAuth via NextAuth
- ✅ Authenticated petition creation
- ✅ Session management

### General
- ✅ Responsive design (mobile-first)
- ✅ SEO-optimized with Open Graph tags
- ✅ TypeScript for type safety

## Prerequisites

- Node.js 18+ or higher
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment:
```bash
cp .env.example .env.local
```

3. Edit `.env.local` and set the required environment variables:
```env
NEXT_PUBLIC_API_BASE=http://localhost:8091
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

For production:
```env
NEXT_PUBLIC_API_BASE=https://bixio.xyz/petition
NEXTAUTH_URL=https://petition.bixio.xyz
NEXTAUTH_SECRET=your-production-secret
GITHUB_ID=your-github-oauth-app-id
GITHUB_SECRET=your-github-oauth-app-secret
```

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer Settings → OAuth Apps
2. Create a new OAuth App with:
   - Homepage URL: `http://localhost:3000` (dev) or `https://petition.bixio.xyz` (prod)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github` (dev) or `https://petition.bixio.xyz/api/auth/callback/github` (prod)
3. Copy the Client ID and generate a Client Secret
4. Add them to your `.env.local` file

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm run start
```

Or export as static site:

```bash
npm run build
# The static files will be in the .next folder
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE` | Yes | Backend API URL (e.g., `https://bixio.xyz/petition` or `http://localhost:8091`) |
| `NEXTAUTH_URL` | Yes | Frontend URL (e.g., `https://petition.bixio.xyz` or `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Yes | Secret key for NextAuth session encryption (generate with `openssl rand -base64 32`) |
| `GITHUB_ID` | Yes | GitHub OAuth App Client ID |
| `GITHUB_SECRET` | Yes | GitHub OAuth App Client Secret |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── LamentationWall.tsx    # Main prayer wall (homepage)
│   │   ├── PetitionForm.tsx       # Petition signing form
│   │   ├── SignatureCounter.tsx   # Real-time signature count
│   │   └── ShareButtons.tsx       # Social sharing buttons
│   ├── pages/
│   │   ├── _app.tsx               # App wrapper with SessionProvider
│   │   ├── _document.tsx          # HTML document structure
│   │   ├── index.tsx              # Homepage (displays LamentationWall)
│   │   ├── petition.tsx           # Petition signing page (?id=petition-id)
│   │   ├── dashboard.tsx          # Admin dashboard (unused)
│   │   ├── wall.tsx               # Redirects to home
│   │   └── api/
│   │       └── auth/
│   │           └── [...nextauth].ts  # NextAuth configuration
│   └── styles/
│       └── globals.css            # Global styles with Tailwind
├── public/                        # Static assets
├── next.config.js                 # Next.js configuration (GitHub avatar domain)
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json
```

## Application Flow

1. **Homepage (`/`)**: Displays the Lamentation Wall (LamentationWall.tsx)
   - Users can submit prayers (4 types: petition, thanksgiving, lament, intercession)
   - Each prayer card shows author, country, text, and amen count
   - Users can say "Amen" to prayers (once per IP)
   - "Sign Petition" button on petition-type prayers (requires authentication)

2. **Petition Creation Flow**:
   - User clicks "Sign Petition" on a prayer card
   - If not authenticated, redirected to GitHub OAuth login
   - After login, system creates or retrieves existing petition for that prayer
   - Petition ID format: `prayer-{prayer_id}` (one petition per prayer, reusable)
   - User redirected to `/petition?id=prayer-{id}`

3. **Petition Signing Page (`/petition`)**: 
   - Displays petition title (from prayer text)
   - Shows real-time signature count
   - Form to sign petition (name required, email/country/message optional)
   - Social sharing buttons (Twitter, Facebook, WhatsApp)
   - Each petition has unique shareable URL

## Features Detail

### Prayer Wall Features

- **4 Prayer Types**: Petition 🙏, Thanksgiving ✨, Lament 💧, Intercession 🕊️
- **Filtering**: Filter prayers by type or view all
- **Amen System**: Users can say "Amen" to prayers (once per IP address)
- **Real-time Stats**: Total prayers and amens displayed
- **Author Display**: Shows author name, country, and timestamp
- **Responsive Grid**: Adapts to mobile, tablet, and desktop screens

### Petition Features

- **Auto-Generated IDs**: Each prayer petition gets unique `prayer-{id}` format
- **Petition Reuse**: Same prayer always links to same petition
- **Shareable Links**: Unique URL for each petition
- **Signature Tracking**: Real-time signature count updates
- **Social Sharing**: Twitter, Facebook, WhatsApp integration

### Form Validation

- Required fields: Name
- Optional fields: Email, Country, Message
- Client-side validation with error messages
- Server-side validation via backend API

### Anti-Bot Protection

- Honeypot field (hidden from users)
- Rate limiting enforced by backend (10 requests/min per IP)
- Form submission disabled after successful sign

### Social Sharing

- Native Web Share API (mobile)
- Twitter, Facebook, WhatsApp direct links
- Copy link to clipboard functionality

### Accessibility

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly

## Customization

### Styling
Edit `tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#0ea5a4',
        dark: '#0d8f8e',
      },
    },
  },
}
```

### Content
Edit `src/pages/index.tsx` to update:
- Page title and description
- Petition text and messaging
- Meta tags for SEO

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Set `NEXT_PUBLIC_API_BASE` environment variable
4. Deploy

### Netlify
1. Build command: `npm run build`
2. Publish directory: `.next`
3. Set environment variables

### Static Export
```bash
npm run build
# Deploy the .next/out folder to any static host
```

### Custom Domain Setup

For `petition.bixio.xyz`:

1. Add DNS A record pointing to your server
2. Configure SSL certificate (Let's Encrypt recommended)
3. Update environment variables to match your domain
4. Ensure backend CORS allows your frontend origin

## API Integration

The frontend communicates with the Go backend via these endpoints:

**Petition Endpoints:**
- `GET /api/{petition_id}/info` - Fetch petition title and description
- `GET /api/{petition_id}/count` - Fetch signature count
- `POST /api/{petition_id}/sign` - Submit a signature

**Prayer Wall Endpoints:**
- `POST /api/pray` - Submit a new prayer
- `GET /api/prayers` - Fetch prayers with filtering and pagination
- `POST /api/amen/{prayer_id}` - Say amen to a prayer
- `GET /api/prayer-stats` - Get prayer statistics
- `POST /api/create-petition-from-prayer` - Create/retrieve petition for a prayer

See `backend/API.md` for complete API documentation with request/response examples.

## Troubleshooting

### CORS Errors

Ensure backend `PETITION_ALLOWED_ORIGIN` matches your frontend URL exactly.

### Build Errors

```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working

- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart dev server after changing `.env.local`
- Ensure all required variables are set (see Environment Variables section)

### Authentication Issues

- Verify GitHub OAuth app callback URL matches your domain
- Check `NEXTAUTH_URL` matches your frontend URL
- Ensure `NEXTAUTH_SECRET` is set and kept secret
- Clear browser cookies and try logging in again

## License

MIT License - see project root for details.
