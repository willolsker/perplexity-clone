# Perplexity Clone

A Perplexity-like application built with the T3 stack that provides AI-powered search responses with citations using Google's Gemini API.

## Features

- AI-powered search responses using Gemini API
- Built-in Google Search grounding for real-time information
- Citations from sources
- Modern, responsive UI with Tailwind CSS
- Type-safe API with tRPC

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **tRPC** - End-to-end typesafe APIs
- **Tailwind CSS** - Styling
- **Prisma** - Database ORM (configured but not used for persistence)
- **@google/genai** - Google Gemini API client

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd perplexity-clone
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Add your Gemini API key to `.env`:
```
GEMINI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
perplexity-clone/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/trpc/     # tRPC API route handler
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Main query page
│   │   └── providers.tsx # React Query provider
│   ├── components/       # React components
│   │   ├── Citation.tsx
│   │   ├── QueryForm.tsx
│   │   └── ResponseDisplay.tsx
│   ├── server/           # Server-side code
│   │   ├── api/
│   │   │   ├── routers/
│   │   │   │   └── search.ts  # Search router with Gemini integration
│   │   │   ├── root.ts
│   │   │   └── trpc.ts
│   │   └── db.ts
│   ├── styles/
│   │   └── globals.css
│   └── utils/
│       └── api.ts        # tRPC client setup
├── prisma/
│   └── schema.prisma
└── package.json
```

## Usage

1. Enter your query in the search box
2. Click "Search" or press Enter
3. View the AI-generated response with citations
4. Click on citation numbers to visit the source

## Environment Variables

- `GEMINI_API_KEY` - Your Google Gemini API key (required)

## Notes

- No authentication is required (dev mode)
- No database persistence (results are not stored)
- The app uses Gemini's `googleSearchRetrieval` tool for grounding responses in real-time web data

## License

MIT

