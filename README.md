# domaine_test_yaroslav

## Installation

```bash
npm install
```

## Development

> **First time running this project?**

Start with Option 2. The Shopify CLI will prompt you to authenticate with your Shopify store (browser login required). Once authenticated, you can use Option 1 for subsequent runs.

### Option 1 — Run everything together (recommended)

Starts both the Shopify theme dev server and the Tailwind CSS watcher concurrently:

```bash
npm run concurrently
```

### Option 2 — Run separately (use this on first run)

Open two terminal tabs and run each command in its own tab.

**Tab 1 — Shopify theme dev server:**

```bash
npm run dev
```

**Tab 2 — Tailwind CSS watcher:**

```bash
npm run tw:watch
```
