# Contributing to Fullstack Project

First off, thank you for considering contributing to this fullstack project! It's people like you that make this project such a great tool for developers.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Process](#development-process)
- [Style Guidelines](#style-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Basic understanding of TypeScript/JavaScript
- Familiarity with React and Node.js

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/fullstack.git
   cd fullstack
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a branch for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to see if the problem has already been reported. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what behavior you expected**
- **Include screenshots if applicable**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List some other projects where this enhancement exists, if applicable**

### Contributing Code

1. **Pick an issue** - Look for issues labeled `good first issue` or `help wanted`
2. **Discuss first** - For large changes, create an issue first to discuss the approach
3. **Follow the development process** - See below for details

## 🔧 Development Process

### Setting Up Your Development Environment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Start development servers**:
   ```bash
   # Start backend
   npm run dev:backend
   
   # Start frontend (in another terminal)
   npm run dev:frontend
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- --testPathPattern=your-test-file
```

### Code Quality Checks

Before submitting your changes, ensure they pass all quality checks:

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all checks
npm run check-all
```

## 🎨 Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style (enforced by ESLint and Prettier)
- Write meaningful variable and function names
- Add JSDoc comments for complex functions
- Prefer functional programming patterns where appropriate

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and prop names
- Add PropTypes or TypeScript interfaces for props
- Follow the single responsibility principle

### CSS/Styling

- Use Tailwind CSS classes for styling
- Keep custom CSS to a minimum
- Follow mobile-first responsive design
- Use semantic class names when custom CSS is needed

## 💌 Commit Messages

Follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer(s)]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```
feat(auth): add OAuth 2.0 authentication
fix(api): resolve user data validation error
docs(readme): update installation instructions
```

## 🔄 Pull Request Process

1. **Update documentation** - Ensure README and other docs reflect your changes
2. **Add tests** - Include tests for new functionality
3. **Run quality checks** - Ensure all lints, tests, and type checks pass
4. **Create detailed PR description** - Explain what changes you made and why
5. **Link related issues** - Reference any issues your PR addresses
6. **Be responsive** - Address feedback promptly and professionally

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
```

## 🎯 Development Tips

- **Start small** - Make focused, atomic changes
- **Test thoroughly** - Write tests for your code and test edge cases
- **Document as you go** - Keep documentation up to date
- **Ask questions** - Don't hesitate to ask for help or clarification
- **Be patient** - Code review takes time, be respectful of reviewers

## 📞 Getting Help

If you need help or have questions:

1. Check the [documentation](./docs/)
2. Look through existing [issues](https://github.com/parsakhosravani/fullstack/issues)
3. Create a new issue with the `question` label
4. Join our community discussions

Thank you for contributing! 🎉