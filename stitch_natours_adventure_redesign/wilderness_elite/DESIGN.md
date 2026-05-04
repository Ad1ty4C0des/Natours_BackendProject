---
name: Wilderness Elite
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#3e4a3f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#6e7a6e'
  outline-variant: '#bdcabc'
  surface-tint: '#006d37'
  primary: '#006d37'
  on-primary: '#ffffff'
  primary-container: '#55c57a'
  on-primary-container: '#004e25'
  inverse-primary: '#6ddd8f'
  secondary: '#a8390d'
  on-secondary: '#ffffff'
  secondary-container: '#fc7647'
  on-secondary-container: '#651b00'
  tertiary: '#5f5e5e'
  on-tertiary: '#ffffff'
  tertiary-container: '#b1afaf'
  on-tertiary-container: '#434343'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#89faa9'
  primary-fixed-dim: '#6ddd8f'
  on-primary-fixed: '#00210c'
  on-primary-fixed-variant: '#005228'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#832600'
  tertiary-fixed: '#e4e2e2'
  tertiary-fixed-dim: '#c8c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#474747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-xl:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Noto Serif
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin: 32px
  section-padding: 80px
---

## Brand & Style

The design system is engineered for the high-end adventure seeker, blending the rugged spirit of exploration with the meticulous organization of a premium concierge service. It evokes a sense of "technical luxury"—where the adrenaline of the outdoors meets the reliability of professional gear.

The visual style is a fusion of **Minimalism** and **Glassmorphism**. By using expansive white space and high-quality photography, the interface stays out of the user's way, allowing the destination to remain the hero. Translucent overlays and blurred backgrounds are used strategically to mimic the layering found in modern outdoor apparel and navigation equipment, creating a UI that feels light, breathable, and contemporary.

## Colors

The palette is rooted in the natural world. The primary forest green (#55C57A) serves as the core brand identifier, representing growth and the outdoors. To inject energy and drive conversion, a "Sunrise Orange" (#FF7849) is introduced as the secondary action color—this high-visibility hue is reserved for primary CTAs and critical wayfinding.

The neutral tones utilize the charcoal (#444444) for deep grounding and high-contrast typography, while the off-white (#F7F7F7) provides a soft, non-distracting canvas that reduces eye strain. High-quality photography should be color-graded to lean into these earth tones, ensuring a cohesive visual experience across all touchpoints.

## Typography

This design system employs a sophisticated typographic pairing to balance heritage and modernity. **Noto Serif** is used for headlines to convey the "premium" and "literary" aspect of travel storytelling; its elegant proportions provide an authoritative yet inviting feel.

For body text and functional UI elements, **Plus Jakarta Sans** is utilized. Its modern, slightly wide apertures ensure exceptional legibility at small sizes and contribute to the energetic, approachable vibe of the brand. Upper-case labels with increased letter spacing should be used for category tags and small headers to maintain an organized, systematic hierarchy.

## Layout & Spacing

The layout follows a **Fixed Grid** model to ensure a sense of curated organization. On desktop, content is contained within a 1280px max-width container, centered on the screen. This structure provides a reliable framework for mixing dense information (like tour specs) with large-scale imagery.

The spacing rhythm is built on an 8px base unit. Wide section padding (80px or more) is encouraged to create a sense of "breathable luxury," preventing the interface from feeling cluttered or overwhelming. Gutters are kept generous (24px) to ensure that even when the grid is full, the elements remain distinct and easy to scan.

## Elevation & Depth

Depth in this design system is achieved through **Ambient Shadows** and **Glassmorphism**. Rather than heavy, dark shadows, we use extremely diffused, low-opacity shadows with a slight tint of the charcoal color (#444444) to simulate natural lighting.

Surfaces are categorized by their "altitude":
1.  **Base Layer:** The light neutral (#F7F7F7) background.
2.  **Card Layer:** White (#FFFFFF) surfaces with a subtle 4px blur shadow.
3.  **Overlay Layer:** Semi-transparent glassmorphic panels (White at 80% opacity with a 12px backdrop blur) used for navigation bars and image captions. This ensures text remains readable while keeping the user connected to the nature photography underneath.

## Shapes

The shape language is defined as **Rounded**, striking a balance between the precision of professional gear and the organic forms found in nature. A base radius of 8px (0.5rem) is applied to standard buttons and input fields. Larger containers, such as tour cards and modal windows, utilize the `rounded-lg` (1rem) or `rounded-xl` (1.5rem) values to create a softer, more premium aesthetic. 

Circle shapes are reserved exclusively for icon buttons and user avatars to maintain a clear visual distinction between interactive actions and informational containers.

## Components

### Buttons
Primary buttons use the Sunrise Orange (#FF7849) with white text, featuring a subtle lift on hover. Secondary buttons should use the Forest Green (#55C57A) with an outline style for less emphasis. Ghost buttons (text-only) are used for tertiary actions.

### Cards
Tour cards are the centerpiece of the system. They should feature full-bleed photography at the top, a Noto Serif headline, and a Glassmorphic footer containing the price and duration. The transition from the image to the content should be crisp, utilizing white backgrounds for the text area.

### Input Fields
Inputs are minimal: a simple charcoal border (low opacity) that turns forest green on focus. Labels use the `label-lg` style (uppercase) for a technical, organized feel.

### Chips & Tags
Chips are used for tour difficulty levels (e.g., "Easy", "Hard"). They should use light tints of the primary green with dark green text to maintain legibility without competing with primary buttons.

### Imagery
All images should feature high-resolution, wide-angle nature photography. A subtle darkening gradient should be applied to the bottom of images if white text is overlaid to ensure WCAG compliance while maintaining the "glassy" aesthetic.