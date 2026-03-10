# 🔮 Glassmorphism - Cantik AI

**Complete Glass Effect System & Guidelines**

---

## 🎨 Core Glass Effect

### Primary Glass Card
```css
.card-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(89, 54, 69, 0.08);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

**Properties:**
- **Background:** 75% white opacity
- **Blur:** 25px backdrop filter
- **Border Radius:** 28px (soft, premium)
- **Shadow:** Maroon-tinted, soft
- **Border:** Semi-transparent white

---

## 🌟 Glass Variations

### Light Glass (Subtle)
```css
.glass-light {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 24px;
  box-shadow: 0 4px 20px rgba(89, 54, 69, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.8);
}
```
**Usage:** Subtle overlays, secondary cards

### Heavy Glass (Strong)
```css
.glass-heavy {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 28px;
  box-shadow: 0 15px 50px rgba(89, 54, 69, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.9);
}
```
**Usage:** Modals, important overlays, navigation

### Floating Pill (Navigation)
```css
.nav-floating-pill {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(60px) saturate(180%);
  -webkit-backdrop-filter: blur(60px) saturate(180%);
  border-radius: 24px;
  box-shadow: 
    0 8px 32px rgba(157, 90, 118, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.25);
}
```
**Usage:** Bottom navigation, floating elements

---

## 🎨 Backdrop Filters

### Blur Levels
```css
--blur-subtle: blur(10px);
--blur-light: blur(15px);
--blur-medium: blur(25px);
--blur-heavy: blur(40px);
--blur-intense: blur(60px);
```

### Saturation
```css
backdrop-filter: blur(40px) saturate(180%);
```
**Effect:** Enhances colors behind glass

### Brightness
```css
backdrop-filter: blur(25px) brightness(1.1);
```
**Effect:** Lightens background slightly

---

## 🌈 Glass with Color Tints

### Rose Tint
```css
.glass-rose {
  background: rgba(241, 211, 226, 0.6);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(241, 211, 226, 0.8);
}
```

### White Tint
```css
.glass-white {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

### Dark Tint (Overlays)
```css
.glass-dark {
  background: rgba(54, 33, 42, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

---

## 💫 Shadow System

### Card Shadow (Soft)
```css
box-shadow: 0 10px 40px rgba(89, 54, 69, 0.08);
```
**Usage:** Standard cards, containers

### Button Shadow (Medium)
```css
box-shadow: 0 10px 25px rgba(157, 90, 118, 0.25);
```
**Usage:** Primary buttons, CTAs

### Floating Shadow (Strong)
```css
box-shadow: 
  0 8px 32px rgba(157, 90, 118, 0.06),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);
```
**Usage:** Floating navigation, modals

### Hover Shadow (Elevated)
```css
box-shadow: 0 15px 50px rgba(89, 54, 69, 0.12);
```
**Usage:** Hover states, active elements

---

## 🎯 Border Treatments

### Standard Border
```css
border: 1px solid rgba(255, 255, 255, 0.85);
```

### Subtle Border
```css
border: 1px solid rgba(255, 255, 255, 0.5);
```

### Strong Border
```css
border: 1px solid rgba(255, 255, 255, 0.9);
```

### Accent Border
```css
border: 2px solid rgba(157, 90, 118, 0.3);
```

---

## 📐 Border Radius Scale

```css
--radius-sm: 12px;    /* Small elements */
--radius-md: 20px;    /* Medium elements */
--radius-lg: 24px;    /* Large cards */
--radius-xl: 28px;    /* Premium cards */
--radius-pill: 30px;  /* Buttons, pills */
--radius-full: 50%;   /* Circles */
```

---

## 💻 Code Examples

### React Component
```jsx
<div style={{
  background: 'rgba(255, 255, 255, 0.75)',
  backdropFilter: 'blur(25px)',
  WebkitBackdropFilter: 'blur(25px)',
  borderRadius: '28px',
  boxShadow: '0 10px 40px rgba(89, 54, 69, 0.08)',
  padding: '24px',
  border: '1px solid rgba(255, 255, 255, 0.85)'
}}>
  <h3>Glass Card Content</h3>
</div>
```

### CSS Class
```css
.my-glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-radius: var(--radius-xl);
  box-shadow: var(--card-shadow);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

---

## 🎨 Layering Glass

### Multiple Layers
```css
/* Background layer */
.glass-layer-1 {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

/* Middle layer */
.glass-layer-2 {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
}

/* Top layer */
.glass-layer-3 {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px);
}
```

---

## 🌟 Special Effects

### Frosted Glass
```css
.frosted-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
}
```

### Glossy Glass
```css
.glossy-glass {
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(255, 255, 255, 0.7) 100%
  );
  backdrop-filter: blur(30px);
  box-shadow: 
    0 10px 40px rgba(89, 54, 69, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 1);
}
```

### Tinted Glass
```css
.tinted-glass {
  background: linear-gradient(
    135deg,
    rgba(241, 211, 226, 0.7) 0%,
    rgba(255, 255, 255, 0.6) 100%
  );
  backdrop-filter: blur(25px);
}
```

---

## 📱 Browser Support

### Modern Browsers
- ✅ Chrome 76+
- ✅ Safari 9+
- ✅ Firefox 103+
- ✅ Edge 79+

### Fallback
```css
.card-glass {
  background: rgba(255, 255, 255, 0.95); /* Fallback */
  backdrop-filter: blur(25px);
}

@supports not (backdrop-filter: blur(25px)) {
  .card-glass {
    background: rgba(255, 255, 255, 0.95);
  }
}
```

---

## 🎯 Usage Guidelines

### DO ✅
- Use glass effects for cards and overlays
- Maintain consistent blur levels
- Use white/light backgrounds for glass
- Add subtle borders for definition
- Layer glass elements properly
- Use maroon-tinted shadows

### DON'T ❌
- Don't use glass on solid backgrounds
- Don't over-blur (max 60px)
- Don't use dark glass on dark backgrounds
- Don't forget webkit prefix
- Don't use glass for text-heavy content
- Don't stack too many glass layers

---

## 🎨 Glass + Gradient

### Background with Glass
```css
.container {
  background: linear-gradient(
    180deg,
    rgba(250, 246, 248, 1) 0%,
    rgba(241, 211, 226, 0.5) 100%
  );
}

.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(25px);
}
```

---

## 💫 Animation with Glass

### Hover Effect
```css
.glass-card {
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px);
  box-shadow: 0 15px 50px rgba(89, 54, 69, 0.12);
  transform: translateY(-2px);
}
```

### Active State
```css
.glass-card:active {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(35px);
  transform: translateY(0);
}
```

---

## 🎨 Glass Presets

### Preset 1: Subtle Card
```css
background: rgba(255, 255, 255, 0.6);
backdrop-filter: blur(15px);
border-radius: 20px;
box-shadow: 0 4px 20px rgba(89, 54, 69, 0.05);
border: 1px solid rgba(255, 255, 255, 0.8);
```

### Preset 2: Standard Card
```css
background: rgba(255, 255, 255, 0.75);
backdrop-filter: blur(25px);
border-radius: 28px;
box-shadow: 0 10px 40px rgba(89, 54, 69, 0.08);
border: 1px solid rgba(255, 255, 255, 0.85);
```

### Preset 3: Premium Card
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(40px) saturate(180%);
border-radius: 28px;
box-shadow: 0 15px 50px rgba(89, 54, 69, 0.12);
border: 1px solid rgba(255, 255, 255, 0.9);
```

### Preset 4: Floating Navigation
```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(60px) saturate(180%);
border-radius: 24px;
box-shadow: 
  0 8px 32px rgba(157, 90, 118, 0.06),
  inset 0 1px 0 rgba(255, 255, 255, 0.3);
border: 1px solid rgba(255, 255, 255, 0.25);
```

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0

