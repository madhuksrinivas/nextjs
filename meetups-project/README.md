# 🎤 Meetups - Community Event Platform

A modern Next.js application for discovering and sharing local meetups. Users can browse upcoming meetups and create new events in their community.

## ✨ Features

- **📍 Browse Meetups** — Discover local meetups on the homepage
- **➕ Create New Meetups** — Share your event with the community
- **📋 Meetup Details** — View full details for each meetup
- **💾 MongoDB Integration** — Cloud-hosted meetup data with Mongoose
- **⚡ Static Site Generation** — Fast loading with Next.js ISR (Incremental Static Regeneration)
- **📱 Responsive Design** — Works seamlessly on desktop and mobile
- **🎨 Clean UI** — Modular component architecture with CSS modules

## 🛠️ Tech Stack

| Layer         | Technology                            |
| ------------- | ------------------------------------- |
| **Frontend**  | React 18, Next.js 16.3                |
| **Styling**   | CSS Modules                           |
| **Backend**   | Next.js API Routes                    |
| **Database**  | MongoDB with Mongoose                 |
| **Rendering** | Static Site Generation (SSG) with ISR |

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (free tier available)

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/meetups-project.git
cd meetups-project
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/meetups?appName=Cluster0
PORT=3000
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
meetups-project/
├── pages/                       # Next.js pages (file-based routing)
│   ├── index.js                # Homepage - browse all meetups
│   ├── [meetupId]/
│   │   └── index.js            # Meetup details page
│   ├── new-meetup/
│   │   └── index.js            # Create new meetup page
│   ├── _app.js                 # App wrapper component
│   └── api/
│       └── new-meetup.js       # API route for creating meetups
│
├── components/                 # React components
│   ├── layout/
│   │   ├── Layout.js           # Main layout wrapper
│   │   └── MainNavigation.js   # Navigation header
│   ├── meetups/
│   │   ├── MeetupList.js       # Display list of meetups
│   │   ├── MeetupItem.js       # Individual meetup card
│   │   ├── MeetupDetail.js     # Detailed meetup view
│   │   └── NewMeetupForm.js    # Form to create new meetup
│   └── ui/
│       └── Card.js             # Reusable card component
│
├── modals/                     # Mongoose schemas
│   └── Meetup.js               # Meetup data model
│
├── lib/                        # Utilities
│   └── mongodb.js              # MongoDB connection logic
│
├── styles/                     # Global styles
│   └── globals.css
│
├── public/                     # Static assets
└── .env.local                  # Environment variables (not committed)
```

## 🔑 Key Features Explained

### Homepage with Static Generation

- Uses `getStaticProps()` to fetch all meetups at build time
- Implements ISR (Incremental Static Regeneration) for automatic updates
- Shows error message if database fetch fails

### Create New Meetup

- Form component for collecting meetup details
- API route `/api/new-meetup` handles data submission
- Saves meetup to MongoDB with validation
- Triggers automatic page regeneration

### Meetup Details Page

- Dynamic route `[meetupId]` for individual meetup pages
- Uses `getStaticPaths()` for pre-rendering popular meetups
- Shows full meetup information including title, image, address, description
- Fallback rendering for new meetups

### Responsive Design

- CSS Modules for scoped styling
- Card-based layout for visual organization
- Mobile-friendly navigation

## 📡 API Routes

### POST `/api/new-meetup`

Create a new meetup.

**Request body:**

```json
{
  "title": "React Meetup",
  "image": "https://example.com/image.jpg",
  "address": "123 Main St, San Francisco",
  "description": "Learn React best practices"
}
```

**Response:**

```json
{
  "message": "Meetup created!",
  "id": "507f1f77bcf86cd799439011"
}
```

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
- Vercel auto-detects Next.js

### 3. Add Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
MONGO_URI=mongodb+srv://...
```

### 4. Deploy

Push to `main` branch — Vercel auto-deploys! 🚀

## 🔐 Security Notes

- `.env.local` is in `.gitignore` and never committed
- All credentials use environment variables
- MongoDB connection string is kept secure
- No hardcoded credentials in source code

## 📦 Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
```

## 🔄 Data Flow

```
1. User visits homepage
   ↓
2. getStaticProps() fetches all meetups from MongoDB
   ↓
3. Page pre-renders as static HTML at build time
   ↓
4. ISR cache invalidates after 60 seconds
   ↓
5. Next request regenerates in background
   ↓
6. New meetups automatically appear on homepage
```

## 🐛 Troubleshooting

### MongoDB Connection Fails

- Verify `MONGO_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist
- Ensure database user has correct permissions

### Meetup Not Appearing

- Check MongoDB is running and accessible
- Verify database name in connection string
- Check Mongoose schema matches submitted data

### Build Fails on Vercel

- Ensure `MONGO_URI` is set in Vercel environment variables
- Check for syntax errors in modals or pages
- Review Vercel build logs for specific errors

## 📚 Documentation

Additional guides available in `knowledge-base/`:

- `STATIC_VS_SERVER_PROPS.md` — Explain getStaticProps vs getServerSideProps
- `PAGE_ROUTING.md` — Next.js file-based routing patterns

## 🤝 Contributing

Feel free to fork, create a branch, and submit pull requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created with ❤️ for community meetups.

---

**Made with Next.js 16 • React 18 • MongoDB**
