# Firebase Admin SDK Setup Guide

## What You Need

The backend needs **Firebase Admin SDK credentials** (service account), which are different from the client-side Firebase config you already have.

## Step-by-Step Instructions

### 1. Get Service Account Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **scanaraai**
3. Click the gear icon ⚙️ → **Project Settings**
4. Go to the **Service Accounts** tab
5. Click **Generate new private key**
6. Click **Generate key** in the confirmation dialog
7. A JSON file will download (keep it secure!)

### 2. Extract Values from JSON

The downloaded JSON file will look like this:

```json
{
  "type": "service_account",
  "project_id": "scanaraai",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...@scanaraai.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

### 3. Update Your `.env` File

Open `backend/.env` and update these values:

```env
FIREBASE_PROJECT_ID=scanaraai
FIREBASE_CLIENT_EMAIL=your-service-account-email@scanaraai.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- Copy the entire `private_key` value from the JSON (including the BEGIN/END lines)
- Keep the newlines (`\n`) - they're important!
- Wrap the private key in double quotes in the `.env` file
- The `client_email` is the `client_email` field from the JSON

### 4. Example `.env` File

```env
PORT=3000
NODE_ENV=development

# Firebase Admin SDK Configuration
FIREBASE_PROJECT_ID=scanaraai
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@scanaraai.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n...your full key here...\n-----END PRIVATE KEY-----\n"

# CORS
CLIENT_URL=http://localhost:5173
```

### 5. Restart Your Backend Server

After updating `.env`, restart your backend:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Firebase Admin initialized successfully
```

## Security Notes

⚠️ **NEVER commit your `.env` file or service account JSON to git!**

- The `.env` file should be in `.gitignore`
- Keep your service account JSON file secure
- If exposed, regenerate the service account key immediately

## Troubleshooting

### "Firestore not initialized" error
- Check that all three values are set in `.env`
- Ensure `FIREBASE_PRIVATE_KEY` includes the full key with `\n` characters
- Make sure the private key is wrapped in double quotes
- Restart the server after updating `.env`

### "Invalid private key" error
- Make sure the private key includes the BEGIN and END lines
- Check that newlines are preserved (`\n` in the string)
- Verify there are no extra spaces or quotes

