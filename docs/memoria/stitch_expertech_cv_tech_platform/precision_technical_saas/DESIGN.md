---
name: Precision Technical SaaS
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3e4850'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6e7881'
  outline-variant: '#bec8d2'
  surface-tint: '#006591'
  primary: '#006591'
  on-primary: '#ffffff'
  primary-container: '#0ea5e9'
  on-primary-container: '#003751'
  inverse-primary: '#89ceff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#bc0b3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff697b'
  on-tertiary-container: '#6c001d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c9e6ff'
  primary-fixed-dim: '#89ceff'
  on-primary-fixed: '#001e2f'
  on-primary-fixed-variant: '#004c6e'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffdadb'
  tertiary-fixed-dim: '#ffb2b7'
  on-tertiary-fixed: '#40000d'
  on-tertiary-fixed-variant: '#92002a'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  gutter-desktop: 24px
  margin-desktop: 48px
  gutter-mobile: 16px
  margin-mobile: 20px
  section-gap: 80px
---

## Brand & Style

The design system is engineered for a high-fidelity, professional SaaS environment. It targets high-achieving professionals and technical experts who value precision, clarity, and authority. The visual narrative is built on the concept of "The Technical Edge"—utilizing sharp execution, generous whitespace, and a focused color palette to convey trust and modern capability.

The style is **Corporate / Modern** with a heavy influence from **Minimalism**. It avoids unnecessary decorative elements, instead relying on mathematical spacing, clear typographic hierarchies, and subtle depth to guide the user. The emotional response is one of calm confidence and organized efficiency, ensuring the user feels empowered by a tool that is as professional as they are.

## Colors

The palette is anchored by a sophisticated "Night Blue" for core text and a "Soft White/Blue" for the primary canvas, ensuring maximum legibility and a premium feel. 

- **Primary (Electric Blue):** Used for navigation, primary actions, and brand identification. It represents technology and forward momentum.
- **Secondary (Tech Green):** Reserved for success states, progress indicators, and "growth" oriented features.
- **Tertiary (Soft Coral):** A high-impact accent used exclusively for critical Calls to Action (CTAs) and urgent user notifications.
- **Neutral (Night Blue):** Applied to headings and body text to provide high-contrast grounding against the airy background.

## Typography

This design system utilizes **Inter** exclusively to maintain a systematic, utilitarian aesthetic. The type scale is optimized for information-dense applications while preserving a sense of airiness through generous line heights.

Headlines use tighter letter-spacing and heavier weights to create an authoritative presence. Body text is set with standard tracking to ensure long-form readability. Small labels and metadata utilize a slight uppercase transform and increased letter spacing to differentiate them from functional UI text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy on desktop to ensure CV previews and editor panels maintain consistent proportions. A 12-column grid is used for the main dashboard, while the document editor uses a centered, focused column.

Spacing is governed by an 8px linear scale. We prioritize "generous whitespace" to prevent cognitive overload, particularly in data-heavy sections. 
- **Desktop:** 12 columns, 48px margins, 24px gutters.
- **Tablet:** 8 columns, 32px margins, 20px gutters.
- **Mobile:** 4 columns, 20px margins, 16px gutters.

Large section gaps (80px+) are used to clearly separate high-level functional areas within the platform.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** and **Ambient Shadows**. We avoid heavy borders in favor of soft depth cues that make the UI feel lightweight and modern.

- **Level 0 (Base):** The #F8FAFC background.
- **Level 1 (Cards/Surface):** Pure White (#FFFFFF) with a very subtle, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Level 2 (Dropdowns/Modals):** Pure White (#FFFFFF) with a more defined shadow (0px 12px 24px rgba(15, 23, 42, 0.1)).
- **Outlines:** Use a 1px border (#E2E8F0) for input fields and non-elevated containers to maintain structure without adding visual weight.

## Shapes

The design system employs a **Rounded** shape language with an 8px (0.5rem) base radius. This provides a professional yet approachable feel that softens the "technical" nature of the product.

- **Standard Elements:** 8px radius (Buttons, Input Fields, Cards).
- **Large Containers:** 16px radius (Modals, Large Sections).
- **Small Elements:** 4px radius (Tags, Tooltips).
- **Interactive States:** On hover, depth may increase slightly, but shape radius remains constant to preserve the grid's integrity.

## Components

### Buttons
- **Primary:** Electric Blue background, white text. 8px radius.
- **Critical CTA:** Soft Coral background, white text. Used for "Download," "Publish," or "Upgrade."
- **Ghost:** No background, Electric Blue border and text.

### Input Fields
Inputs use a white background with a #E2E8F0 border. On focus, the border transitions to Electric Blue with a subtle 2px outer glow. Labels are positioned above the field in `label-md` Night Blue.

### Cards & CV Previews
CV Previews are housed in Level 1 elevated cards. They feature a 1px internal border to define the "paper" edge of the document against the UI background.

### Chips & Status Indicators
Used for skills or application status. These use a desaturated version of the accent colors (e.g., light green background with dark green text) to remain secondary to primary actions.

### Iconography
Icons must be **Modern Linear** with a 2px stroke weight. They should be monochromatic (Night Blue) unless used within a colored button or as a specific status indicator.