# Contributing to ColorSrc

Thank you for considering contributing to ColorSrc! This document outlines the process for contributing to the project and provides guidelines to help make the contribution process smooth and effective.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand our community standards.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for ColorSrc.

Before creating bug reports, please check the issue tracker as you might find that your issue has already been reported. When you create a new issue, please provide the following information:

- **Use a clear and descriptive title** for the issue
- **Describe the exact steps to reproduce the problem** with as much detail as possible
- **Provide specific examples** such as screenshots or videos, if possible
- **Describe the behavior you observed** and what you expected to see
- **Include browser information** including name and version
- **Include any additional context** that might be relevant

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for ColorSrc, including completely new features and minor improvements to existing functionality.

Before creating enhancement suggestions, please check the issue tracker as you might find that your suggestion has already been proposed. When you create a new suggestion, please include:

- **Use a clear and descriptive title** for the issue
- **Provide a step-by-step description of the suggested enhancement** with as much detail as possible
- **Provide specific examples** including mock-ups or wireframes if relevant
- **Explain why this enhancement would be useful** to most ColorSrc users
- **List similar implementations** in other projects, if applicable

### Pull Requests

The process described here aims to:

- Maintain ColorSrc's quality
- Fix problems that are important to users
- Enable a sustainable system for maintainers to review contributions

Please follow these steps to make the process as smooth as possible:

1. **Fork the repository** and create your branch from `main`
2. **Install the dependencies** using pnpm (`pnpm install`)
3. **Make your changes** following the code style of the project
4. **Test your changes** to ensure they work as expected
5. **Commit your changes** using a descriptive commit message that follows our [commit message conventions](#commit-message-guidelines)
6. **Push your branch** to your fork
7. **Submit a pull request** to the `main` branch of the ColorSrc repository

## Development Setup

To set up the project for development:

1. Clone the repository
   ```bash
   git clone https://github.com/yorukot/colorsrc.git
   cd colorsrc
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Start the development server
   ```bash
   pnpm dev
   ```

4. Visit http://localhost:3000 to see the application

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* When only changing documentation, include `[docs]` in the commit title
* Consider starting the commit message with an applicable emoji:
    * 🎨 `:art:` when improving the format/structure of the code
    * ⚡️ `:zap:` when improving performance
    * 🔥 `:fire:` when removing code or files
    * 🐛 `:bug:` when fixing a bug
    * ✨ `:sparkles:` when adding a new feature
    * 📝 `:memo:` when adding or updating documentation
    * 🚀 `:rocket:` when deploying stuff

### JavaScript Styleguide

* Use TypeScript for all code
* Use 2 spaces for indentation
* Use camelCase for variables and functions
* Use PascalCase for classes and React components
* Prefer const over let, and avoid var
* Place imports in the following order:
  * React and related packages
  * External packages
  * Internal modules
  * Style imports

### CSS Styleguide

* Use Tailwind CSS classes for styling
* Avoid custom CSS when possible, utilize the design system
* For custom CSS, use CSS modules or the @apply Tailwind directive

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute. 