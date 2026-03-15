

## Plan: Make the Lovable build match the original RybiaPakaFinal more closely

### What needs to change

The current rebuild is close in structure but diverges from the original in several ways. Here is the plan to bring it in line:

---

### 1. Use the actual logo image from the repo

The original uses `logo.png` (white text on transparent background). We will:
- Download the logo from `https://raw.githubusercontent.com/HMQE333/RybiaPakaFinal/main/public/logo.png` and save it to `public/logo.png`
- Replace the `<Fish>` icon + text logo in both **Navbar** and **Footer** with an `<img src="/logo.png" />` element (height ~28px in navbar, ~24px in footer)

---

### 2. Add missing home page sections

The original home page has these sections that we are missing:
- **QuickAccess** -- Quick-link cards to Forum, Discussions, Gallery (below Statistics)
- **MediaScrolls** -- Auto-scrolling marquee of fishing images/videos
- **Sponsors** -- Partner/sponsor logos section
- **NavigationTutorial** -- Visual guide showing how to use the platform
- **Tutorials** -- Tutorial cards section

We will add placeholder versions of:
- **QuickAccess** section with 3-4 icon cards linking to main platform areas
- **Sponsors** section with placeholder sponsor slots

The MediaScrolls, NavigationTutorial, Tutorials, and WelcomeModal are complex and depend on actual content/images -- these can be added in a follow-up.

---

### 3. Refine existing sections to match original styling

- **Hero**: Already close. Minor tweaks to match original gradient colors and spacing.
- **Statistics**: Add the `interactive-press` hover class from the original CSS.
- **WhyUs**: Already matches. No changes needed.
- **Reviews**: The original uses a `Review` sub-component with marquee auto-scroll. We will add the marquee scrolling behavior to match.
- **BottomCTA**: Already matches. No changes needed.

---

### 4. Add missing CSS from the original

Port these from the original `globals.css` that are not yet present:
- `interactive-press` class (transform on hover/active)
- `modal-pop` / `modal-rise` animation
- `filter-pill` box-shadow
- `contact-glow` classes (for future contact page)
- `animate-partner-pop` animation
- `page-transition` animation

---

### 5. Files to create/modify

| File | Action |
|------|--------|
| `public/logo.png` | Add (copy from repo) |
| `src/components/Navbar.tsx` | Replace Fish icon with logo image |
| `src/components/Footer.tsx` | Replace Fish icon with logo image |
| `src/components/home/QuickAccess.tsx` | Create new section |
| `src/components/home/Sponsors.tsx` | Create new section |
| `src/pages/Index.tsx` | Add QuickAccess and Sponsors sections |
| `src/index.css` | Add missing CSS animations/classes |

