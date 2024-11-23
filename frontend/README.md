frontend/
├── app/
│ ├── (dashboard)/
│ │ └── page.tsx # Your main dashboard page with the search form
│ ├── api/
│ │ └── search-factors/
│ │ └── route.ts # API route handler
│ └── layout.tsx
├── components/
│ └── ui/
│ └── button.tsx # Your existing button component
├── types/
│ └── climatiq.ts # (New) Add this to store interfaces
└── .env.local # For your API key
