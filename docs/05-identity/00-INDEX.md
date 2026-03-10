# 🎨 Cantik AI - Brand & Visual Identity System

**Version:** 1.0.0  
**Last Updated:** March 3, 2026  
**Status:** Production Ready

---

## 📚 Documentation Index

This folder contains the complete Brand & Visual Identity System for Cantik AI. Use these files as a reference to maintain consistent design across all projects.

### Core Files

1. **[01-BRAND-COLORS.md](./01-BRAND-COLORS.md)**
   - Complete color palette
   - Primary, secondary, and accent colors
   - Text colors and backgrounds
   - Color usage guidelines
   - Accessibility considerations

2. **[02-TYPOGRAPHY.md](./02-TYPOGRAPHY.md)**
   - Font families (Playfair Display & Outfit)
   - Font weights and sizes
   - Typography scale
   - Line heights and letter spacing
   - Usage examples

3. **[03-GLASSMORPHISM.md](./03-GLASSMORPHISM.md)**
   - Glass card styles
   - Backdrop filters
   - Blur effects
   - Shadow systems
   - Border treatments

4. **[04-GRADIENTS.md](./04-GRADIENTS.md)**
   - Background gradients
   - Radial gradients
   - Linear gradients
   - Overlay gradients
   - Usage patterns

5. **[05-COMPONENTS.md](./05-COMPONENTS.md)**
   - Button styles
   - Card components
   - Navigation elements
   - Form inputs
   - Modal designs

6. **[06-ANIMATIONS.md](./06-ANIMATIONS.md)**
   - Keyframe animations
   - Transitions
   - Hover effects
   - Loading states
   - Micro-interactions

7. **[07-SPACING-LAYOUT.md](./07-SPACING-LAYOUT.md)**
   - Spacing scale
   - Grid system
   - Container widths
   - Padding and margins
   - Responsive breakpoints

8. **[08-ICONS-IMAGERY.md](./08-ICONS-IMAGERY.md)**
   - Icon style guide
   - Image treatments
   - Illustration guidelines
   - Logo usage
   - Visual hierarchy

9. **[09-CSS-VARIABLES.md](./09-CSS-VARIABLES.md)**
   - Complete CSS custom properties
   - Variable naming conventions
   - Usage in code
   - Dark mode support (future)

10. **[10-DESIGN-TOKENS.md](./10-DESIGN-TOKENS.md)**
    - JSON design tokens
    - Token structure
    - Platform-agnostic values
    - Integration guide

---

## 🎯 Quick Start

### For Developers

```css
/* Import the design system */
@import url('./identity/cantik-ai-design-system.css');

/* Use CSS variables */
.my-component {
  background: var(--primary-color);
  font-family: var(--font-serif);
  border-radius: var(--radius-lg);
}
```

### For Designers

1. Open Figma/Sketch
2. Import color palette from `01-BRAND-COLORS.md`
3. Install fonts: Playfair Display & Outfit
4. Use glassmorphism styles from `03-GLASSMORPHISM.md`
5. Apply gradients from `04-GRADIENTS.md`

---

## 🎨 Brand Essence

**Cantik AI** is a premium, elegant, and trustworthy skin analysis platform. The visual identity reflects:

- **Elegance:** Soft rose tones, serif typography, glassmorphism
- **Trust:** Medical-grade professionalism, clear hierarchy
- **Warmth:** Friendly colors, approachable design
- **Innovation:** Modern effects, smooth animations

---

## 🌈 Color Philosophy

The color palette is inspired by natural skin tones and beauty aesthetics:

- **Primary Rose (#9d5a76):** Confidence, femininity, elegance
- **Soft Pink (#f1d3e2):** Gentleness, care, approachability
- **Deep Maroon (#593645):** Trust, professionalism, depth
- **Muted Grey-Rose (#8a6f7b):** Balance, sophistication, readability

---

## 📐 Design Principles

1. **Clarity First:** Information hierarchy is paramount
2. **Elegant Simplicity:** Beautiful but not overwhelming
3. **Consistent Spacing:** 8px base unit system
4. **Smooth Interactions:** 0.3s transitions, ease-in-out
5. **Accessible Always:** WCAG AA minimum contrast ratios

---

## 🔧 Technical Stack

- **CSS Framework:** Custom CSS with CSS Variables
- **Fonts:** Google Fonts (Playfair Display, Outfit)
- **Effects:** Backdrop-filter, box-shadow, gradients
- **Animations:** CSS keyframes, transitions
- **Responsive:** Mobile-first, max-width 600px

---

## 📱 Platform Support

- **Web:** Full support (Chrome, Safari, Firefox, Edge)
- **Mobile:** iOS Safari, Chrome Mobile
- **Tablet:** iPad, Android tablets
- **Desktop:** All modern browsers

---

## 🚀 Usage Guidelines

### DO ✅
- Use exact color values from the palette
- Maintain consistent spacing (8px increments)
- Apply glassmorphism to cards and overlays
- Use Playfair Display for headlines
- Use Outfit for body text
- Keep animations subtle (0.2-0.3s)

### DON'T ❌
- Don't modify primary colors
- Don't use different fonts
- Don't create new gradients without approval
- Don't ignore spacing system
- Don't use harsh shadows
- Don't overuse animations

---

## 📞 Support

For questions about the design system:
- Review documentation in this folder
- Check code examples in components
- Refer to Figma design files (if available)

---

## 📝 Changelog

### Version 1.0.0 (March 3, 2026)
- Initial release
- Complete design system documentation
- All components documented
- CSS variables defined
- Design tokens exported

---

**Maintained by:** Cantik AI Design Team  
**License:** Proprietary - For Cantik AI projects only

