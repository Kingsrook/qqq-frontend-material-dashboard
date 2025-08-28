# QQQ Frontend Material Dashboard

[![Version](https://img.shields.io/badge/version-0.26.0--SNAPSHOT-blue.svg)](https://github.com/Kingsrook/qqq-frontend-material-dashboard)
[![License](https://img.shields.io/badge/license-GNU%20Affero%20GPL%20v3-green.svg)](https://www.gnu.org/licenses/agpl-3.0.en.html)
[![React](https://img.shields.io/badge/React-18.0.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.4-blue.svg)](https://www.typescriptlang.org/)
[![MUI](https://img.shields.io/badge/MUI-5.11.1-blue.svg)](https://mui.com/)

> **Frontend Component for QQQ - Low-code Application Framework for Engineers**

This repository contains the **frontend dashboard application** that runs on top of the QQQ framework. This is **not** the main QQQ server - it's the React-based user interface that QQQ uses to provide its low-code development environment.

## 🚀 Overview

QQQ Frontend Material Dashboard is the **client-side application** that provides the visual interface for the QQQ low-code platform. It's built with React, TypeScript, and Material-UI to deliver a modern, responsive dashboard experience.

### What This Repository Contains

- **Frontend Dashboard**: React application with Material-UI components
- **User Interface**: Visual components for QQQ's low-code functionality
- **Client-Side Logic**: React components, hooks, and utilities
- **UI Framework**: Material Design implementation and theming

### What This Repository Does NOT Contain

- **QQQ Server**: The actual low-code engine and backend
- **Core Framework**: Business logic, process engine, or data management
- **Backend Services**: APIs, databases, or server-side functionality

## 🏗️ Architecture

### Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5 with custom theming
- **State Management**: React Context API with custom hooks
- **Routing**: React Router v6 with dynamic route generation
- **Authentication**: Auth0, OAuth2, and anonymous auth modules
- **Styling**: SASS with CSS-in-JS support via MUI styled components
- **Build Tool**: Create React App with TypeScript configuration

### Core Dependencies

- **@qrunio/qqq-frontend-core**: Core QQQ frontend framework functionality
- **@mui/material**: Material Design component library
- **@mui/x-data-grid**: Advanced data grid with sorting, filtering, and pagination
- **@mui/x-date-pickers**: Date and time selection components
- **react-router-dom**: Client-side routing
- **formik + yup**: Form handling and validation
- **chart.js**: Data visualization and analytics

## 📁 Project Structure

```
src/
├── qqq/                          # QQQ-specific frontend code
│   ├── authorization/            # Authentication modules (Auth0, OAuth2, Anonymous)
│   ├── components/               # Reusable UI components
│   │   ├── buttons/             # Button components and variants
│   │   ├── forms/               # Form components and layouts
│   │   ├── horseshoe/           # Navigation and layout components
│   │   ├── legacy/              # Legacy Material Dashboard components
│   │   ├── misc/                # Utility components (banners, tooltips)
│   │   ├── processes/           # Process-related components
│   │   ├── query/               # Query builder and data filtering
│   │   ├── sharing/             # Data sharing and collaboration
│   │   ├── widgets/             # Dashboard widgets and charts
│   │   └── scripts/             # Script execution components
│   ├── context/                 # React context providers
│   ├── layouts/                 # Page layout components
│   ├── models/                  # Frontend data models and interfaces
│   ├── pages/                   # Application pages and views
│   │   ├── apps/                # Application management pages
│   │   ├── processes/           # Process execution and management
│   │   └── records/             # CRUD operations and data views
│   ├── styles/                  # SASS styles and theme configuration
│   └── utils/                   # Frontend utility functions and helpers
├── main/                        # Java backend integration (if applicable)
├── types/                       # TypeScript type definitions
├── test/                        # Test files and mocks
├── App.tsx                      # Main application component
├── index.tsx                    # Application entry point
└── setupProxy.js                # Development proxy configuration
```

## 🎯 Frontend Functionality

### What This Frontend Provides

- **User Interface**: Beautiful, responsive Material Design interface
- **Component Library**: Reusable React components for QQQ applications
- **Theme System**: Customizable Material-UI theming and styling
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Authentication UI**: Login forms and user management interfaces
- **Data Visualization**: Charts, grids, and data display components

### What This Frontend Does NOT Do

- **Run Business Logic**: That's handled by the QQQ server
- **Store Data**: Data persistence is managed by QQQ backend
- **Execute Processes**: Process engine runs on QQQ server
- **Manage Applications**: Application logic is handled by QQQ core

## 🚀 Getting Started

### Prerequisites

- **Node.js**: LTS version (18.x or higher)
- **npm**: 8.x or higher
- **QQQ Server**: Running instance of the QQQ framework

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kingsrook/qqq-frontend-material-dashboard.git
   cd qqq-frontend-material-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Configure QQQ server connection**
   ```bash
   # Set environment variables to point to your QQQ server
   cp .env.example .env
   # Edit .env with your QQQ server details
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- **`npm start`**: Start development server
- **`npm run build`**: Build for production
- **`npm test`**: Run test suite
- **`npm run clean`**: Clean build artifacts
- **`npm run clean-and-install`**: Clean and reinstall dependencies

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# QQQ Server Configuration
REACT_APP_QQQ_API_BASE_URL=https://your-qqq-server.com/api
REACT_APP_QQQ_WS_BASE_URL=wss://your-qqq-server.com/ws

# Authentication (if using external providers)
REACT_APP_AUTH0_DOMAIN=your-domain.auth0.com
REACT_APP_AUTH0_CLIENT_ID=your-client-id
REACT_APP_OAUTH2_CLIENT_ID=your-oauth2-client-id

# Analytics
REACT_APP_GA_TRACKING_ID=your-ga-tracking-id
```

### QQQ Server Integration

This frontend connects to a QQQ server instance. Make sure your QQQ server is running and accessible before starting the frontend.

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### Test Structure

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: Component interaction testing
- **Mock Data**: Test data and fixtures

## 📦 Building for Production

### Production Build

```bash
npm run build
```

The build process:
- Compiles TypeScript to JavaScript
- Optimizes and bundles assets
- Generates production-ready files in `build/` directory
- Creates optimized CSS and JavaScript bundles

### Deployment

The frontend can be deployed to various platforms:

- **Static Hosting**: Netlify, Vercel, AWS S3
- **Container Platforms**: Docker, Kubernetes
- **Traditional Servers**: Apache, Nginx

**Important**: The frontend must be configured to connect to a running QQQ server instance.

## 🔐 Authentication

### Supported Authentication Methods

1. **Auth0**: Enterprise-grade authentication service
2. **OAuth2**: Standard OAuth2 provider integration
3. **Anonymous**: Guest access for public applications

### Authentication Flow

The frontend handles authentication UI and token management, but authentication logic is coordinated with the QQQ server.

## 📊 Data Management

### Frontend Role

The frontend provides:
- **Data Display**: Tables, forms, and visualization components
- **User Input**: Forms, queries, and data entry interfaces
- **UI State**: Component state and user interface management

### Backend Role (QQQ Server)

The QQQ server handles:
- **Data Storage**: Database operations and persistence
- **Business Logic**: Application rules and process execution
- **API Services**: Data retrieval and manipulation endpoints

## 🎨 Customization

### Component Customization

All components can be customized through:

- **Props**: Component-specific configuration
- **Theming**: Material-UI theme overrides
- **Styling**: SASS and CSS-in-JS customization

### Layout Customization

Flexible layout system:

- **Sidebar**: Configurable navigation structure
- **Header**: Customizable application header
- **Content**: Flexible content area layouts
- **Footer**: Optional footer components

## 🚀 Performance

### Frontend Optimization

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Component lazy loading for better performance
- **Memoization**: React.memo and useMemo for expensive operations
- **Bundle Optimization**: Tree shaking and dead code elimination

### Best Practices

- **Virtual Scrolling**: For large data sets
- **Debounced Search**: Optimized search input handling
- **Efficient Re-renders**: Minimized unnecessary component updates

## 🤝 Contributing

**Important**: This repository is a component of the QQQ framework. All contributions, issues, and discussions should go through the main QQQ repository.

### Development Workflow

1. **Fork the main QQQ repository**: https://github.com/Kingsrook/qqq
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** (including frontend changes if applicable)
4. **Run tests**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request** to the main QQQ repository

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and style enforcement
- **Prettier**: Consistent code formatting
- **Testing**: Comprehensive test coverage

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

```
QQQ Frontend Material Dashboard
Copyright (C) 2021-2022 Kingsrook, LLC
651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
contact@kingsrook.com | https://github.com/Kingsrook/
```

**Note**: This is a component of the QQQ framework. For the complete license and more information, see the main QQQ repository: https://github.com/Kingsrook/qqq

## 🆘 Support & Community

### ⚠️ Important: Use Main QQQ Repository

**All support, issues, discussions, and community interactions should go through the main QQQ repository:**

- **Main Repository**: https://github.com/Kingsrook/qqq
- **Issues**: https://github.com/Kingsrook/qqq/issues
- **Discussions**: https://github.com/Kingsrook/qqq/discussions
- **Wiki**: https://github.com/Kingsrook/qqq.wiki

### Why This Repository Exists

This repository is maintained separately from the main QQQ repository to:
- **Enable independent frontend development** and versioning
- **Allow frontend-specific CI/CD** and deployment pipelines
- **Provide clear separation** between frontend and backend concerns
- **Support different release cycles** for UI components vs. core framework

### Getting Help

- **Documentation**: Check the [QQQ Wiki](https://github.com/Kingsrook/qqq.wiki)
- **Issues**: Report bugs and feature requests on [Main QQQ Issues](https://github.com/Kingsrook/qqq/issues)
- **Discussions**: Join community discussions on [Main QQQ Discussions](https://github.com/Kingsrook/qqq/discussions)
- **Questions**: Ask questions in the main QQQ repository

### Contact Information

- **Company**: Kingsrook, LLC
- **Email**: contact@kingsrook.com
- **Website**: https://kingsrook.com
- **Main GitHub**: https://github.com/Kingsrook/qqq

## 🙏 Acknowledgments

- **Material-UI Team**: For the excellent React component library
- **React Team**: For the amazing frontend framework
- **TypeScript Team**: For the powerful type system
- **QQQ Framework Team**: For the underlying low-code platform
- **Open Source Community**: For the tools and libraries that make this possible

---

**Built with ❤️ by the Kingsrook Team**

**This is a frontend component of the QQQ framework. For complete information, support, and community, visit: https://github.com/Kingsrook/qqq**


