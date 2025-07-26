# Third-Party Dependencies

## License Compatibility Matrix

| Dependency | License | Runtime Usage | Compatibility with AGPL v3.0 |
|------------|---------|---------------|-------------------------------|
| **KaTeX** | MIT License | Mathematical typesetting for web | ✅ Compatible |
| **Tailwind CSS** | MIT License | Utility-first CSS framework | ✅ Compatible |
| **DaisyUI** | MIT License | Component library for Tailwind CSS | ✅ Compatible |
| **Google Fonts** | SIL Open Font License (OFL) | Web fonts (Spectral, Inter, JetBrains Mono) | ✅ Compatible |

## Usage Model

**Important**: PCA Papyrus uses dependencies **at runtime only** - we do not modify, fork, or redistribute the source code of these projects. This significantly simplifies license compliance requirements.

### Runtime Usage Implications
- **No source code modification**: We use these tools as-is without changes
- **No redistribution**: Dependencies are loaded independently by end users via CDN
- **Minimal compliance burden**: Only basic attribution requirements apply

## License Requirements

### KaTeX (MIT License)
- **Project**: KaTeX/KaTeX
- **Usage**: Mathematical typesetting and LaTeX rendering in web browsers
- **Integration**: Loaded at runtime via CDN (https://cdn.jsdelivr.net/npm/katex@0.16.9/)
- **Compliance Requirements**:
  - ✅ Preserve copyright notices (already handled by CDN loading)
  - ✅ No source disclosure required (permissive license)
  - ✅ No copyleft obligations for our code

### Tailwind CSS (MIT License)
- **Project**: tailwindlabs/tailwindcss
- **Usage**: Utility-first CSS framework for styling
- **Integration**: Loaded at runtime via CDN (https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4)
- **Compliance Requirements**:
  - ✅ Preserve copyright notice (satisfied by CDN loading)
  - ✅ Include disclaimer (handled by original distribution)
  - ✅ No restrictions on our code licensing

### DaisyUI (MIT License)
- **Project**: saadeghi/daisyui
- **Usage**: Component library providing semantic CSS classes for Tailwind CSS
- **Integration**: Loaded at runtime via CDN (https://cdn.jsdelivr.net/npm/daisyui@5)
- **Compliance Requirements**:
  - ✅ Preserve copyright notice (satisfied by CDN loading)
  - ✅ No additional restrictions
  - ✅ Compatible with commercial and open source projects

### Google Fonts (SIL Open Font License)
- **Project**: Google Fonts
- **Usage**: Web fonts for typography
  - **Spectral**: Serif font for headings (SIL OFL 1.1)
  - **Inter**: Sans-serif font for body text (SIL OFL 1.1)
  - **JetBrains Mono**: Monospace font for code (SIL OFL 1.1)
  - **Lexend**: Sans-serif font for improved readability (SIL OFL 1.1)
  - **Playfair Display**: Serif display font (SIL OFL 1.1)
- **Integration**: Loaded at runtime via Google Fonts CDN
- **Compliance Requirements**:
  - ✅ Preserve copyright notices (handled by Google Fonts service)
  - ✅ Font files remain unmodified
  - ✅ SIL OFL allows commercial and open source use

## License Compatibility Analysis

### AGPL v3.0 Compatibility
All dependencies are fully compatible with AGPL v3.0 licensing:
- **MIT License**: Permissive license, no restrictions on derivative licensing
- **SIL Open Font License**: Compatible with all software licenses, designed for font distribution

## PCA Papyrus AGPL v3.0 Licensing

Our runtime-only usage model is fully compatible with AGPL v3.0:

### ✅ **AGPL v3.0 Distribution**
- No license conflicts with runtime dependencies
- All copyleft requirements satisfied
- Users receive full source code access
- Network use provisions apply

## Compliance Checklist

- [x] **Attribution**: Copyright notices preserved through CDN loading
- [x] **No Modification**: Using dependencies as-is without changes
- [x] **No Redistribution**: Dependencies loaded independently via CDN
- [x] **License Compatibility**: All licenses compatible with AGPL v3.0
- [x] **Documentation**: This file serves as license compliance documentation
- [x] **Source Availability**: Full source code available under AGPL v3.0
- [x] **Network Use**: AGPL network use provisions documented

## Full License References

For complete license texts:
- **MIT License**: https://opensource.org/licenses/MIT
- **SIL Open Font License**: https://scripts.sil.org/OFL
- **AGPL v3.0**: https://www.gnu.org/licenses/agpl-3.0.html

## Legal Disclaimer

This analysis is based on our understanding of the licenses and usage patterns. For critical applications, consult with qualified legal counsel to ensure compliance with all applicable licenses and regulations. 