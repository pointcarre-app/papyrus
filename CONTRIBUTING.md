# Contributing to PCA Papyrus

Thank you for your interest in contributing to PCA Papyrus! This document provides guidelines for contributing to our advanced PDF generation and preview tool for mathematical content.

## 🚀 Quick Start for Contributors

### Prerequisites
- **Python 3.6+** for the development server
- **Modern web browser** (Chrome 80+, Firefox 78+, Safari 14+, Edge 80+)
- **Git** for version control
- **Basic knowledge** of JavaScript ES6+, HTML5, and CSS3

### Development Setup

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/your-username/pca-papyrus.git
   cd pca-papyrus
   ```

2. **Start the development server:**
   ```bash
   python3 serve.py
   ```

3. **Open the application:**
   ```bash
   open http://127.0.0.1:8004/scenery/
   ```

4. **Test your changes across all interfaces:**
   - Dual JSON mode: `http://127.0.0.1:8004/scenery/`
   - Multi-JSON mode: `http://127.0.0.1:8004/scenery/multi-index.html`
   - Programmatic mode: `http://127.0.0.1:8004/scenery/programmatic-4pdf.html`

## 🎯 Areas Where We Need Help

### High Priority Contributions

**🧪 Testing & Quality Assurance**
- Unit tests for dual JSON management system
- Integration tests for UI switching functionality
- Cross-browser compatibility testing
- Performance testing for large JSON datasets
- Mobile device compatibility testing

**📚 Documentation & Examples**
- Tutorial videos for complex workflows
- More mathematical content templates
- API documentation improvements
- Troubleshooting guides for common issues

**⚡ Performance Optimization**
- Rendering optimization for large documents
- Memory usage optimization for batch processing
- KaTeX rendering pipeline improvements
- Mobile performance enhancements

### Medium Priority Contributions

**🌍 Internationalization**
- UI translations for multiple languages
- Right-to-left language support
- Localized mathematical notation support

**📱 Mobile Experience**
- Touch-friendly interface improvements
- Mobile-optimized preview system
- Responsive design enhancements

**🔗 Educational Platform Integration**
- LMS platform connectors
- API endpoint development
- Webhook system implementation
- Authentication system development

## 📋 Contribution Guidelines

### Code Standards

**JavaScript**
- Use ES6+ modules and modern JavaScript features
- Follow consistent naming conventions (camelCase for functions, PascalCase for classes)
- Add comprehensive JSDoc comments for all functions
- Maintain compatibility with target browsers

**CSS**
- Use existing Tailwind CSS utility classes when possible
- Follow BEM methodology for custom CSS classes
- Ensure responsive design principles
- Test across different screen sizes

**HTML**
- Use semantic HTML5 elements
- Ensure accessibility with proper ARIA labels
- Maintain clean, readable markup structure

### Documentation Standards

**Code Documentation**
```javascript
/**
 * Generates PDF preview from JSON content with mathematical rendering
 * @param {Object[]} jsonData - Array of JSON content objects
 * @param {Object} config - Configuration object for margins, fonts, etc.
 * @returns {Promise<string>} Generated HTML content for PDF preview
 */
async function generatePreviewFromJSON(jsonData, config) {
    // Implementation...
}
```

**README and Guides**
- Use clear, step-by-step instructions
- Include code examples for all features
- Add screenshots or diagrams where helpful
- Test all examples before submitting

### Testing Guidelines

**Unit Tests**
- Test individual functions in isolation
- Mock external dependencies (DOM, fetch, etc.)
- Aim for high code coverage (80%+)
- Use descriptive test names

**Integration Tests**
- Test complete user workflows
- Verify UI interactions work correctly
- Test across different JSON content types
- Validate print output quality

**Performance Tests**
- Benchmark generation times for different content sizes
- Monitor memory usage during batch processing
- Test with realistic educational content loads

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Testing improvements

### Commit Message Format
```
type(scope): brief description

Detailed explanation of changes made.

Fixes #issue-number
```

**Types:** `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style`

### Pull Request Process

1. **Create a descriptive branch name:**
   ```bash
   git checkout -b feature/json-validation-system
   ```

2. **Make your changes with proper testing:**
   - Add unit tests for new functionality
   - Update documentation as needed
   - Test across different browsers

3. **Submit a detailed pull request:**
   - Clear description of changes made
   - Reference any related issues
   - Include screenshots for UI changes
   - List testing performed

4. **Respond to code review feedback:**
   - Address all reviewer comments
   - Update tests as requested
   - Rebase if needed for clean history

## 🧪 Testing Your Contributions

### Manual Testing Checklist

**Dual JSON System:**
- [ ] Switch between PDF #1 and PDF #2 tabs
- [ ] Generate previews for both JSONs independently
- [ ] Print combined PDFs with proper page breaks
- [ ] Verify pagination works correctly

**Programmatic 4-PDF System:**
- [ ] Single-button generation works
- [ ] Progress tracking updates correctly
- [ ] All 4 mathematical topics generate properly
- [ ] Combined printing maintains formatting

**General Functionality:**
- [ ] Mathematical formulas render correctly (KaTeX)
- [ ] Margin adjustments work in real-time
- [ ] Font size changes apply properly
- [ ] Debug mode shows element borders
- [ ] Page numbering works when enabled

### Browser Testing
Test your changes in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Reporting Issues

### Bug Reports
When reporting bugs, please include:
- **Browser and version**
- **Operating system**
- **Steps to reproduce the issue**
- **Expected vs. actual behavior**
- **Screenshots or console errors**
- **JSON content that causes the issue** (if applicable)

### Feature Requests
For new features, please provide:
- **Clear description of the feature**
- **Use case and benefits**
- **Proposed implementation approach**
- **Any relevant examples or mockups**

## 📄 License

By contributing to PCA Papyrus, you agree that your contributions will be licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).

## 🤝 Community Guidelines

- **Be respectful** and inclusive in all interactions
- **Provide constructive feedback** during code reviews
- **Help newcomers** get started with the project
- **Share knowledge** and best practices
- **Focus on educational impact** - remember this tool helps teachers and students

## 📞 Getting Help

- **Documentation:** Check our comprehensive docs in `/docs/`
- **Issues:** Search existing issues before creating new ones
- **Discussions:** Use GitHub Discussions for questions and ideas
- **Code Review:** Tag maintainers for review assistance

---

**Thank you for contributing to PCA Papyrus! Together, we're building better tools for mathematical education.** 🎓📐✨ 