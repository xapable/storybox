# StoryBox Import Format

Import apps (stories & quizzes) into StoryBox using a simple JSON file.

## Sample Files

See the `scripts/samples/` folder for ready-to-import examples:

| File | Content |
|------|---------|
| `sample1-human-body.json` | 人體大冒險（故事 + 測驗） |
| `sample2-dinosaur.json` | 恐龍時代（故事 + 測驗） |
| `sample3-money.json` | 小小理財家（故事 + 測驗） |

## Format

```json
[
  {
    "id": "my-story-1",
    "title": "我的故事",
    "description": "故事簡介",
    "category": "環保",
    "appType": "story",
    "storyContent": "大家好！\n這是一個故事。\n每一行都會逐句顯示。",
    "createdBy": "作者名稱",
    "creatorAvatar": "🦊"
  },
  {
    "id": "my-quiz-1",
    "title": "我的測驗",
    "description": "測驗簡介",
    "category": "科技",
    "appType": "t2q_quiz",
    "t2qContent": "> 老師: 同學們，今天學什麼？\n\n? 第一題的題目？\n1) 選項A\n2) 選項B\n3) 選項C\n= 3",
    "createdBy": "作者名稱",
    "creatorAvatar": "🦊"
  }
]
```

## Field Reference

| Field | Required | Type | Description |
|-------|----------|------|-------------|
| `id` | Yes | string | Unique ID (kebab-case). Leave empty `""` for auto-generate. |
| `title` | Yes | string | App title |
| `description` | Yes | string | Short description / subtitle |
| `appType` | Yes | `"story"` or `"t2q_quiz"` | Type of app |
| `storyContent` | For stories | string | Story text, one line = one screen (use `\n` for line breaks) |
| `t2qContent` | For quizzes | string | T2Q format (see below) |
| `category` | No | string | Category: `環保`, `自然`, `科技`, `生活`, `綜合` |
| `createdBy` | No | string | Creator name. Default: `"StoryBox 編輯室"` |
| `creatorAvatar` | No | string | Emoji or URL for avatar. Default: `"📦"` |
| `thumbnail` | No | string | Image URL for thumbnail |
| `version` | No | string | Default: `"1.0.0"` |
| `size` | No | string | Default: `"10 MB"` |
| `tags` | No | string[] | Array of tags |

## T2Q Format (for quizzes)

```
> Speaker: Dialogue text
> Speaker: More dialogue

? Question text
1) Option A
2) Option B
3) Option C
= 3

> Speaker: Feedback after question
```

- `> Speaker: Text` — Conversation line
- `? Question` — Quiz question
- `1)/2)/3)/4)/5)/6)` — Options (up to 6)
- `= N` — Correct answer (1-indexed)
- Blank lines separate scenes

## Usage

1. Create a `.json` file with your apps (see `scripts/import-sample.json`)
2. Run the import script:
   ```
   npx tsx scripts/importFirestore.ts your-file.json
   ```
