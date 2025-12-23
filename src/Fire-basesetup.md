# Firebase Setup Guide for Softbank

This guide will help you and your co-developers set up Firebase authentication for the Softbank banking app.

## Step 1: Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create a new one if you haven't)
3. Click the **gear icon** ⚙️ next to "Project Overview"
4. Select **Project settings**
5. Scroll down to **"Your apps"** section
6. If you don't have a web app yet:
   - Click **"Add app"** → Select **Web** (</> icon)
   - Register your app with a nickname like "Softbank"
7. You'll see a `firebaseConfig` object with values like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB1234567890abcdefg",
  authDomain: "softbank-12345.firebaseapp.com",
  projectId: "softbank-12345",
  storageBucket: "softbank-12345.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

## Step 2: Enable Authentication Methods

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click **"Get started"** if you haven't set it up
3. Go to **"Sign-in method"** tab
4. Enable **Email/Password**:
   - Click on "Email/Password"
   - Toggle **Enable** to ON
   - Click **Save**
5. (Optional) Enable **Google Sign-In**:
   - Click on "Google"
   - Toggle **Enable** to ON
   - Select your support email
   - Click **Save**

## Step 3: Set Up Environment Variables

### For the Project Owner (You):

1. In your project root folder (where package.json is), create a file named `.env`
2. Copy the contents from `.env.example`
3. Replace the placeholder values with YOUR actual Firebase credentials:

```env
VITE_FIREBASE_API_KEY=AIzaSyB1234567890abcdefg
VITE_FIREBASE_AUTH_DOMAIN=softbank-12345.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=softbank-12345
VITE_FIREBASE_STORAGE_BUCKET=softbank-12345.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

4. Save the file and restart your dev server (`npm run dev`)

### For Co-Developers:

1. Ask the project owner to share the Firebase credentials with you
2. Create a `.env` file in your project root
3. Paste the credentials you received
4. Save the file and run `npm run dev`

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed to GitHub (this is for security).

## Step 4: Share Credentials with Your Team

Choose one of these methods:

### Option 1: Direct Message
Send your `.env` file contents to co-devs via WhatsApp, Discord, Slack, or Email.

### Option 2: Shared Document
Create a Google Doc or Notion page with the credentials and share the link.

### Option 3: Team Password Manager
Use services like 1Password, LastPass, or Bitwarden to securely share credentials.

## Step 5: Test Authentication

1. Run the app: `npm run dev`
2. Go to the signup page
3. Try to register a new user with email and password
4. Try to log in with that user
5. Check Firebase Console → Authentication → Users to see if the user appears

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"
**Solution:** You forgot to create the `.env` file or it has wrong values.

### "Firebase: Error (auth/operation-not-allowed)"
**Solution:** Email/Password authentication is not enabled in Firebase Console. Go to Authentication → Sign-in method → Enable Email/Password.

### Co-devs can't sign up or login
**Solution:** 
- Make sure they have the correct `.env` file with your Firebase credentials
- Check that Email/Password is enabled in Firebase Console
- Verify there are no typos in the `.env` file

### "Firebase: Error (auth/invalid-api-key)"
**Solution:** The API key in `.env` is incorrect. Double-check the value from Firebase Console.

### Changes to .env not working
**Solution:** Restart the dev server. Vite only reads `.env` files on startup.

## Pre-configured Admin Accounts

The app has 3 hardcoded admin accounts that work without Firebase:

**Super Admin:**
- Email: `superadmin@softbank.com`
- Password: `SuperAdmin@2024`
- Login at: `/admin-login`

**Regular Admin 1:**
- Email: `admin1@softbank.com`
- Password: `Admin1@2024`
- Login at: `/admin-login`

**Regular Admin 2:**
- Email: `admin2@softbank.com`
- Password: `Admin2@2024`
- Login at: `/admin-login`

These admin accounts are stored in localStorage and can access the admin dashboard.

## Important Notes

- Never commit your `.env` file to GitHub (it's already in `.gitignore`)
- All team members must use the SAME Firebase project credentials
- Regular users sign up at `/signup` and use Firebase authentication
- Admins log in at `/admin-login` and use the hardcoded credentials above
- You can change admin passwords later in the Settings page

## Need Help?

If issues persist:
1. Check browser console (F12) for detailed error messages
2. Verify Firebase credentials are exactly as shown in Firebase Console (no extra spaces)
3. Make sure you restarted the dev server after creating `.env`
4. Check that Authentication is enabled in Firebase Console
