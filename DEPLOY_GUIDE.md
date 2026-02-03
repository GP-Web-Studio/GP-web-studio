# Netlify Deployment Guide

## 📋 Prerequisites

- GitHub Account
- Netlify Account (free at [netlify.com](https://www.netlify.com/))
- Your project uploaded to GitHub

## 🚀 Steps to Deploy

### 1. Upload your Project to GitHub

```bash
# Initialize git if you haven't already
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: GP Web Studio website"

# Connect with your GitHub repository
git remote add origin https://github.com/YOUR-USERNAME/GP-web-studio.git

# Push the files
git push -u origin main
```

### 2. Connect with Netlify

1. Go to [app.netlify.com](https://app.netlify.com/)
2. Click on **"Add new site"** → **"Import an existing project"**
3. Select **GitHub**
4. Authorize Netlify to access your repositories
5. Select the **GP-web-studio** repository

### 3. Configure the Deploy

In the configuration screen:

- **Branch to deploy**: `main`
- **Build command**: (leave empty)
- **Publish directory**: `.` or leave empty
- Click on **"Deploy site"**

### 4. Domain Configuration

Once deployed:

- Netlify will give you a URL like: `https://random-name-123.netlify.app`
- You can change the name in: **Site settings** → **Change site name**
- Suggestion: `gpwebstudio.netlify.app`

### 5. Configure Custom Domain (Optional)

If you have your own domain:

1. Go to **Domain settings** → **Add custom domain**
2. Enter your domain (e.g., `gpwebstudio.com`)
3. Follow the instructions to configure the DNS
4. Netlify will provide free SSL automatically

## 📧 Configure Forms

### Option 1: Netlify Forms (Recommended)

1. In your `index.html`, modify the form:
   ```html
   <form
     name="contact"
     method="POST"
     netlify
     netlify-honeypot="bot-field"
   ></form>
   ```
2. Add a hidden field:
   ```html
   <input type="hidden" name="form-name" value="contact" />
   ```
3. Messages will arrive at your email associated with Netlify

### Option 2: Formspree

Follow the instructions in `FORMSPREE_SETUP.md`

## 🔄 Automatic Updates

Every time you push to GitHub, Netlify will automatically deploy:

```bash
git add .
git commit -m "Content update"
git push
```

## ✅ Post-Deploy Verification

- [ ] The site loads correctly
- [ ] All sections are visible
- [ ] Navigation links work
- [ ] The form sends messages
- [ ] The site is responsive on mobile
- [ ] Images load well

## 🐛 Troubleshooting

### The site does not deploy

- Verify that there are no errors in the files
- Check the logs in the Netlify Dashboard

### Styles are not valid

- Verify that CSS paths are correct
- Paths must be relative: `css/styles.css`

### The form does not work

- Verify the Formspree configuration
- Or use Netlify Forms as an alternative

## 📊 Monitoring

In Netlify Dashboard you can see:

- Number of visitors
- Form submissions
- Site performance
- Deploy logs

Your site will be online in minutes! 🎉
