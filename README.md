# Stokx

Track real-time stock prices, set personalized alerts, and explore company insights — all in one fast Next.js app.  
Live: **stokx.vercel.app**

## ✨ Features

- **Realtime quotes & sparklines**
- **Watchlists** with quick add/remove
- **Price/percent change alerts**
- **Company overview** (profile, sector, description)
- **Fast UI** with server components and caching
- **Mobile-first** responsive layout

## 🏗 Tech Stack

- **Framework:** Next.js (App Router), TypeScript
- **Styling:** CSS/Tailwind
- **State/UX:** React server components + client hooks
- **Data:** Pluggable stock API layer
- **Deploy:** Vercel

## 🔧 Local Setup

```bash
# 1) Clone
git clone https://github.com/YashrajDahiya0036/Stokx
cd Stokx

# 2) Install
pnpm install   # or npm i / yarn

# 3) Env
cp .env.example .env.local
# Fill keys (see below)

# 4) Dev
pnpm dev
# open http://localhost:3000
```

### Environment Variables

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Choose one data provider
NEXT_PUBLIC_STOCK_API=finnhub
FINNHUB_API_KEY=your_key
```

## 📁 Project Structure

```
app/            # App Router pages
components/     # UI components
database/       # Models/schemas
hooks/          # Client hooks
lib/            # helpers: fetchers, caching
middleware/     # auth or rate-limit
public/assets/  # static assets
types/          # shared TypeScript types
```

## 🚦 Running in Production

- Set env vars on Vercel.
- Enable caching headers for APIs.
- For websockets/SSE, ensure runtime support.

## 🧠 Caching & Performance

- Use Next.js fetch cache + revalidation for quotes.
- Batch requests by symbol.
- Memoize company profiles.
- Use `cache: 'no-store'` for live ticker panels.

## 📜 License

MIT — feel free to fork and extend.

## 📎 Links

- Repo: https://github.com/YashrajDahiya0036/Stokx
- Live: https://stokx.vercel.app
