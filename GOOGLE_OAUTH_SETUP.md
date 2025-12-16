# Google OAuth Setup for Supabase

## Steps to Enable Google Authentication

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure the OAuth consent screen (if not done already):
   - User Type: External (unless you have a Google Workspace)
   - App name: TrippyDrip
   - User support email: your email
   - Developer contact: your email
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: TrippyDrip Web
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for local development)
     - `https://www.trippydrip.co.in` (for production)
   - Authorized redirect URIs:
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback`
     - Get this from Supabase Dashboard > Authentication > URL Configuration

### 2. Configure Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** > **Providers**
3. Find **Google** and click to enable it
4. Enter your Google OAuth credentials:
   - **Client ID (for OAuth)**: From Google Cloud Console
   - **Client Secret (for OAuth)**: From Google Cloud Console
5. Click **Save**

### 3. Update Redirect URLs

In Supabase Dashboard > Authentication > URL Configuration:
- Add your site URLs:
  - Site URL: `https://www.trippydrip.co.in`
  - Redirect URLs:
    - `http://localhost:3000/**`
    - `https://www.trippydrip.co.in/**`

### 4. Test

1. Go to your login page
2. Click "Sign in with Google"
3. You should be redirected to Google for authentication
4. After approval, you'll be redirected back to your site

## Notes

- Google OAuth works automatically once configured in Supabase
- Users can sign up or login with Google
- User profiles are automatically created in Supabase
- The email from Google account is used as the user identifier

