# Haseeb Ahmad — Portfolio v2

A polished static portfolio for Dynamics 365 CRM & Power Platform consulting work.

## What changed
- Rebuilt hero with a modern Microsoft-business-apps visual rather than a generic card.
- Replaced placeholder project copy with CV-backed case-study highlights: DHA, LAMEX, Assist Matrix and Net Matrix.
- Added a dedicated certification section, including MB-230.
- Added real technical skills from the CV: Power Apps, Power Automate, Dataverse, C# plugins, JavaScript, Web API/OData, SharePoint and security/RBAC.
- Added the supplied résumé as a direct download.
- Improved mobile navigation, scroll reveal, active nav state, accessibility, SEO metadata and responsive layout.
- Contact buttons are configuration-driven and hidden until valid links are added, so no placeholder email appears publicly.

## Add your contact links
Open `script.js` and update:

```js
const PROFILE = {
  email: "your@email.com",
  linkedin: "https://www.linkedin.com/in/your-profile/",
  github: "https://github.com/your-username"
};
```

Any empty value is automatically hidden.

## Deploy with GitHub + Netlify
If your Netlify site is already connected to your GitHub repository:
1. Replace the existing site files with the files in this package.
2. Commit and push to the branch Netlify watches (usually `main`).
3. Netlify will redeploy automatically.

No build command is required because this is plain HTML/CSS/JavaScript.

## Public portfolio note
The project names and descriptions come from the supplied CV. Before publishing, make sure client/project names are permitted under your employer/client confidentiality rules. If needed, rename them to industry-based labels while keeping the technical outcomes.
