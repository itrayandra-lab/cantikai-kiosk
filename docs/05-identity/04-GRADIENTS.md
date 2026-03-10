# 🌈 Gradients - Cantik AI

**Complete Gradient System & Usage Guidelines**

---

## 🎨 Background Gradients

### Main App Background
```css
background: #faf6f8;
background-image:
  radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.4) 0%, transparent 40%),
  radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 60%),
  radial-gradient(circle at 100% 80%, rgba(157, 90, 118, 0.15) 0%, transparent 50%),
  radial-gradient(circle at 0% 100%, rgba(220, 200, 210, 0.5) 0%, transparent 60%);
background-attachment: fixed;
```

**Effect:** Soft, ethereal, multi-layered radial gradients  
**Colors:** Soft pink, white, primary rose, lavender  
**Usage:** Main app background, page backgrounds

---

## 🌟 Radial Gradients

### Top Right (Soft Pink)
```css
radial-gradient(
  circle at 80% 0%,
  rgba(241, 211, 226, 0.4) 0%,
  transparent 40%
)
```
**Position:** Top right corner  
**Color:** #f1d3e2 (primary-light)  
**Opacity:** 40%  
**Spread:** 40%

### Center Left (White Glow)
```css
radial-gradient(
  circle at 20% 40%,
  rgba(255, 255, 255, 0.9) 0%,
  transparent 60%
)
```
**Position:** Left center  
**Color:** White  
**Opacity:** 90%  
**Spread:** 60%

### Bottom Right (Primary Rose)
```css
radial-gradient(
  circle at 100% 80%,
  rgba(157, 90, 118, 0.15) 0%,
  transparent 50%
)
```
**Position:** Bottom right  
**Color:** #9d5a76 (primary-color)  
**Opacity:** 15%  
**Spread:** 50%

### Bottom Left (Lavender)
```css
radial-gradient(
  circle at 0% 100%,
  rgba(220, 200, 210, 0.5) 0%,
  transparent 60%
)
```
**Position:** Bottom left corner  
**Color:** #dcc8d2 (accent-lavender)  
**Opacity:** 50%  
**Spread:** 60%

---

## 📐 Linear Gradients

### Top Overlay (Dark)
```css
linear-gradient(
  180deg,
  rgba(54, 33, 42, 0.85) 0%,
  transparent 100%
)
```
**Direction:** Top to bottom  
**Usage:** Camera overlay, top fade  
**Height:** 120px typical

### Bottom Overlay (Dark)
```css
linear-gradient(
  0deg,
  rgba(54, 33, 42, 0.85) 0%,
  transparent 100%
)
```
**Direction:** Bottom to top  
**Usage:** Camera overlay, bottom fade  
**Height:** 140px typical

### Image Overlay
```css
linear-gradient(
  to top,
  rgba(0, 0, 0, 0.7),
  transparent
)
```
**Direction:** Bottom to top  
**Usage:** Image cards, product images  
**Effect:** Darkens bottom for text readability

---

## 🎨 Button Gradients

### Primary Button
```css
background: var(--primary-color);
/* Solid color, no gradient */
```
**Note:** Primary buttons use solid color for clarity

### Hover State (Subtle)
```css
background: linear-gradient(
  135deg,
  #9d5a76 0%,
  #8a4a66 100%
)
```
**Effect:** Subtle darkening on hover

### Glossy Button (Premium)
```css
background: linear-gradient(
  135deg,
  rgba(157, 90, 118, 1) 0%,
  rgba(157, 90, 118, 0.9) 100%
);
box-shadow: 
  0 10px 25px rgba(157, 90, 118, 0.25),
  inset 0 1px 0 rgba(255, 255, 255, 0.2);
```
**Effect:** Glossy, premium appearance

---

## 🌈 Card Gradients

### Glass Card Background
```css
background: linear-gradient(
  135deg,
  rgba(255, 255, 255, 0.9) 0%,
  rgba(255, 255, 255, 0.7) 100%
);
backdrop-filter: blur(25px);
```
**Effect:** Subtle gradient within glass

### Tinted Glass Card
```css
background: linear-gradient(
  135deg,
  rgba(241, 211, 226, 0.7) 0%,
  rgba(255, 255, 255, 0.6) 100%
);
backdrop-filter: blur(25px);
```
**Effect:** Rose-tinted glass

---

## 🎯 Gradient Overlays

### Dark Overlay (Modals)
```css
background: linear-gradient(
  180deg,
  rgba(0, 0, 0, 0.8) 0%,
  rgba(0, 0, 0, 0.6) 100%
);
```
**Usage:** Modal backgrounds, overlays

### Light Overlay (Subtle)
```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 0.9) 0%,
  rgba(255, 255, 255, 0.7) 100%
);
```
**Usage:** Light overlays, subtle backgrounds

---

## 💫 Animated Gradients

### Shimmer Effect
```css
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.shimmer {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.3) 50%,
    transparent 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 2s infinite;
}
```
**Usage:** Loading states, skeleton screens

---

## 🎨 Gradient Presets

### Preset 1: Soft Background
```css
background: linear-gradient(
  180deg,
  #faf6f8 0%,
  #f1d3e2 100%
);
```

### Preset 2: Rose Fade
```css
background: linear-gradient(
  135deg,
  rgba(241, 211, 226, 0.8) 0%,
  rgba(250, 246, 248, 1) 100%
);
```

### Preset 3: White to Pink
```css
background: linear-gradient(
  180deg,
  rgba(255, 255, 255, 1) 0%,
  rgba(241, 211, 226, 0.3) 100%
);
```

### Preset 4: Dark Overlay
```css
background: linear-gradient(
  180deg,
  rgba(54, 33, 42, 0.9) 0%,
  rgba(54, 33, 42, 0.7) 100%
);
```

---

## 💻 Code Examples

### React Component
```jsx
<div style={{
  background: '#faf6f8',
  backgroundImage: `
    radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 60%),
    radial-gradient(circle at 100% 80%, rgba(157, 90, 118, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(220, 200, 210, 0.5) 0%, transparent 60%)
  `,
  backgroundAttachment: 'fixed'
}}>
  Content
</div>
```

### CSS Class
```css
.gradient-background {
  background: var(--bg-color);
  background-image:
    radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.4) 0%, transparent 40%),
    radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.9) 0%, transparent 60%),
    radial-gradient(circle at 100% 80%, rgba(157, 90, 118, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 0% 100%, rgba(220, 200, 210, 0.5) 0%, transparent 60%);
  background-attachment: fixed;
}
```

---

## 🎯 Usage Guidelines

### DO ✅
- Use radial gradients for backgrounds
- Keep gradients subtle (low opacity)
- Use multiple layers for depth
- Fix background attachment for parallax
- Use linear gradients for overlays
- Maintain consistent color palette

### DON'T ❌
- Don't use harsh gradients
- Don't use too many colors
- Don't make gradients too bright
- Don't use gradients on text
- Don't animate gradients (performance)
- Don't use gradients on small elements

---

## 🌟 Special Effects

### Glow Effect
```css
box-shadow: 
  0 0 20px rgba(157, 90, 118, 0.3),
  0 0 40px rgba(157, 90, 118, 0.2),
  0 0 60px rgba(157, 90, 118, 0.1);
```

### Inner Glow
```css
box-shadow: 
  inset 0 0 20px rgba(255, 255, 255, 0.5),
  inset 0 1px 0 rgba(255, 255, 255, 0.8);
```

---

## 📱 Responsive Gradients

### Mobile
```css
@media (max-width: 768px) {
  .gradient-background {
    background-image:
      radial-gradient(circle at 80% 0%, rgba(241, 211, 226, 0.3) 0%, transparent 30%),
      radial-gradient(circle at 20% 40%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
  }
}
```
**Note:** Fewer gradients on mobile for performance

---

## 🎨 Gradient Tools

### CSS Variables
```css
:root {
  --gradient-soft-pink: rgba(241, 211, 226, 0.4);
  --gradient-white: rgba(255, 255, 255, 0.9);
  --gradient-rose: rgba(157, 90, 118, 0.15);
  --gradient-lavender: rgba(220, 200, 210, 0.5);
}
```

### Usage
```css
background-image:
  radial-gradient(circle at 80% 0%, var(--gradient-soft-pink) 0%, transparent 40%);
```

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0

