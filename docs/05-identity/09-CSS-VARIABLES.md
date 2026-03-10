# 🎨 CSS Variables - Cantik AI

**Complete CSS Custom Properties for Easy Implementation**

---

## 📦 Complete CSS Variables

### Copy-Paste Ready
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

:root {
  /* ========== COLORS ========== */
  
  /* Primary Colors */
  --primary-color: #9d5a76;
  --primary-light: #f1d3e2;
  --primary-hover: #8a4a66;
  --primary-active: #7d4359;
  --primary-disabled: rgba(157, 90, 118, 0.5);
  
  /* Text Colors */
  --text-headline: #593645;
  --text-body: #8a6f7b;
  --text-white: #ffffff;
  --text-muted: rgba(138, 111, 123, 0.7);
  
  /* Background Colors */
  --bg-color: #faf6f8;
  --card-bg: rgba(255, 255, 255, 0.75);
  --overlay-dark: rgba(54, 33, 42, 0.85);
  --overlay-light: rgba(255, 255, 255, 0.9);
  
  /* Semantic Colors */
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  --info-color: #3b82f6;
  
  /* Accent Colors */
  --accent-gold: #FFD700;
  --accent-lavender: #dcc8d2;
  
  /* ========== TYPOGRAPHY ========== */
  
  /* Font Families */
  --font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-sans: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  
  /* Font Sizes */
  --font-size-display: 3.4rem;      /* 54.4px */
  --font-size-h1: 2.5rem;           /* 40px */
  --font-size-h2: 1.75rem;          /* 28px */
  --font-size-h3: 1.25rem;          /* 20px */
  --font-size-body-lg: 1.05rem;     /* 16.8px */
  --font-size-body: 0.95rem;        /* 15.2px */
  --font-size-body-sm: 0.85rem;     /* 13.6px */
  --font-size-caption: 0.75rem;     /* 12px */
  
  /* Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.05;
  --line-height-snug: 1.1;
  --line-height-normal: 1.3;
  --line-height-relaxed: 1.6;
  --line-height-loose: 1.7;
  
  /* Letter Spacing */
  --letter-spacing-tight: -0.8px;
  --letter-spacing-normal: -0.5px;
  --letter-spacing-slight: -0.3px;
  --letter-spacing-body: 0px;
  --letter-spacing-wide: 0.5px;
  
  /* ========== SPACING ========== */
  
  /* Base Unit: 8px */
  --space-1: 0.5rem;    /* 8px */
  --space-2: 1rem;      /* 16px */
  --space-3: 1.5rem;    /* 24px */
  --space-4: 2rem;      /* 32px */
  --space-5: 2.5rem;    /* 40px */
  --space-6: 3rem;      /* 48px */
  --space-8: 4rem;      /* 64px */
  --space-10: 5rem;     /* 80px */
  --space-12: 6rem;     /* 96px */
  
  /* ========== BORDER RADIUS ========== */
  
  --radius-sm: 12px;
  --radius-md: 20px;
  --radius-lg: 24px;
  --radius-xl: 28px;
  --radius-pill: 30px;
  --radius-full: 50%;
  
  /* ========== SHADOWS ========== */
  
  --shadow-card: 0 10px 40px rgba(89, 54, 69, 0.08);
  --shadow-button: 0 10px 25px rgba(157, 90, 118, 0.25);
  --shadow-floating: 0 8px 32px rgba(157, 90, 118, 0.06);
  --shadow-hover: 0 15px 50px rgba(89, 54, 69, 0.12);
  --shadow-inset: inset 0 1px 0 rgba(255, 255, 255, 0.3);
  
  /* ========== BLUR ========== */
  
  --blur-subtle: 10px;
  --blur-light: 15px;
  --blur-medium: 25px;
  --blur-heavy: 40px;
  --blur-intense: 60px;
  
  /* ========== TRANSITIONS ========== */
  
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  --transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* ========== Z-INDEX ========== */
  
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-fixed: 300;
  --z-modal-backdrop: 400;
  --z-modal: 500;
  --z-popover: 600;
  --z-tooltip: 700;
  --z-notification: 800;
  
  /* ========== CONTAINER ========== */
  
  --container-max-width: 600px;
  --container-padding: 24px;
  
  /* ========== BREAKPOINTS ========== */
  
  --breakpoint-mobile: 480px;
  --breakpoint-tablet: 768px;
  --breakpoint-desktop: 1024px;
  --breakpoint-wide: 1280px;
}

/* ========== RESPONSIVE FONT SIZES ========== */

@media (max-width: 768px) {
  :root {
    --font-size-display: 2.5rem;    /* Reduced */
    --font-size-h1: 2rem;           /* Reduced */
    --font-size-h2: 1.5rem;         /* Reduced */
    --font-size-body: 0.9rem;       /* Slightly smaller */
  }
}
```

---

## 🎨 Usage Examples

### Basic Component
```css
.my-card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur-medium));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.85);
}
```

### Button
```css
.btn-primary {
  background: var(--primary-color);
  color: var(--text-white);
  font-family: var(--font-sans);
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-button);
  transition: var(--transition-normal);
}

.btn-primary:hover {
  background: var(--primary-hover);
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
```

### Typography
```css
.headline {
  font-family: var(--font-serif);
  font-size: var(--font-size-display);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-tight);
  color: var(--text-headline);
}

.body-text {
  font-family: var(--font-sans);
  font-size: var(--font-size-body);
  line-height: var(--line-height-loose);
  color: var(--text-body);
}
```

### Glass Card
```css
.glass-card {
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur-medium));
  -webkit-backdrop-filter: blur(var(--blur-medium));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  border: 1px solid rgba(255, 255, 255, 0.85);
  transition: var(--transition-normal);
}

.glass-card:hover {
  box-shadow: var(--shadow-hover);
  transform: translateY(-2px);
}
```

---

## 🎯 React/JSX Usage

### Inline Styles
```jsx
<div style={{
  background: 'var(--primary-color)',
  color: 'var(--text-white)',
  padding: 'var(--space-3)',
  borderRadius: 'var(--radius-lg)',
  fontFamily: 'var(--font-sans)'
}}>
  Content
</div>
```

### Styled Components
```jsx
import styled from 'styled-components';

const Card = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(var(--blur-medium));
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  padding: var(--space-3);
  transition: var(--transition-normal);
  
  &:hover {
    box-shadow: var(--shadow-hover);
    transform: translateY(-2px);
  }
`;
```

---

## 🎨 Color Utilities

### Background Classes
```css
.bg-primary { background: var(--primary-color); }
.bg-primary-light { background: var(--primary-light); }
.bg-white { background: var(--text-white); }
.bg-card { background: var(--card-bg); }
```

### Text Classes
```css
.text-headline { color: var(--text-headline); }
.text-body { color: var(--text-body); }
.text-primary { color: var(--primary-color); }
.text-white { color: var(--text-white); }
```

---

## 📐 Spacing Utilities

```css
/* Padding */
.p-1 { padding: var(--space-1); }
.p-2 { padding: var(--space-2); }
.p-3 { padding: var(--space-3); }
.p-4 { padding: var(--space-4); }

/* Margin */
.m-1 { margin: var(--space-1); }
.m-2 { margin: var(--space-2); }
.m-3 { margin: var(--space-3); }
.m-4 { margin: var(--space-4); }

/* Gap */
.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-3 { gap: var(--space-3); }
```

---

## 🎨 Border Radius Utilities

```css
.rounded-sm { border-radius: var(--radius-sm); }
.rounded-md { border-radius: var(--radius-md); }
.rounded-lg { border-radius: var(--radius-lg); }
.rounded-xl { border-radius: var(--radius-xl); }
.rounded-pill { border-radius: var(--radius-pill); }
.rounded-full { border-radius: var(--radius-full); }
```

---

## 💫 Animation Utilities

```css
.transition-fast { transition: var(--transition-fast); }
.transition-normal { transition: var(--transition-normal); }
.transition-slow { transition: var(--transition-slow); }
.transition-smooth { transition: var(--transition-smooth); }
```

---

## 🎯 Complete Starter Template

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cantik AI - Design System</title>
  
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap');

    :root {
      /* Paste all CSS variables here */
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

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
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    .container {
      max-width: var(--container-max-width);
      margin: 0 auto;
      padding: var(--container-padding);
    }

    .card-glass {
      background: var(--card-bg);
      backdrop-filter: blur(var(--blur-medium));
      -webkit-backdrop-filter: blur(var(--blur-medium));
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-card);
      padding: var(--space-3);
      border: 1px solid rgba(255, 255, 255, 0.85);
    }

    .headline {
      font-family: var(--font-serif);
      font-size: var(--font-size-display);
      font-weight: var(--font-weight-medium);
      line-height: var(--line-height-tight);
      letter-spacing: var(--letter-spacing-tight);
      color: var(--text-headline);
    }

    .btn-primary {
      background: var(--primary-color);
      color: var(--text-white);
      font-family: var(--font-sans);
      font-size: var(--font-size-body);
      font-weight: var(--font-weight-semibold);
      padding: var(--space-2) var(--space-4);
      border-radius: var(--radius-pill);
      box-shadow: var(--shadow-button);
      border: none;
      cursor: pointer;
      transition: var(--transition-normal);
    }

    .btn-primary:hover {
      background: var(--primary-hover);
      box-shadow: var(--shadow-hover);
      transform: translateY(-2px);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="headline">Cantik AI</h1>
    <div class="card-glass">
      <p>Your content here</p>
      <button class="btn-primary">Get Started</button>
    </div>
  </div>
</body>
</html>
```

---

## 📱 Responsive Variables

```css
@media (max-width: 768px) {
  :root {
    --container-padding: 16px;
    --space-6: 2rem;  /* Reduced */
  }
}

@media (max-width: 480px) {
  :root {
    --container-padding: 12px;
  }
}
```

---

## 🎨 Dark Mode (Future)

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-color: #1a1a1a;
    --text-headline: #f5f5f5;
    --text-body: #d1d1d1;
    --card-bg: rgba(30, 30, 30, 0.75);
    /* Add more dark mode variables */
  }
}
```

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0

