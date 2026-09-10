# Haseeb Ahmad — Portfolio v2.9


## v2.9 final consolidation
- Removed the separate **Expertise** section to reduce duplication and overall page length.
- Renamed the navigation item to **Skills** and kept section numbering continuous (`02 Skills & Microsoft Stack`, then `03 Experience`).
- Merged the Expertise content into the animated skills marquee.
- Added explicit skill coverage for Customer Service, Web API / OData, XRM Toolbox, Ribbon / Command Bar, Custom Connectors, Business Rules / BPF, security/RBAC and the existing Microsoft/CRM stack.
- Preserved all existing portfolio functionality and Netlify files.

A polished Dynamics 365 CRM & Power Platform portfolio with improved readability, straightened hero visual, CV-backed projects, certifications and a Power Platform Community blog carousel.

## v2.2 fixes
- Increased contrast, font size and weight for muted/body text throughout the site.
- Improved the small brand subtitle under **Haseeb Ahmad**.
- Reduced oversized spacing so headings and supporting copy appear sooner at 100% browser zoom.
- Removed the 3D tilt from the CRM dashboard visual and repositioned the floating labels so the panel looks straight and cleaner.
- Increased readability of project descriptions, bullet points, technology tags and certification text.
- Replaced the single featured article with an 8-post carousel based on Haseeb's public Power Platform Community profile.
- Added **Previous / Next** controls, responsive 3/2/1-card layouts and pagination indicators.
- Added a Netlify Function (`netlify/functions/blogs.js`) that reads the public Community profile and discovers public blog post links. When a new public post appears on that profile, the deployed portfolio can add it automatically without editing `index.html`.
- Kept all 8 currently verified posts in the HTML as a fallback, so the blog section still works if the Community site is temporarily unavailable.
- Added the verified LinkedIn profile link from the public Community profile.
- Changed JS/CSS cache headers to revalidate on deploy, reducing the chance of an old design remaining in the browser cache.

## Blog source
Public Power Platform Community profile used for sync:

`https://community.powerplatform.com/profile/?userid=f5181eed-0df4-ef11-be20-7c1e5282477e`

The personal `/Myactivity/` page depends on a signed-in session, so the portfolio sync uses the public profile instead. The public profile exposes the same published blog list without requiring your visitors to sign in.

## Contact links
Open `script.js` and update any missing public links:

```js
const PROFILE = {
  email: "",
  linkedin: "https://www.linkedin.com/in/haseeb-ahmad-baa981278",
  github: ""
};
```

Empty values stay hidden automatically.

## Deploy with GitHub + Netlify
1. Replace the existing repository files with this package.
2. Commit and push to the branch Netlify watches (normally `main`).
3. Netlify redeploys the static site and the `blogs` serverless function automatically.
4. After deploy, open the site and hard-refresh once (`Ctrl + F5`) if an old tab was already open.

No npm install or framework build is required.

## Public portfolio note
Project names and descriptions come from the supplied CV. Confirm that client/project names are permitted under employer/client confidentiality rules before publishing publicly.
