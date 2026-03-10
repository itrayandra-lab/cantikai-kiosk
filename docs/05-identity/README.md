# 🎨 Cantik AI - Brand & Visual Identity System

**Complete Design System Documentation**

---

## 📚 Quick Navigation

- [00-INDEX.md](./00-INDEX.md) - Complete documentation index
- [01-BRAND-COLORS.md](./01-BRAND-COLORS.md) - Color palette & usage
- [02-TYPOGRAPHY.md](./02-TYPOGRAPHY.md) - Fonts & typography scale
- [03-GLASSMORPHISM.md](./03-GLASSMORPHISM.md) - Glass effects & blur
- [04-GRADIENTS.md](./04-GRADIENTS.md) - Background & overlay gradients
- [09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md) - Complete CSS variables
- [10-DESIGN-TOKENS.json](./10-DESIGN-TOKENS.json) - JSON design tokens

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Copy CSS Variables
Open [09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md) and copy the complete `:root` block into your CSS file.

### Step 2: Import Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Step 3: Add Base Styles
```css
body {
  font-family: var(--font-sans);
  background: var(--bg-color);
  background-image:
    radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 60%),
    radial-gradient(circle at 100% 80%, rgba(157, 90, 118, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(220, 200, 210, 0.5) 0%, transparent 60%);
  background-attachment: fixed;
  color: var(--text-headline);
}
```

### Step 4: Create Your First Component
```css
.card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur-medium));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

**Done!** You now have the complete Cantik AI design system.

---

## 🎨 Core Design Principles

### 1. Elegance First
- Soft rose tones (#9d5a76, #f1d3e2)
- Serif headlines (Playfair Display)
- Glassmorphism effects
- Smooth animations

### 2. Professional Trust
- Medical-grade appearance
- Clear information hierarchy
- Consistent spacing (8px base)
- High contrast ratios (WCAG AA+)

### 3. Modern Innovation
- Backdrop filters
- Radial gradients
- Smooth transitions
- Premium feel

---

## 🎨 Color Palette

### Primary Colors
```css
--primary-color: #9d5a76;      /* Main brand color */
--primary-light: #f1d3e2;      /* Soft pink */
--text-headline: #593645;      /* Deep maroon */
--text-body: #8a6f7b;          /* Muted rose-grey */
--bg-color: #faf6f8;           /* Pale rose-white */
```

### Usage
- **Primary (#9d5a76):** Buttons, links, active states
- **Primary Light (#f1d3e2):** Backgrounds, hover states
- **Headline (#593645):** Titles, important text
- **Body (#8a6f7b):** Body text, descriptions
- **Background (#faf6f8):** Main app background

---

## ✍️ Typography

### Fonts
- **Headlines:** Playfair Display (Serif)
- **Body:** Outfit (Sans-serif)

### Scale
```css
Display:    3.4rem  (54.4px)  - Hero headlines
H1:         2.5rem  (40px)    - Page titles
H2:         1.75rem (28px)    - Section headers
H3:         1.25rem (20px)    - Component titles
Body:       0.95rem (15.2px)  - Standard text
Caption:    0.75rem (12px)    - Small labels
```

---

## 🔮 Glassmorphism

### Standard Glass Card
```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(25px);
border-radius: 28px;
box-shadow: 0 10px 40px rgba(89, 54, 69, 0.08);
border: 1px solid rgba(255, 255, 255, 0.85);
```

### Variations
- **Light:** 60% opacity, 15px blur
- **Heavy:** 85% opacity, 40px blur
- **Navigation:** 15% opacity, 60px blur

---

## 🌈 Gradients

### Background (Multi-layer Radial)
```css
background-image:
  radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.4) 0%, transparent 40%),
  radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 60%),
  radial-gradient(circle at 100% 80%, rgba(157, 90, 118, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 0% 100%, rgba(220, 200, 210, 0.5) 0%, transparent 60%);
```

---

## 📐 Spacing System

**Base Unit:** 8px

```css
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-6: 3rem;     /* 48px */
```

---

## 💻 Code Examples

### React Component
```jsx
import React from 'react';

const Card = ({ children }) => (
  <div style={{
    background: 'var(--card-bg)',
    backdropFilter: 'blur(var(--blur-medium))',
    borderRadius: 'var(--radius-xl)',
    boxShadow: 'var(--shadow-card)',
    padding: 'var(--space-3)',
    border: '1px solid rgba(255, 255, 255, 0.85)'
  }}>
    {children}
  </div>
);

const Button = ({ children, onClick }) => (
  <button style={{
    background: 'var(--primary-color)',
    color: 'var(--text-white)',
    fontFamily: 'var(--font-sans)',
    fontSize: 'var(--font-size-body)',
    fontWeight: 'var(--font-weight-semibold)',
    padding: 'var(--space-2) var(--space-4)',
    borderRadius: 'var(--radius-pill)',
    boxShadow: 'var(--shadow-button)',
    border: 'none',
    cursor: 'pointer',
    transition: 'var(--transition-normal)'
  }} onClick={onClick}>
    {children}
  </button>
);
```

### HTML + CSS
```html
<div class="card-glass">
  <h1 class="headline">Cantik AI</h1>
  <p class="body-text">Analisis kulit dengan AI</p>
  <button class="btn-primary">Mulai Scan</button>
</div>
```

```css
.card-glass {
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur-medium));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
}

.headline {
  font-family: var(--font-serif);
  font-size: var(--font-size-display);
  color: var(--text-headline);
}

.btn-primary {
  background: var(--primary-color);
  color: var(--text-white);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
--breakpoint-mobile: 480px;
--breakpoint-tablet: 768px;
--breakpoint-desktop: 1024px;
```

### Mobile Adjustments
```css
@media (max-width: 768px) {
  :root {
    --font-size-display: 2.5rem;
    --font-size-h1: 2rem;
    --container-padding: 16px;
  }
}
```

---

## 🎯 Usage Guidelines

### DO ✅
- Use exact color values from palette
- Maintain 8px spacing increments
- Apply glassmorphism to cards
- Use Playfair Display for headlines
- Use Outfit for body text
- Keep animations subtle (0.3s)

### DON'T ❌
- Don't modify primary colors
- Don't use different fonts
- Don't create new gradients
- Don't ignore spacing system
- Don't use harsh shadows
- Don't overuse animations

---

## 🔧 Platform Integration

### Web (CSS)
Copy variables from [09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md)

### React/Vue/Angular
Use CSS variables with `var(--variable-name)`

### React Native
Convert tokens from [10-DESIGN-TOKENS.json](./10-DESIGN-TOKENS.json)

### iOS/Swift
```swift
extension UIColor {
    static let primaryColor = UIColor(hex: "#9d5a76")
    static let primaryLight = UIColor(hex: "#f1d3e2")
}
```

### Android/Kotlin
```xml
<color name="primary_color">#9d5a76</color>
<color name="primary_light">#f1d3e2</color>
```

---

## 📦 Export Formats

### CSS Variables
See [09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md)

### JSON Tokens
See [10-DESIGN-TOKENS.json](./10-DESIGN-TOKENS.json)

### Figma
Import colors and typography from documentation

### Sketch
Use JSON tokens to generate Sketch library

---

## 🎨 Brand Assets

### Logo
- Primary logo: Cantik AI wordmark
- Icon: Rose/flower symbol
- Colors: Primary rose (#9d5a76)

### Typography
- Headlines: Playfair Display
- Body: Outfit
- Monospace: (if needed) Fira Code

---

## 📞 Support & Questions

### Documentation
- Read all files in this folder
- Check code examples
- Review usage guidelines

### Updates
- Version: 1.0.0
- Last Updated: March 3, 2026
- Maintained by: Cantik AI Design Team

---

## 📝 Changelog

### Version 1.0.0 (March 3, 2026)
- ✅ Initial release
- ✅ Complete color palette
- ✅ Typography system
- ✅ Glassmorphism effects
- ✅ Gradient system
- ✅ CSS variables
- ✅ Design tokens (JSON)
- ✅ Code examples
- ✅ Usage guidelines

---

## 🎯 Next Steps

1. **Read Documentation**
   - Start with [00-INDEX.md](./00-INDEX.md)
   - Review each section

2. **Copy CSS Variables**
   - Open [09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md)
   - Copy `:root` block to your project

3. **Import Fonts**
   - Add Google Fonts link
   - Playfair Display + Outfit

4. **Build Components**
   - Use code examples
   - Follow guidelines
   - Maintain consistency

5. **Test & Iterate**
   - Test on all devices
   - Check accessibility
   - Refine as needed

---

**Ready to build beautiful, consistent interfaces with Cantik AI design system!** 🚀

---

**License:** Proprietary - For Cantik AI projects only  
**Version:** 1.0.0  
**Last Updated:** March 3, 2026

