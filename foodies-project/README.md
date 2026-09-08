# 🍽️ Foodies - Share Your Favorite Recipes

A modern full-stack Next.js application where food enthusiasts can discover, share, and explore delicious recipes from a community of creators.

## ✨ Features

- **🔐 Email OTP Verification** — Secure meal sharing with 6-digit email verification codes
- **🍴 Meal Management** — Browse, search, and filter meals by title
- **📸 Image Storage** — Upload meal photos to AWS S3 with dynamic slideshow
- **🌐 Global Toast Notifications** — Real-time user feedback for all actions
- **🎨 Dark Theme UI** — Modern dark mode with orange accent colors
- **⚡ Server-Side Rendering** — Optimized performance with Next.js App Router
- **🗄️ MongoDB Database** — Cloud-hosted meal data with Mongoose ODM
- **🔍 Search Functionality** — Find meals by title using MongoDB regex filtering
- **📧 Email Delivery** — Send OTP codes via Resend API

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Next.js 16.3 |
| **Styling** | CSS Modules, Dark Theme Design |
| **Backend** | Next.js Server Actions, Server Components |
| **Database** | MongoDB with Mongoose |
| **Storage** | AWS S3 |
| **Email** | Resend API |
| **Authentication** | OTP (One-Time Password) via Email |

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB Atlas account (free tier available)
- AWS S3 bucket for image storage
- Resend API key for email delivery

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/foodies-project.git
cd foodies-project
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/foodies?appName=Cluster0

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your-bucket-name
NEXT_PUBLIC_S3_BASE_URL=https://your-bucket.s3.us-east-1.amazonaws.com

# Resend (Email Service)
RESEND_API_KEY=re_your_resend_api_key
EMAIL_FROM=onboarding@resend.dev

# Optional
PORT=3000
```

### 3. Seed Database (Optional)

Populate the database with sample meals:

```bash
npm run seed
```

This will create sample meals in your MongoDB database.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
foodies-project/
├── app/                          # Next.js App Router pages
│   ├── page.js                  # Homepage with slideshow
│   ├── layout.js                # Root layout (ToastProvider)
│   ├── error.js                 # Error boundary
│   ├── meals/
│   │   ├── page.js              # Browse meals
│   │   ├── [mealSlug]/          # Meal details
│   │   └── share/               # Share new meal form
│   └── community/               # Community page
│
├── components/                   # React components
│   ├── meal-verification/       # OTP modal (native <dialog>)
│   ├── meals/                   # Meal components
│   │   ├── share-meal-form.js  # Form for sharing meals
│   │   ├── search.js           # Search input with URL state
│   │   └── meals-grid.js       # Meal grid display
│   ├── images/                  # Image slideshow
│   ├── toast-bar/               # Global toast notifications
│   └── main-header/             # Navigation header
│
├── lib/                          # Utilities & server logic
│   ├── action.js                # Server Actions (OTP, save meal)
│   ├── meals.js                 # Database queries
│   ├── mongodb.js               # MongoDB connection
│   ├── email-verification.js    # Resend API integration
│   ├── otp-store.js             # In-memory OTP storage
│   └── models/
│       └── Meal.js              # Mongoose meal schema
│
├── knowledge-base/               # Documentation
│   ├── EMAIL_OTP_VERIFICATION.md
│   ├── SEARCH_FUNCTIONALITY.md
│   ├── GLOBAL_TOAST_NOTIFICATIONS.md
│   ├── S3_IMAGE_SLIDESHOW.md
│   ├── NATIVE_DIALOG_MODALS.md
│   └── THEME_COLOR_PALETTE.md
│
├── public/                       # Static assets
├── assets/                       # Icons & images
├── next.config.js               # Next.js configuration
├── jsconfig.json                # Path aliases
├── package.json                 # Dependencies
└── initdb.mjs                   # Database seeding script
```

## 🔑 Key Features Explained

### Email OTP Verification
Users must verify their email with a 6-digit code before sharing meals. The code is:
- Generated and stored in-memory (5-minute expiry)
- Sent via Resend API
- Verified on the server before meal save
- Cleared after successful submission

### Search & Filtering
- Search meals by title using URL query parameters
- Server-side MongoDB regex filtering (case-insensitive)
- Real-time results without page reload

### Image Storage
- Meals uploaded to AWS S3
- Homepage slideshow fetches images from S3
- Supports any image format (auto-detected)

### Global Toast Notifications
- React Context-based provider
- Single instance at root layout
- `useToast()` hook for easy access from any component
- Auto-dismisses after 3 seconds

## 🚢 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Connect to Vercel

- Go to [vercel.com](https://vercel.com)
- Click "New Project" and select your GitHub repo
- Vercel auto-detects Next.js and builds it

### 3. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```
MONGO_URI=mongodb+srv://...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET_NAME=...
NEXT_PUBLIC_S3_BASE_URL=https://...
RESEND_API_KEY=...
EMAIL_FROM=onboarding@resend.dev
```

### 4. Deploy

Push any commit to `main` branch — Vercel auto-deploys! 🚀

## 🔐 Security Notes

- `.env.local` is in `.gitignore` and never committed
- All credentials use `process.env` variables
- OTP codes are in-memory (for production, use Redis or MongoDB TTL)
- XSS protection via `xss` package on instructions
- Email validation on both client and server
- No hardcoded credentials in source code

## 📦 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run seed     # Populate database with sample meals
```

## 🎨 Styling & Theme

The app uses a consistent **dark theme**:
- Background: `#1c2027`
- Text: `#ddd6cb`
- Accents: `#f9572a` → `#ff9b05` (orange gradient)
- Focus: `#f99f2a`

All components use CSS Modules with the color palette defined in `knowledge-base/THEME_COLOR_PALETTE.md`.

## 📚 Documentation

Comprehensive guides available in the `knowledge-base/` folder:
- Architecture & data flow
- Component patterns
- Database schemas
- Deployment checklist
- Styling conventions

## 🐛 Troubleshooting

### MongoDB Connection Fails
- Verify `MONGO_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist includes your Vercel IP
- Ensure database user has correct permissions

### S3 Upload Errors
- Verify AWS credentials in `.env.local`
- Check S3 bucket name and region
- Ensure bucket CORS allows uploads from your domain

### OTP Not Received
- Verify `RESEND_API_KEY` is valid
- Check spam/junk folder
- Ensure `EMAIL_FROM` matches Resend domain

### Images Not Loading
- Verify `NEXT_PUBLIC_S3_BASE_URL` is correct
- Check S3 bucket is public or has proper permissions
- Ensure image files exist in S3

## 🤝 Contributing

Feel free to fork, create a branch, and submit pull requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for food lovers everywhere.

---

**Made with Next.js 16 • MongoDB • AWS S3 • Resend**
