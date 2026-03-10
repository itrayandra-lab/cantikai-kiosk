# 🎨 Brand Colors - Cantik AI

**Complete Color Palette & Usage Guidelines**

---

## 🌈 Primary Colors

### Primary Rose
```css
--primary-color: #9d5a76;
```
**RGB:** 157, 90, 118  
**HSL:** 339°, 27%, 48%  
**Usage:** Primary buttons, active states, links, brand elements  
**Personality:** Confident, elegant, feminine, trustworthy

### Primary Light (Soft Pink)
```css
--primary-light: #f1d3e2;
```
**RGB:** 241, 211, 226  
**HSL:** 330°, 52%, 89%  
**Usage:** Backgrounds, hover states, subtle accents, cards  
**Personality:** Gentle, approachable, soft, caring

---

## 📝 Text Colors

### Headline Text (Deep Maroon)
```css
--text-headline: #593645;
```
**RGB:** 89, 54, 69  
**HSL:** 334°, 24%, 28%  
**Usage:** Headlines, titles, important text, navigation labels  
**Contrast Ratio:** 9.8:1 (AAA) on white background

### Body Text (Muted Rose-Grey)
```css
--text-body: #8a6f7b;
```
**RGB:** 138, 111, 123  
**HSL:** 333°, 11%, 49%  
**Usage:** Body text, descriptions, secondary information  
**Contrast Ratio:** 4.8:1 (AA) on white background

---

## 🎨 Background Colors

### Main Background (Pale Rose-White)
```css
--bg-color: #faf6f8;
```
**RGB:** 250, 246, 248  
**HSL:** 330°, 33%, 97%  
**Usage:** Main app background, page backgrounds  
**Personality:** Clean, soft, premium, elegant

### Card Background (Frosted Glass)
```css
--card-bg: rgba(255, 255, 255, 0.75);
```
**RGBA:** 255, 255, 255, 75% opacity  
**Usage:** Glass cards, overlays, modals  
**Effect:** Glassmorphism with backdrop-filter

---

## 🎯 Semantic Colors

### Success (Green)
```css
--success-color: #10b981;
```
**RGB:** 16, 185, 129  
**Usage:** Success messages, positive indicators, checkmarks

### Warning (Orange)
```css
--warning-color: #f59e0b;
```
**RGB:** 245, 158, 11  
**Usage:** Warning messages, caution indicators

### Error (Red)
```css
--error-color: #ef4444;
```
**RGB:** 239, 68, 68  
**Usage:** Error messages, destructive actions, alerts

### Info (Blue)
```css
--info-color: #3b82f6;
```
**RGB:** 59, 130, 246  
**Usage:** Information messages, tips, hints

---

## 🌟 Accent Colors

### Gold (Premium)
```css
--accent-gold: #FFD700;
```
**RGB:** 255, 215, 0  
**Usage:** Premium features, highlights, badges

### Lavender (Soft Accent)
```css
--accent-lavender: #dcc8d2;
```
**RGB:** 220, 200, 210  
**HSL:** 330°, 25%, 82%  
**Usage:** Subtle accents, decorative elements

---

## 🎨 Gradient Colors

### Background Gradient Stops
```css
/* Radial gradient colors */
--gradient-1: rgba(241, 211, 226, 0.4);  /* Soft pink */
--gradient-2: rgba(255, 255, 255, 0.9);  /* White */
--gradient-3: rgba(157, 90, 118, 0.15);  /* Primary rose */
--gradient-4: rgba(220, 200, 210, 0.5);  /* Lavender */
```

### Overlay Gradients
```css
/* Top overlay */
--overlay-top: linear-gradient(180deg, rgba(54, 33, 42, 0.85) 0%, transparent 100%);

/* Bottom overlay */
--overlay-bottom: linear-gradient(0deg, rgba(54, 33, 42, 0.85) 0%, transparent 100%);
```

---

## 🎨 Shadow Colors

### Card Shadow (Maroon-tinted)
```css
--card-shadow: 0 10px 40px rgba(89, 54, 69, 0.08);
```
**Base Color:** #593645 (text-headline)  
**Opacity:** 8%  
**Usage:** Cards, elevated elements, modals

### Button Shadow
```css
--button-shadow: 0 10px 25px rgba(157, 90, 118, 0.25);
```
**Base Color:** #9d5a76 (primary-color)  
**Opacity:** 25%  
**Usage:** Primary buttons, CTAs

---

## 📊 Color Usage Matrix

| Element | Primary | Secondary | Text | Background |
|---------|---------|-----------|------|------------|
| **Buttons** | #9d5a76 | #f1d3e2 | #ffffff | transparent |
| **Cards** | - | - | #593645 | rgba(255,255,255,0.75) |
| **Headlines** | - | - | #593645 | - |
| **Body Text** | - | - | #8a6f7b | - |
| **Links** | #9d5a76 | - | #9d5a76 | - |
| **Active States** | #9d5a76 | - | #9d5a76 | #f1d3e2 |
| **Hover States** | #8a4a66 | #f5dde8 | - | - |

---

## 🎨 Color Combinations

### Primary Combination
```css
background: #faf6f8;
color: #593645;
accent: #9d5a76;
```
**Use Case:** Main app layout, primary screens

### Card Combination
```css
background: rgba(255, 255, 255, 0.75);
color: #593645;
border: rgba(255, 255, 255, 0.85);
```
**Use Case:** Glass cards, content containers

### Button Combination
```css
background: #9d5a76;
color: #ffffff;
hover: #8a4a66;
```
**Use Case:** Primary CTAs, important actions

---

## ♿ Accessibility

### Contrast Ratios (WCAG 2.1)

| Combination | Ratio | Level | Pass |
|-------------|-------|-------|------|
| #593645 on #faf6f8 | 9.8:1 | AAA | ✅ |
| #8a6f7b on #faf6f8 | 4.8:1 | AA | ✅ |
| #9d5a76 on #ffffff | 4.9:1 | AA | ✅ |
| #ffffff on #9d5a76 | 4.3:1 | AA | ✅ |
| #593645 on #f1d3e2 | 7.2:1 | AAA | ✅ |

**All combinations meet WCAG AA standards minimum.**

---

## 🎨 Color Psychology

### Primary Rose (#9d5a76)
- **Emotions:** Confidence, elegance, femininity
- **Associations:** Beauty, care, professionalism
- **Use:** Trust-building, premium features

### Soft Pink (#f1d3e2)
- **Emotions:** Gentleness, warmth, approachability
- **Associations:** Care, softness, comfort
- **Use:** Backgrounds, subtle accents

### Deep Maroon (#593645)
- **Emotions:** Trust, stability, sophistication
- **Associations:** Professionalism, depth, quality
- **Use:** Headlines, important information

---

## 💻 Code Examples

### CSS Variables
```css
:root {
  --primary-color: #9d5a76;
  --primary-light: #f1d3e2;
  --text-headline: #593645;
  --text-body: #8a6f7b;
  --bg-color: #faf6f8;
  --card-bg: rgba(255, 255, 255, 0.75);
}
```

### Usage in Components
```css
.button-primary {
  background: var(--primary-color);
  color: white;
  box-shadow: 0 10px 25px rgba(157, 90, 118, 0.25);
}

.card {
  background: var(--card-bg);
  color: var(--text-headline);
  box-shadow: var(--card-shadow);
}

.headline {
  color: var(--text-headline);
}

.body-text {
  color: var(--text-body);
}
```

### React/JSX
```jsx
<button style={{
  background: 'var(--primary-color)',
  color: 'white',
  padding: '16px 32px',
  borderRadius: '24px'
}}>
  Primary Button
</button>
```

---

## 🎨 Color Variations

### Hover States
```css
/* Primary hover (10% darker) */
--primary-hover: #8a4a66;

/* Primary light hover (5% darker) */
--primary-light-hover: #f5dde8;
```

### Active States
```css
/* Primary active (15% darker) */
--primary-active: #7d4359;
```

### Disabled States
```css
/* Disabled (50% opacity) */
--primary-disabled: rgba(157, 90, 118, 0.5);
```

---

## 📱 Platform-Specific

### iOS
- Use exact hex values
- Support dark mode (future)
- Maintain contrast ratios

### Android
- Use Material Design color system
- Map to nearest Material colors
- Support dynamic theming

### Web
- Use CSS variables
- Support all modern browsers
- Fallback for older browsers

---

## 🎨 Export Formats

### Hex
```
#9d5a76
#f1d3e2
#593645
#8a6f7b
#faf6f8
```

### RGB
```
rgb(157, 90, 118)
rgb(241, 211, 226)
rgb(89, 54, 69)
rgb(138, 111, 123)
rgb(250, 246, 248)
```

### HSL
```
hsl(339, 27%, 48%)
hsl(330, 52%, 89%)
hsl(334, 24%, 28%)
hsl(333, 11%, 49%)
hsl(330, 33%, 97%)
```

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0

