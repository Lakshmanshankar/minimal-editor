
## 📝 No BS Editor,

A minimalist, local-first, keyboard-friendly notes editor — built for devs who just want to write and move on.

- No Login,
- No Distractions
- Just type and go.
- Sync with indexdb.

## 🚀 Features

- ✨ **Rich text editor** using [Lexical](https://lexical.dev/)
- 💾 **Local file storage** via IndexedDB
- 🔁 **Auto-load from URL** (shareable `?file=id`)
- 🗂️ **Multiple files**, autosorted by save time
- 🧼 Clean UI, zero boilerplate, zero distractions
- Currently support basic markdown
- Link editor, images and tables comming soon.

---

### 📦 Tech Stack

- [React](https://reactjs.org)
- [Lexical](https://lexical.dev) – editor framework by Meta
- [Tailwind CSS](https://tailwindcss.com) – styling



## 🛠️ Usage

1. Open the app
2. Start typing
4. Editor auto-generates a file, stores it locally, and updates the URL
5. Visit `/editor?file=12345678` to reopen any file



## 🚧 Future Enhancements

- 📝 Rename files
- 🔥 Autosave with debounce
- 🗑️ Delete notes
- 🔐 Cloud sync (optional, opt-in)



## 🧪 Dev Setup

```bash
git clone https://github.com/lakshmanshankar/minimal-editor
cd minimal-editor
pnpm install
pnpm dev
```
