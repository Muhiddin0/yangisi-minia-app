---
name: Yangisi Marketplace
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf8'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e1ed'
  on-surface: '#191b23'
  on-surface-variant: '#434655'
  inverse-surface: '#2e3039'
  inverse-on-surface: '#f0f0fb'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#575d77'
  on-secondary: '#ffffff'
  secondary-container: '#dbe1ff'
  on-secondary-container: '#5d637d'
  tertiary: '#006231'
  on-tertiary: '#ffffff'
  tertiary-container: '#007e41'
  on-tertiary-container: '#c1ffcd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#bfc5e2'
  on-secondary-fixed: '#141b30'
  on-secondary-fixed-variant: '#3f465e'
  tertiary-fixed: '#91f8ad'
  tertiary-fixed-dim: '#75db93'
  on-tertiary-fixed: '#00210c'
  on-tertiary-fixed-variant: '#005228'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e1ed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 57px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.25px
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  headline-md:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0.15px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.1px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.5px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1280px
---

## Brand & Style
The design system for this marketplace focuses on high-trust, accessibility, and a premium "out-of-the-box" feel. It targets a broad demographic in Uzbekistan looking for authentic smartphones and electronics. 

The aesthetic is **Corporate Modern** with a focus on **Minimalism**. It leverages the structured logic of Material 3 but softens it with a specific focus on whitespace and a lavender-tinted neutral palette. The UI should feel airy, professional, and remarkably easy to navigate, reducing the cognitive load of technical specifications through clear visual grouping and generous breathing room.

## Colors
The palette is anchored by a trustworthy Blue primary, reflecting professional reliability. The background uses a subtle lavender-white (#faf8ff) to reduce screen glare and distinguish the white surfaces of cards and containers. 

- **Primary**: Used for key actions, brand moments, and active states.
- **Primary Container**: Used for low-emphasis selection states and background accents for icons.
- **Surface**: Pure white (#ffffff) is reserved for cards and elevated components to create a clear "layer" above the tinted background.
- **Text**: A high-contrast charcoal (#191b23) for titles ensures readability, while a softer slate (#434655) handles secondary information and metadata.

## Typography
The system uses **Inter** exclusively to maintain a systematic, utilitarian, and clean look. 

- **Headlines**: Use SemiBold or Bold weights to create a strong visual anchor for product names and section titles.
- **Body**: Standard weight with generous line height (1.5x) to ensure technical specifications remain legible.
- **Uzbek Language Support**: Ensure the font-face supports all necessary characters. Keep tracking (letter-spacing) tight for titles and slightly open for body text to improve scanning.

## Layout & Spacing
This design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

- **Rhythm**: All spacing is based on a 4px baseline grid. Most components should use `16px` (md) or `24px` (lg) for internal padding to maintain the "airy" brand promise.
- **Margins**: Mobile layouts require a `16px` side margin. Desktop layouts should be centered with a max-width of `1280px` to prevent content from stretching too wide on ultra-wide monitors.
- **Gap Strategy**: Use `16px` gutters between product cards in a grid to ensure distinct separation without losing density.

## Elevation & Depth
In line with the friendly and modern style, this design system avoids heavy shadows. Instead, it uses **Ambient Shadows** and **Tonal Layers**.

- **Level 0 (Background)**: The lavender-tinted background (#faf8ff).
- **Level 1 (Default Card)**: White surface with a subtle 1px outline (#c3c6d7) or a very soft shadow (Blur: 4px, Y: 2, Opacity: 4% Black).
- **Level 2 (Active/Hover)**: Increased shadow depth (Blur: 12px, Y: 4, Opacity: 8% Primary Color) to provide tactile feedback.
- **Level 3 (Modals/Popups)**: High diffusion shadow to pull the element significantly forward from the background.

## Shapes
The shape language is consistently **Rounded**, reinforcing the friendly and approachable personality of the marketplace.

- **Buttons**: Use a fixed `12px` corner radius. This is slightly softer than standard Material 3 but avoids the "toy-like" feel of a full pill shape.
- **Cards & Containers**: Use `16px` (`rounded-lg`) for product cards and main layout containers.
- **Small Elements**: Chips, badges, and input fields use `8px` (`rounded-md`) to maintain a cohesive look at a smaller scale.

## Components

- **Buttons**:
  - *Primary*: Solid #2563eb background with White text. `12px` radius.
  - *Secondary*: #dbe1ff background with Primary Blue text. No border.
  - *Outlined*: No background, #c3c6d7 border, Primary Blue text.
- **Input Fields**:
  - Use "Filled" or "Outlined" styles from Material 3.
  - Default state: #c3c6d7 border. Active state: #2563eb 2px border.
  - Background: #ffffff or a very light tint of the background color.
- **Cards**:
  - Product cards must have `16px` padding and `16px` corner radius.
  - On hover, the card should transition to a Level 2 elevation with a subtle blue-tinted shadow.
- **Chips & Badges**:
  - Used for "New", "Used", or "Discount" tags.
  - "New" (Yangi) should use the Success Green (#1b8a4b) with a light green background.
- **Lists**:
  - Item separators should use a 1px #c3c6d7 line with `16px` horizontal padding.
- **Navigation**:
  - A bottom navigation bar for mobile with active states indicated by a Primary Container colored pill behind the icon.