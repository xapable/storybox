# StoryBox 知識盒子

Interactive stories and quizzes for learning.

## Import Apps

Bulk-import stories and quizzes into Firestore using a JSON file.

### Format

See `scripts/import-format.md` for the full format specification.

Sample file: `scripts/import-sample.json`

### Usage

```bash
# Set your Google credentials (if not on Firebase environment)
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account.json"

# Import from a JSON file
npm run import scripts/import-sample.json

# Or directly with tsx
npx tsx scripts/importFirestore.ts path/to/your-apps.json
```

### JSON Format Example

```json
[
  {
    "id": "my-story",
    "title": "我的故事",
    "description": "故事簡介",
    "category": "環保",
    "appType": "story",
    "storyContent": "每一行\n都是一頁",
    "createdBy": "作者",
    "creatorAvatar": "🦊"
  },
  {
    "id": "my-quiz",
    "title": "我的測驗",
    "description": "測驗簡介",
    "appType": "t2q_quiz",
    "t2qContent": "> 老師: 對話\n\n? 題目\n1) A\n2) B\n= 2"
  }
]
```

## Dev

```bash
npm run dev     # Start dev server
npm run build   # Build for production
```
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
