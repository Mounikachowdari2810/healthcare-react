# MediCare — Healthcare Appointment System
React + Vite migration of the supplied HTML/CSS/JS project. Original CSS, homepage imagery and six doctor records retained. React components: Home, Auth, Patient, Admin, Appointment. Doctor names normalized to fix original whitespace mismatches.

## Run on Windows
Extract ZIP, open healthcare-react folder in VS Code, open Terminal and run:
```
npm install
npm run dev
```
Open the localhost URL printed in terminal. Production check: `npm run build`.

## Demo
1. Register a fictional patient (password at least 6 characters, 10-digit phone), then login.
2. Book a future appointment with Dr. Mounika.
3. Logout, open Doctor Portal, choose Dr. Mounika, use DOC001 / 12345.
4. Confirm appointment and optionally set availability. Logout and login as patient to see status, reschedule or cancel.
5. Refresh and log in again to verify persistence.

## Deployment
Create a GitHub repository for this folder, excluding node_modules and dist. Import repository into Vercel; framework Vite, build command npm run build, output directory dist. Verify deployed site using demo workflow.

## Limitations
Academic browser-only demo. LocalStorage contains demo credentials and records, not secure authentication or shared database. Do not enter real patient information. Data is separate per browser/origin; old project data is not migrated. Consultation is a labeled preview, not a real video call. Reminders are in-app appointment listings, not notifications. Homepage images require internet. Dependencies could not be installed in the preparation environment because npm registry DNS was unavailable; build and browser tests must be run locally before review.
