# Bankless Academy SDK Examples

This directory contains example implementations of the Bankless Academy SDK components.

## Examples

### Basic Usage

`basic-usage.tsx` - Shows how to use the `Lessons` component to display a grid of lessons.

### Frame Usage

`frame-usage.tsx` - Demonstrates how to use the `Frame` component to display a single lesson.

### Combined Usage

`combined-usage.tsx` - Shows how to combine both `Lessons` and `Frame` components for a complete learning experience.

## Running the Examples in a Web Browser

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

This will:

- Start a development server at <http://localhost:3000>
- Open your default browser automatically
- Show all examples in a single page
- Enable hot module replacement for instant updates

3. To build for production:

```bash
npm run build
```

4. To preview the production build:

```bash
npm run preview
```

## Testing

The examples include tests that verify:

- Basic rendering of components
- Interaction with the Frame component
- Integration between Lessons and Frame components

To run the tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm run test:watch
```

## Development

The examples use:

- Vite for fast development and building
- React 18 for rendering
- TypeScript for type safety
- Jest for testing

All examples are rendered in a single page for easy comparison and testing.
