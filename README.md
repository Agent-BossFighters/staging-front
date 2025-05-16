# Agent - Player Map

## Introduction

Agent is an innovative platform that revolutionizes how game studios interact with their community. Our solution combines web2 and web3 tools to create a transparent and collaborative experience between developers and players.

## Prerequisites

- Node.js (version 18 or higher)
- pnpm (version 9.12.3 or higher)
- Modern browser with Web3 support (MetaMask, etc.)

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/agent.git
cd agent

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env
```

## Configuration

Create a `.env` file in the project root with the following variables:

```env
VITE_PRIVY_APP_ID=your_app_id
VITE_WALLET_CONNECT_PROJECT_ID=your_project_id
VITE_INTUITION_API_KEY=your_api_key
```

## Getting Started

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## The Problem

Modern game studios are looking to:

- Visualize their community's desires
- Improve player retention
- Create a transparent relationship with their audience
- Collect relevant feedback on game elements

However, there is currently no web3 solution that effectively and securely provides this transparency and data collection.

## Our Solution

Agent offers a complete suite of tools:

### Web2 Tools

- Community analysis and understanding
- Decision support
- Content creation
- Player acquisition strategy
- Freemium platform to maximize engagement

### Web3 Tools - Player Map

Our flagship tool, Player Map, uses Intuition technology to:

- Create and build the game community graph
- Visualize community data
- Provide complete transparency
- Collect feedback on game elements
- Deliver personalized recommendations via Intuition AI

## Technologies Used

- React 18
- Vite
- TailwindCSS
- Wagmi
- Privy
- Player Map
- Intuition Technology

## Project Structure

```
src/
├── assets/        # Images, fonts and other static resources
├── components/    # Reusable React components
├── context/       # React contexts for state management
├── features/      # Main application features
├── pages/         # Page components
├── shared/        # Shared utilities and constants
└── utils/         # Utility functions
```

## Available Scripts

- `pnpm dev` : Start development server
- `pnpm build` : Create production build
- `pnpm preview` : Preview production build
- `pnpm lint` : Check code with ESLint
- `pnpm format` : Format code with Prettier

## Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Support

For any questions or issues, please:
- Open an issue on GitHub
- Check our [documentation](https://docs.agent-bossfighters.com)
- Contact us at support@agent-bossfighters.com

## License

This project is licensed under the MIT License. See the LICENSE file for details.
