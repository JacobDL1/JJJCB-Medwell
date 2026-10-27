# P3 Medwell Design Changes

This document describes the design updates developed for the P3 Medwell website.
## Overall design

- Introduced a navy, teal, mint, and light neutral color palette using CSS variables.
- Updated the P3/Medwell header with a rounded brand mark, tagline, and community message.
- Refreshed fonts, spacing, rounded corners, borders, and shadows for a consistent appearance.
- Added responsive desktop and mobile layouts, including a stacked login layout on smaller screens.
- Added hover effects, subtle entrance and floating animations, keyboard focus indicators, and reduced-motion support.
- Added explanatory comments to the stylesheet.

## Login and signup

- Created a split layout with a welcome panel, introductory text, CSS artwork, and form area.
- Updated form fields and buttons with consistent spacing, rounded borders, and focus and hover styles.
- Added a Show/Hide password button, a Caps Lock warning, and signup password guidance. The guidance is not a guarantee of security.
- Added accessible announcements for form feedback.
- Retained the existing Supabase authentication scripts. Live authentication still needs to be tested with the project's Supabase configuration.

## Dashboards and navigation

- Redesigned role dashboards with a welcome heading, rounded navigation tabs, and content cards.
- Styled selected and hovered tabs and added keyboard navigation using arrow keys, Home, and End.
- Added descriptive empty states for sections that do not yet display content.
- Added smaller participant dashboard tabs:

| Category | Smaller tabs |
| --- | --- |
| Events | Upcoming, Completed |
| Prevention | Resources, Completed |
| Shadowing | Opportunities, Applications |
| Points | My Points, Rewards |

These sections contain placeholder text. Real events, resources, applications, points, and rewards need to be connected to the database. Smaller tabs were supplied for the participant page; other roles retain their existing main tabs.

## Light and dark mode

- Added a toggle to the participant dashboard header while keeping the existing community message.
- The button toggles the `dark-mode` class and saves the selection in browser `localStorage`.
- Added dark colors for the participant dashboard header, cards, tabs, and empty states.
- The theme script may apply the saved choice to other pages that load `design.js`; those pages need complete dark-mode styling and a toggle before the feature is considered site-wide.

## Main files involved

| File | Purpose |
| --- | --- |
| `index.html` | Main login page and authentication script |
| `pages/login.html` | Additional login page |
| `pages/signup.html` | Account signup page |
| `pages/user_landingpage.html` | Participant dashboard and category and subcategory markup |
| Other `pages/*_landingpage.html` files | Admin, mentor, nonprofit, and sponsor dashboards |
| `css/P3_styling.css` | Shared colors, layouts, forms, tabs, responsive rules, and theme styles |
| `js/design.js` | Password controls, tab accessibility, empty states, smaller tabs, and theme behavior |
| `js/supabaseClient.js` | Existing Supabase client configuration |

## Testing and outstanding work

- Check login, signup, account roles, and redirects with the real Supabase project. These flows were not verified end to end during the initial redesign.
- Confirm whether the nonprofit role is `nonprofit` or `non-profit` and use it consistently across login and role checks.
- Enforce data access with Supabase policies; client-side role redirects alone are not authorization.
- Connect dashboard sections to real data and replace or hide placeholders when content is available.
- Test dark mode on every page, as well as mobile layout, keyboard navigation, and reduced-motion settings.
- A login-button loading state was discussed separately; it is only present if added to the login handler.
