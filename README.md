# Bankless Academy SDK

A React component library for displaying lessons from the Bankless Academy, built with vanilla CSS and Farcaster Frame Host.

## Installation

```bash
npm install @bankless-academy/sdk
```

### Peer Dependencies

The SDK requires the following peer dependencies:

```bash
npm install @farcaster/frame-host
```

## Usage

### Lessons Component

The `Lessons` component displays a grid of lessons from the Bankless Academy API.

```tsx
import { Lessons } from '@bankless-academy/sdk';

function MyComponent() {
  return (
    <Lessons lessonSlugs={["what-is-bitcoin", "ethereum-basics"]} />
  );
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `lessonSlugs` | string[] | Yes | Array of lesson slugs to display |

### Frame Component

The `Frame` component displays a single lesson from the Bankless Academy API using Farcaster Frame Host.

```tsx
import { Frame } from '@bankless-academy/sdk';

function MyComponent() {
  return (
    <Frame url="https://app.banklessacademy.com/lessons/what-is-bitcoin" />
  );
}
```

#### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `url` | string | Yes | The URL of the lesson to display |
| `onClose` | () => void | No | Optional callback when the lesson is closed |

## Features

- Responsive grid layout for lesson cards
- Loading states and error handling
- Interactive lesson frames using Farcaster Frame Host
- TypeScript support

## Development

### Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

## License

MIT
