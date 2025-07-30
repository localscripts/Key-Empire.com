# Key-Empire Navbar - GitHub Pages Deployment

This project is configured for deployment to GitHub Pages using Next.js static export.

## 🚀 Deployment Instructions

### 1. Repository Setup
1. Push your code to a GitHub repository
2. Go to your repository settings
3. Navigate to "Pages" section
4. Set source to "GitHub Actions"

### 2. Automatic Deployment
The project includes a GitHub Actions workflow that will:
- Build the Next.js application
- Export it as a static site
- Deploy to GitHub Pages automatically on push to main branch

### 3. Custom Domain (Optional)
If you want to use a custom domain:
1. Add a `CNAME` file to the `public` folder with your domain
2. Configure your domain's DNS to point to GitHub Pages

### 4. Repository-Specific Configuration
If your repository is not at the root domain (e.g., `username.github.io/repo-name`):

1. Uncomment and modify these lines in `next.config.js`:
\`\`\`javascript
basePath: '/your-repo-name',
assetPrefix: '/your-repo-name/',
\`\`\`

2. Replace `your-repo-name` with your actual repository name

## 🛠️ Local Development

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static files (for GitHub Pages)
npm run export
\`\`\`

## 📁 Project Structure

\`\`\`
├── .github/workflows/deploy.yml  # GitHub Actions deployment
├── next.config.js               # Next.js configuration for GitHub Pages
├── package.json                 # Dependencies and scripts
├── public/                      # Static assets
├── components/                  # React components
├── app/                        # Next.js app directory
└── README.md                   # This file
\`\`\`

## 🔧 Configuration Details

### Next.js Configuration
- `output: 'export'` - Enables static site generation
- `trailingSlash: true` - GitHub Pages compatibility
- `images: { unoptimized: true }` - Disables Next.js image optimization
- `distDir: 'out'` - Output directory for static files

### GitHub Actions Workflow
- Triggers on push to main branch
- Builds and exports the Next.js app
- Adds `.nojekyll` file to prevent Jekyll processing
- Deploys to GitHub Pages using `peaceiris/actions-gh-pages`

## 🌐 Live Demo

Once deployed, your site will be available at:
- `https://username.github.io/` (if repository is named `username.github.io`)
- `https://username.github.io/repository-name/` (for other repositories)

## 📝 Notes

- The site is completely static after export
- Server-side features (API routes, server actions) won't work
- All images are unoptimized for GitHub Pages compatibility
- The deployment process takes 2-5 minutes after pushing to main
