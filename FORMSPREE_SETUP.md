# Contact Form Configuration

## Instructions for Formspree

For the contact form to work correctly, you need to configure Formspree:

### Step 1: Create Account on Formspree

1. Go to [formspree.io](https://formspree.io/)
2. Create a free account
3. The free plan allows up to 50 submissions per month

### Step 2: Get your Form ID

1. Once inside, create a new form
2. Formspree will give you a unique ID that looks like this: `xpznabcd`
3. The full URL will be: `https://formspree.io/f/xpznabcd`

### Step 3: Update index.html

1. Open the file `index.html`
2. Find the line that says:
   ```html
   <form
     class="contact__form"
     id="contact-form"
     action="https://formspree.io/f/YOUR_FORM_ID"
     method="POST"
   ></form>
   ```
3. Replace `YOUR_FORM_ID` with your real Formspree ID

### Example:

```html
<form
  class="contact__form"
  id="contact-form"
  action="https://formspree.io/f/xpznabcd"
  method="POST"
></form>
```

### Step 4: Additional Configuration

In the Formspree panel you can configure:

- Destination email where you will receive messages
- Custom confirmation page
- Auto-response to the user
- Anti-spam protection (reCAPTCHA)

### Alternative: Direct Email

If you prefer to use your own email without Formspree:

1. You can use Netlify Forms (free with Netlify)
2. Just add `netlify` to the form tag:
   ```html
   <form name="contact" netlify></form>
   ```

## Verification

Once configured:

1. Open your website
2. Fill out the form
3. Send a test message
4. Verify that you received the email

Ready! Your form will be working.
