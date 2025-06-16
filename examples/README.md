# Bankless Academy SDK Examples

This directory contains example implementations of the Bankless Academy SDK components using Next.js.

## Examples

### Basic Usage

`app/components/BasicUsage.tsx` - Shows how to use the `Lessons` component to display a grid of lessons.

### Frame Usage

`app/components/FrameUsage.tsx` - Demonstrates how to use the `Frame` component to display a single lesson.

### Combined Usage

`app/components/CombinedUsage.tsx` - Shows how to combine both `Lessons` and `Frame` components for a complete learning experience.

## Running the Examples in a Web Browser

1. Install dependencies:

```bash
yarn install
```

2. Start the development server:

```bash
yarn dev
```

This will:

- Start a development server at <http://localhost:3000>
- Open your default browser automatically
- Show all examples in a single page
- Enable hot module replacement for instant updates

3. To build for production:

```bash
yarn build
```

4. To start the production server:

```bash
yarn start
```

## Testing

The examples include tests that verify:

- Basic rendering of components
- Interaction with the Frame component
- Integration between Lessons and Frame components

To run the tests:

```bash
yarn test
```

To run tests in watch mode:

```bash
yarn test:watch
```

## Development

The examples use:

- Next.js 14 for the framework
- React 18 for rendering
- TypeScript for type safety
- Tailwind CSS for styling
- Jest for testing

All examples are rendered in a single page for easy comparison and testing.
