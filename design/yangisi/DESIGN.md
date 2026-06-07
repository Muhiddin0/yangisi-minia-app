---
name: Yangisi
colors:
  surface: '#f9f9fc'
  surface-dim: '#dadadc'
  surface-bright: '#f9f9fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f6'
  surface-container: '#eeeef0'
  surface-container-high: '#e8e8ea'
  surface-container-highest: '#e2e2e5'
  on-surface: '#1a1c1e'
  on-surface-variant: '#424656'
  inverse-surface: '#2f3133'
  inverse-on-surface: '#f0f0f3'
  outline: '#727687'
  outline-variant: '#c2c6d8'
  surface-tint: '#0054d6'
  primary: '#0050cb'
  on-primary: '#ffffff'
  primary-container: '#0066ff'
  on-primary-container: '#f8f7ff'
  inverse-primary: '#b3c5ff'
  secondary: '#006e2a'
  on-secondary: '#ffffff'
  secondary-container: '#5cfd80'
  on-secondary-container: '#00732c'
  tertiary: '#7b5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#9c6700'
  on-tertiary-container: '#fff7f1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae1ff'
  primary-fixed-dim: '#b3c5ff'
  on-primary-fixed: '#001849'
  on-primary-fixed-variant: '#003fa4'
  secondary-fixed: '#69ff87'
  secondary-fixed-dim: '#3ce36a'
  on-secondary-fixed: '#002108'
  on-secondary-fixed-variant: '#00531e'
  tertiary-fixed: '#ffddb3'
  tertiary-fixed-dim: '#ffb950'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#624000'
  background: '#f9f9fc'
  on-background: '#1a1c1e'
  surface-variant: '#e2e2e5'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
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
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
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
  xs: 4px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  max-width: 1280px
---

## Brand & Style

The design system is built for a vibrant marketplace and communication platform that prioritizes speed, clarity, and a sense of "newness." It targets a tech-savvy audience that values efficiency but appreciates a warm, approachable interface. 

The aesthetic is **Corporate / Modern** with a touch of **Minimalism**. It focuses on high-quality typography and strategic whitespace to reduce cognitive load during complex tasks. The interface should feel reliable and professional, yet energetic enough to facilitate social interactions and commerce.

## Colors

The palette is anchored by a deep "Electric Blue" primary, conveying trust and technological precision. The secondary "Growth Green" is used for success states and transactional actions, while the tertiary "Alert Amber" highlights notifications and high-priority items.

The neutral scale is strictly balanced to ensure readability, using a deep charcoal for text rather than pure black to reduce eye strain. Surface colors follow a subtle grey-to-white progression to define hierarchy.

## Typography

This design system utilizes **Plus Jakarta Sans** for headlines to provide a friendly, optimistic, and modern character. Its rounded terminals and open apertures make the brand feel accessible.

**Inter** is utilized for body copy and labels. As a highly systematic and utilitarian typeface, it ensures maximum legibility for product descriptions, messaging, and data-heavy interfaces. On mobile, headlines scale down to prevent awkward line breaks while maintaining their bold weight.

## Layout & Spacing

The layout utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. Spacing is based on an 8px rhythmic scale to ensure mathematical harmony across all components.

- **Desktop:** 24px margins with 16px gutters. Content is contained within a 1280px max-width container.
- **Mobile:** 16px margins and 16px gutters. Elements should stack vertically, utilizing full-width patterns for primary actions.
- **Alignment:** All components must snap to the 8px baseline grid to maintain vertical rhythm.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows**. 

The design system avoids heavy drop shadows, opting instead for ultra-soft, diffused shadows (Blur: 16px-24px, Opacity: 4-8%) that make cards appear as if they are floating slightly above the background. Backgrounds use a light grey (F8F9FA) to separate the main canvas from pure white surface containers. Interactive elements like buttons use a slight "lift" effect on hover to provide tactile feedback.

## Shapes

The shape language is **Rounded**, reflecting the friendly and optimistic nature of the brand. 

Standard components (buttons, inputs) use a 0.5rem (8px) radius. Larger containers like cards use 1rem (16px), and feature modules or modal overlays use 1.5rem (24px). This progressive rounding helps users distinguish between small interactive elements and large structural containers.

## Components

- **Buttons:** Primary buttons use a solid primary color fill with white text. Secondary buttons use a primary-colored ghost border. All buttons have a height of 48px for better tap targets on mobile.
- **Input Fields:** Use a 1px neutral border that transitions to the primary color on focus. Labels sit above the field in `body-sm`.
- **Cards:** White background with a 1px subtle neutral-200 border or a very soft ambient shadow to define boundaries.
- **Chips/Tags:** Used for categories and status. These use a light tint of the status color (e.g., light green background for a "Success" status) with high-contrast text.
- **Lists:** Clean, borderless list items separated by 8px of vertical space or a thin horizontal rule.
- **Checkboxes & Radios:** Utilize the primary blue for active states, maintaining the 8px roundedness for checkboxes.