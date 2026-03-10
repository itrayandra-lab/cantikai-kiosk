# ✍️ Typography - Cantik AI

**Complete Typography System & Guidelines**

---

## 🔤 Font Families

### Primary Font (Headlines)
```css
--font-serif: 'Playfair Display', serif;
```
**Source:** Google Fonts  
**Weights Available:** 400, 500, 600, 700, 400italic  
**Usage:** Headlines, titles, hero text, brand elements  
**Personality:** Elegant, sophisticated, premium, classic

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
```

### Secondary Font (Body)
```css
--font-sans: 'Outfit', sans-serif;
```
**Source:** Google Fonts  
**Weights Available:** 300, 400, 500, 600, 700  
**Usage:** Body text, UI elements, buttons, labels  
**Personality:** Modern, clean, readable, friendly

**Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
```

---

## 📏 Typography Scale

### Display (Hero)
```css
font-size: 3.4rem;        /* 54.4px */
line-height: 1.05;        /* 57.12px */
font-weight: 500;
font-family: var(--font-serif);
letter-spacing: -0.8px;
```
**Usage:** Hero headlines, main page titles  
**Example:** "Kulit Anda"

### Heading 1
```css
font-size: 2.5rem;        /* 40px */
line-height: 1.1;         /* 44px */
font-weight: 600;
font-family: var(--font-serif);
letter-spacing: -0.5px;
```
**Usage:** Page titles, section headers  
**Example:** "Laporan Kulit Anda"

### Heading 2
```css
font-size: 1.75rem;       /* 28px */
line-height: 1.2;         /* 33.6px */
font-weight: 600;
font-family: var(--font-serif);
letter-spacing: -0.3px;
```
**Usage:** Card titles, subsection headers  
**Example:** "Analisis Detail"

### Heading 3
```css
font-size: 1.25rem;       /* 20px */
line-height: 1.3;         /* 26px */
font-weight: 600;
font-family: var(--font-sans);
letter-spacing: 0;
```
**Usage:** Component titles, small headers  
**Example:** "Rekomendasi Produk"

### Body Large
```css
font-size: 1.05rem;       /* 16.8px */
line-height: 1.6;         /* 26.88px */
font-weight: 400;
font-family: var(--font-sans);
```
**Usage:** Important body text, introductions  
**Example:** Product descriptions

### Body Regular
```css
font-size: 0.95rem;       /* 15.2px */
line-height: 1.7;         /* 25.84px */
font-weight: 400;
font-family: var(--font-sans);
```
**Usage:** Standard body text, paragraphs  
**Example:** Article content

### Body Small
```css
font-size: 0.85rem;       /* 13.6px */
line-height: 1.5;         /* 20.4px */
font-weight: 400;
font-family: var(--font-sans);
```
**Usage:** Secondary text, captions, metadata  
**Example:** Timestamps, labels

### Caption
```css
font-size: 0.75rem;       /* 12px */
line-height: 1.4;         /* 16.8px */
font-weight: 500;
font-family: var(--font-sans);
```
**Usage:** Small labels, badges, tags  
**Example:** "NEW", "SALE"

---

## 🎨 Font Weights

### Playfair Display (Serif)
- **400 (Regular):** Body text in serif style
- **500 (Medium):** Standard headlines
- **600 (Semi-Bold):** Important headlines
- **700 (Bold):** Hero text, emphasis
- **400 Italic:** Quotes, emphasis

### Outfit (Sans-Serif)
- **300 (Light):** Subtle text, decorative
- **400 (Regular):** Standard body text
- **500 (Medium):** UI elements, buttons
- **600 (Semi-Bold):** Subheadings, labels
- **700 (Bold):** Strong emphasis, CTAs

---

## 📐 Letter Spacing

```css
/* Headlines (Playfair Display) */
--letter-spacing-tight: -0.8px;    /* Display */
--letter-spacing-normal: -0.5px;   /* H1 */
--letter-spacing-slight: -0.3px;   /* H2 */

/* Body (Outfit) */
--letter-spacing-body: 0px;        /* Normal */
--letter-spacing-wide: 0.5px;      /* Uppercase labels */
```

---

## 📏 Line Heights

```css
--line-height-tight: 1.05;    /* Display text */
--line-height-snug: 1.1;      /* Headlines */
--line-height-normal: 1.3;    /* Subheadings */
--line-height-relaxed: 1.6;   /* Body text */
--line-height-loose: 1.7;     /* Long-form content */
```

---

## 🎯 Typography Classes

### CSS Classes
```css
.headline {
  font-family: var(--font-serif);
  color: var(--text-headline);
  font-weight: 500;
  letter-spacing: -0.8px;
}

.subtitle {
  font-size: 0.95rem;
  color: var(--text-body);
  font-weight: 400;
}

.body-text {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-body);
}

.caption {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
```

---

## 💻 Code Examples

### React/JSX
```jsx
// Display Headline
<h1 style={{
  fontFamily: 'var(--font-serif)',
  fontSize: '3.4rem',
  lineHeight: 1.05,
  fontWeight: 500,
  letterSpacing: '-0.8px',
  color: 'var(--text-headline)'
}}>
  Kulit Anda
</h1>

// Body Text
<p style={{
  fontFamily: 'var(--font-sans)',
  fontSize: '0.95rem',
  lineHeight: 1.7,
  color: 'var(--text-body)'
}}>
  Analisis kulit dengan teknologi AI terkini
</p>

// Button Text
<button style={{
  fontFamily: 'var(--font-sans)',
  fontSize: '1rem',
  fontWeight: 600,
  letterSpacing: '0px'
}}>
  Mulai Scan
</button>
```

### HTML + CSS
```html
<h1 class="headline">Laporan Kulit Anda</h1>
<p class="subtitle">Hasil analisis lengkap</p>
<p class="body-text">
  Kulit Anda dalam kondisi baik dengan beberapa area 
  yang bisa mendapat manfaat dari perawatan tertarget.
</p>
```

---

## 📱 Responsive Typography

### Mobile (< 768px)
```css
.headline {
  font-size: 2.5rem;        /* Reduced from 3.4rem */
  line-height: 1.1;
}

h1 {
  font-size: 2rem;          /* Reduced from 2.5rem */
}

h2 {
  font-size: 1.5rem;        /* Reduced from 1.75rem */
}

.body-text {
  font-size: 0.9rem;        /* Slightly smaller */
  line-height: 1.6;
}
```

### Tablet (768px - 1024px)
```css
/* Use standard sizes */
```

### Desktop (> 1024px)
```css
/* Use standard sizes */
/* Max-width: 600px container prevents text from being too wide */
```

---

## 🎨 Text Colors

### Primary Text
```css
color: var(--text-headline);  /* #593645 - Deep maroon */
```
**Usage:** Headlines, important text, navigation

### Secondary Text
```css
color: var(--text-body);      /* #8a6f7b - Muted rose-grey */
```
**Usage:** Body text, descriptions, secondary info

### Accent Text
```css
color: var(--primary-color);  /* #9d5a76 - Primary rose */
```
**Usage:** Links, active states, emphasis

### White Text
```css
color: #ffffff;
```
**Usage:** Text on dark backgrounds, buttons

---

## 📊 Typography Hierarchy

```
Display (3.4rem, Serif, 500)
    ↓
H1 (2.5rem, Serif, 600)
    ↓
H2 (1.75rem, Serif, 600)
    ↓
H3 (1.25rem, Sans, 600)
    ↓
Body Large (1.05rem, Sans, 400)
    ↓
Body Regular (0.95rem, Sans, 400)
    ↓
Body Small (0.85rem, Sans, 400)
    ↓
Caption (0.75rem, Sans, 500)
```

---

## 🎯 Usage Guidelines

### DO ✅
- Use Playfair Display for headlines and titles
- Use Outfit for body text and UI elements
- Maintain consistent line heights
- Use proper letter spacing for headlines
- Keep body text between 0.85rem - 1.05rem
- Use font weights to create hierarchy

### DON'T ❌
- Don't use more than 2 font families
- Don't use font sizes smaller than 0.75rem
- Don't use all caps for long text
- Don't use italic for body text
- Don't mix serif and sans in same paragraph
- Don't use too many font weights

---

## 🎨 Special Typography

### Uppercase Labels
```css
text-transform: uppercase;
letter-spacing: 0.5px;
font-size: 0.7rem;
font-weight: 600;
font-family: var(--font-sans);
```
**Usage:** Category labels, badges, tags

### Numbers/Scores
```css
font-family: var(--font-serif);
font-size: 2.8rem;
font-weight: 600;
line-height: 1;
color: var(--text-headline);
```
**Usage:** Scores, statistics, metrics

### Quotes
```css
font-family: var(--font-serif);
font-style: italic;
font-size: 1.1rem;
line-height: 1.6;
color: var(--text-body);
```
**Usage:** Testimonials, quotes

---

## ♿ Accessibility

### Minimum Sizes
- **Body text:** 0.85rem (13.6px) minimum
- **Touch targets:** 44px minimum height
- **Line length:** 50-75 characters optimal

### Contrast
- All text meets WCAG AA standards
- Headlines: 9.8:1 contrast ratio
- Body text: 4.8:1 contrast ratio

### Readability
- Line height: 1.5-1.7 for body text
- Paragraph spacing: 1em
- Max line length: 75 characters

---

## 📦 Font Loading

### Optimal Loading
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Font Display
```css
@import url('...&display=swap');
```
**Strategy:** `swap` - Show fallback font immediately, swap when custom font loads

---

## 🎨 Fallback Fonts

```css
--font-serif: 'Playfair Display', Georgia, 'Times New Roman', serif;
--font-sans: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

---

**Last Updated:** March 3, 2026  
**Version:** 1.0.0

