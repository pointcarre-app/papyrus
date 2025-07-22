# Git Hooks

This directory contains Git hooks for the PCA Papyrus project.

## Purpose

Git hooks are scripts that run automatically at certain points in the Git workflow, helping maintain code quality and consistency.

## Available Hooks

Currently, this directory is prepared for future Git hooks that may include:

- **Pre-commit hooks** - Code formatting, linting, and basic tests
- **Pre-push hooks** - Full test suite execution before pushing
- **Commit message hooks** - Ensure commit messages follow project conventions

## Setup

Git hooks are not automatically activated when cloning a repository. To set up hooks:

```bash
# Copy hooks to .git/hooks/ directory
cp hooks/* .git/hooks/

# Make hooks executable
chmod +x .git/hooks/*
```

## Future Enhancements

Planned Git hooks for this project:

- **Code Quality**: ESLint and Prettier formatting checks
- **Testing**: Automated test execution for changed files
- **Documentation**: Ensure documentation updates for API changes
- **Performance**: Check for performance regressions

## Contributing

When adding new hooks:

1. Create executable scripts in this directory
2. Document their purpose and usage
3. Test thoroughly before submitting
4. Consider cross-platform compatibility

---

**Note**: Git hooks are not tracked by Git by default for security reasons. They must be manually installed by each developer. 