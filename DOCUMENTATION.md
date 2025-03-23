# Movelazy Documentation

## Overview
Movelazy is a Visual Studio Code extension designed to simplify the development of Move contracts on Movement. It provides a comprehensive development environment for both Aptos and Solidity developers, offering features for contract compilation, testing, and deployment.

## Version
Current Version: 0.0.2

## Features

### Core Features
- Account Creation and Management
- Balance Checking
- Contract Deployment
- Integrated Development Environment
- Web-based Interface

### Development Platforms Support
1. **Aptos Development**
   - Project initialization
   - Contract compilation
   - Unit testing
   - Contract deployment
   - Account management
   - Testnet support (Proto, Suzuka, Bardock)

2. **Solidity Development**
   - Project verification
   - Contract compilation
   - Deployment support
   - Network configuration
   - Local and custom network support

## Installation

1. Install the extension from VS Code marketplace
2. Run the following command to install all dependencies:
   ```bash
   npm run install:all
   ```

## Project Structure
```
movelazy-extension/
├── README.md              # Main entry point with links to all docs
├── DOCUMENTATION.md       # Main documentation
├── TECHNICAL_DETAILS.md   # Technical architecture and components
├── AI_FEATURES.md         # AI feature documentation
├── APTOS_DEVELOPMENT.md   # Aptos development guide
└── TROUBLESHOOTING.md     # Troubleshooting guide
├── src/                    # Source code
│   ├── ai/                # AI-related functionality
│   ├── contract/          # Contract-related code
│   ├── lib/               # Library code
│   ├── providers/         # VS Code providers
│   ├── services/          # Core services
│   ├── test/              # Test files
│   └── utils/             # Utility functions
├── webview/               # Web interface components
├── media/                 # Extension assets
└── out/                   # Compiled extension
```

## Usage Guide

### For Aptos Developers

1. **Project Setup**
   - Create a working folder
   - Open the folder in VS Code
   - Select "Aptos" as the development platform
   - Click "Initialize Aptos Project"

2. **Configuration**
   - Set package directory
   - Select testnet (Proto, Suzuka, or Bardock)
   - Configure module name
   - Select Move version
   - Configure compiler options

3. **Development Workflow**
   - Write smart contracts
   - Compile source code
   - Run unit tests
   - Deploy contracts

4. **Deployment Process**
   - System generates account automatically
   - Connect wallet if needed
   - Request testnet tokens via faucet
   - Deploy contract
   - Monitor transaction status

### For Solidity Developers

1. **Project Setup**
   - System verifies workspace
   - Initialize new workspace if needed
   - Access compiler page

2. **Development Workflow**
   - Write smart contracts in `contracts` folder
   - Configure compiler settings
   - Compile contracts
   - Deploy to selected network

3. **Deployment Options**
   - Local network (20 test accounts provided)
   - Custom network configuration
   - Contract deployment and verification

## Commands
- `movelazy.openSimulator`: Opens the simulator
- `movelazy.openWebview`: Opens the web interface
- `extension.runMoveLazy`: Executes command block
- `extension.removeOutput`: Removes markdown output

## Development

### Prerequisites
- Node.js
- VS Code
- npm or yarn

### Setup Development Environment
1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```
3. Build the extension:
   ```bash
   npm run compile
   ```
4. Build the webview:
   ```bash
   npm run webview:build
   ```

### Available Scripts
- `npm run compile`: Compiles TypeScript code
- `npm run watch`: Watches for changes and recompiles
- `npm run lint`: Runs ESLint
- `npm run test`: Runs tests
- `npm run webview:dev`: Runs webview in development mode

## Dependencies

### Core Dependencies
- @aptos-labs/ts-sdk: ^1.35.0
- @monaco-editor/react: ^4.7.0
- hardhat: ^2.22.15
- ethers: ^5.7.2
- express: ^4.21.2
- openai: ^4.85.4

### Development Dependencies
- TypeScript: ^5.5.4
- ESLint: ^9.22.0
- @typescript-eslint/eslint-plugin: ^8.3.0
- @typescript-eslint/parser: ^8.3.0

## License
MIT License

## Support
For issues and feature requests, please refer to the project's issue tracker. 