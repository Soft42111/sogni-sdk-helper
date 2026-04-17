# 🚀 Deployment Guide: Hosting the Sogni Encyclopedia

Converting this 50+ volume Markdown library into a professional documentation site is a critical step for accessibility. Below are the three recommended architectures for hosting these docs, ranked by ease of use and visual quality.

---

## 🏗️ Option 1: Docusaurus 3 (Highly Recommended)
Docusaurus is built by Meta and is the industry standard for React-based documentation. 

### Why choose Docusaurus?
- **Full-Text Search**: Seamless integration with Algolia or local search plugins.
- **Versioning**: Maintain different docs for different SDK versions.
- **Sidebars**: Automatically generates the hierarchical navigation for the 50+ volumes.

### Quick Start
```bash
npx create-docusaurus@latest my-website classic
```
1.  Copy all `.md` files from this `/docs` folder to the `docs/` folder in your Docusaurus project.
2.  Edit `sidebars.js` to group the volumes into the "Divisions" outlined in the Master Index.
3.  Deploy to **Vercel** or **Netlify** with one click.

---

## ⚡ Option 2: Mintlify (Modern & High-Aesthetic)
Mintlify is the rising star in documentation, used by high-end AI startups. It provides a "Premium" look out of the box with zero configuration.

### Why choose Mintlify?
- **Extreme Aesthetics**: Sleek dark modes, beautiful typography, and cinematic transitions (The "Taste Skill" look).
- **Auto-Sidebar**: It builds the navigation based on your file names.
- **Interactive API Docs**: Perfect for including the Sogni SDK's dynamic elements.

### Quick Start
1.  Install the Mintlify CLI: `npm i -g mintlify`.
2.  Run `mintlify dev` in this directory.
3.  Configure your `mint.json` to organize the 50 volumes into the 10 Divisions.

---

## 🌟 Option 3: Starlight (Astro Framework)
If you want the absolute fastest page loads and a focused "documentation-first" experience, Starlight is the best choice.

### Why choose Starlight?
- **Built-in Search**: Ships with a powerful local search engine.
- **Components**: High-quality UI components (Tabs, Cards, Steps) for technical guides.
- **Astro Power**: Zero-JS by default for incredible performance.

### Quick Start
```bash
npm create astro@latest -- --template starlight
```

---

## 📏 Best Practices for All Platforms

### 1. The Global Search (Critical)
With 50+ documents, users will not browse manually. Ensure you enable a search provider (like Algolia) so developers can find specific parameters like `teacacheThreshold` instantly.

### 2. Relative Linking
I have formatted all links in this encyclopedia as relative or local links. Most documentation engines (especially Docusaurus and Mintlify) will automatically resolve these into working website links.

### 3. Syntax Highlighting
Ensure your site configures the `javascript` and `typescript` highlighters correctly, as this encyclopedia relies heavily on code examples.

### 4. Direct Focus Verification
Before making your site public, run a final recursive search for external brand mentions to ensure the documentation remains 100% focused on the native Sogni ecosystem.

---

**Next Step**: [Vol. 01: The Sogni Manifesto](./VOL_01_MANIFESTO.md)
