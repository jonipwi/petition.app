# Petition Frontend (Next.js)

A modern, responsive petition interface built with Next.js, React, and Tailwind CSS.

## Features

- ✅ Responsive design (mobile-first)
- ✅ Real-time signature counter
- ✅ Social media sharing (Twitter, Facebook, WhatsApp)
- ✅ Form validation and error handling
- ✅ Honeypot anti-bot protection
- ✅ Success animations and feedback
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

3. Edit `.env.local` and set your backend API URL:
```
NEXT_PUBLIC_API_BASE=http://localhost:8090
```

For production:
```
NEXT_PUBLIC_API_BASE=https://petition.jacobyellowbridge.com
```

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
| `NEXT_PUBLIC_API_BASE` | Yes | Backend API URL (e.g., `https://petition.jacobyellowbridge.com` or `http://localhost:8090`) |

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── PetitionForm.tsx      # Main petition form with validation
│   │   ├── SignatureCounter.tsx  # Real-time signature count display
│   │   └── ShareButtons.tsx      # Social sharing buttons
│   ├── pages/
│   │   ├── _app.tsx               # App wrapper
│   │   ├── _document.tsx          # HTML document structure
│   │   └── index.tsx              # Main petition page
│   └── styles/
│       └── globals.css            # Global styles with Tailwind
├── public/                        # Static assets
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind CSS configuration
└── package.json
```

## Features Detail

### Form Validation
- Required fields: Name
- Optional fields: Email, Country, Message
- Client-side validation with error messages
- Server-side validation via backend API

### Anti-Bot Protection
- Honeypot field (hidden from users)
- Rate limiting enforced by backend
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
For `petition.jacobyellowbridge.com`:
1. Add DNS A record pointing to your server
2. Configure SSL certificate (Let's Encrypt recommended)
3. Update `NEXT_PUBLIC_API_BASE` to match your backend URL

## API Integration

The frontend communicates with the Go backend via these endpoints:

- `GET /api/count` - Fetch signature count
- `POST /api/sign` - Submit a signature

See `src/components/PetitionForm.tsx` for implementation details.

## Troubleshooting

### CORS Errors
Ensure backend `PETITION_ALLOWED_ORIGIN` matches your frontend URL.

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Working
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Restart dev server after changing `.env.local`

## License

MIT License - see project root for details.
