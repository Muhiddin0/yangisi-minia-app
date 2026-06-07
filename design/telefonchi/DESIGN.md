---
name: Telefonchi
colors:
  surface: '#faf8ff'
  surface-dim: '#d9d9e5'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3fe'
  surface-container: '#ededf9'
  surface-container-high: '#e7e7f3'
  surface-container-highest: '#e1e2ed'
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
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#faf8ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ed'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

The brand personality for the design system is centered on reliability, efficiency, and approachability. As a marketplace for mobile technology, it balances the precision of high-end electronics with a welcoming, user-centric interface.

The design style is **Modern Minimalism**. It prioritizes clarity over decoration, utilizing heavy whitespace to reduce cognitive load and allow product photography to serve as the primary visual driver. The aesthetic is "light-weight," characterized by a sense of airiness and a strict "no-clutter" policy. Interaction patterns are intuitive and direct, ensuring that the act of buying or selling a phone feels frictionless and professional.

## Colors

The color palette for the design system is restrained and functional, designed to establish a clear visual hierarchy and trust.

- **Primary:** A deep, vibrant blue (#2563EB) is used for call-to-actions, active navigation states, and highlighting key interactive elements. It provides a confident, tech-forward anchor.
- **Surface & Backgrounds:** Pure white (#FFFFFF) is the primary surface color for cards and containers to ensure maximum contrast. A soft light gray (#F5F6F8) is utilized for the underlying canvas to distinguish between the background and elevated content areas.
- **Typography:** Near-black (#111827) is used for high-emphasis text and headlines, while a medium gray (#6B7280) is reserved for secondary information, metadata, and placeholder text.

## Typography

The design system utilizes **Inter** for all typographic roles. Its neutral, systematic nature ensures high legibility on mobile displays and provides a professional, utilitarian aesthetic.

Type scales are defined to create a strong vertical rhythm. Headlines use a slightly tighter letter-spacing and heavier weights to command attention, while body copy maintains a generous line height for comfortable reading of product specifications. Use `headline-xl-mobile` for top-level headers on small screens to ensure content remains above the fold.

## Layout & Spacing

The design system employs a **Fluid Grid** approach based on a 4px baseline unit. 

- **Mobile Layout:** A 2-column grid is the standard for product browsing, providing a balanced density of information. Margins are set to 16px with 16px gutters between cards.
- **Spacing Logic:** Vertical spacing between unrelated sections (stacks) should be generous (24px or 32px) to maintain the "spacious" brand promise.
- **Safe Areas:** Ensure all primary actions, such as "Add Listing" or "Contact Seller," respect the device's safe area insets, particularly for the sticky bottom navigation.

## Elevation & Depth

To maintain a modern and clean appearance, the design system avoids heavy shadows and skeuomorphism. Instead, it uses **Ambient Shadows** and **Tonal Layers** to communicate depth.

Cards and input fields sit on the white surface with a subtle, highly-diffused shadow (e.g., 0px 4px 12px rgba(0, 0, 0, 0.05)). This lift helps separate interactive elements from the light gray background. Higher elevation is reserved for sticky elements like the bottom navigation bar and primary action buttons, which utilize a slightly more pronounced blur to indicate they float above the main content scroll.

## Shapes

The shape language is consistently soft and friendly. 

The design system uses a base radius of **12px** for standard UI elements like input fields and small cards. Larger containers, such as product detail cards and modals, utilize a **16px** (rounded-lg) radius. Fully rounded "pill" shapes are exclusively reserved for category chips and tags to distinguish them from actionable buttons. No sharp corners should be present in the UI, reinforcing the approachable brand personality.

## Components

- **Bottom Navigation:** A persistent bar featuring five icons: Home, Search, Add (+), Saved, and Profile. The "Add" button is visually emphasized—centered and potentially utilizing a circular container—to encourage user listings.
- **Product Cards:** Arranged in a 2-column grid. They should feature a large image area with a 12px corner radius, followed by the price in `headline-md` and the title in `body-md`.
- **Horizontal Chips:** Used for category filtering (e.g., "iPhone", "Samsung", "New"). These are pill-shaped, with a light gray background when inactive and the primary blue background when selected.
- **Inputs:** Text fields feature a 12px corner radius and a 1px soft border. On focus, the border transitions to the primary blue.
- **Sticky Actions:** Critical buttons (like "Call Seller") are pinned to the bottom of the viewport with a subtle backdrop blur or white container, ensuring they are always within thumb-reach.
- **Checkboxes & Radios:** Use the primary blue for the selected state, maintaining a minimum 24x24px tap target.