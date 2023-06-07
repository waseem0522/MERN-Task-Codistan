import dotenv from 'dotenv';
dotenv.config({});
import { google } from 'googleapis';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

// OAuth2 client configuration
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
);

const scopes = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/cloud-platform'
];

// Generate the URL for user authentication
app.get('/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

// Handle the callback after user authentication
app.get('/google/redirect', async (req, res) => {
  const code = req.query.code;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    res.send({
      msg: 'You are Logged In',
    });
  } catch (error) {
    console.error('Failed to authenticate user:', error);
    res.status(500).send('Failed to authenticate user');
  }
});

// Service account consent screen update
app.get('/schedule_event', async (req, res) => {
  const keyPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
  const projectId = process.env.PROJECT_ID;
  const testUserEmail = process.env.TEST_USER_EMAIL;

  const scopes = ['https://www.googleapis.com/auth/cloud-platform',
  'https://www.googleapis.com/auth/calendar'
];

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: scopes,
  });

  const client = await auth.getClient();

  const service = google.cloudresourcemanager('v1');

  try {
    const response = await service.projects.update({
        projectId: projectId,
        // auth: oauth2Client,
        auth: client,
        requestBody: {
          consentScreen: {
            testEmails: {
              emails: [testUserEmail],
            },
          },
        },
      });

    console.log('Test user added successfully:', response.data);
    res.send('Test user added successfully');
  } catch (error) {
    console.error('Failed to add test user:', error);
    res.status(500).send('Failed to add test user');
  }
});

// app.get("/schedule_event", async (req, res) => {
//     const keyPath = process.env.SERVICE_ACCOUNT_KEY_PATH;
//     const projectId = process.env.PROJECT_ID;
//     const testUserEmail = process.env.TEST_USER_EMAIL;
  
//     const scopes = [  'https://www.googleapis.com/auth/calendar',
//     'https://www.googleapis.com/auth/cloud-platform'];
  
//     const auth = new google.auth.GoogleAuth({
//       keyFile: keyPath,
//       scopes: scopes,
//     });
  
//     const client = await auth.getClient();
  
//     const service = google.cloudresourcemanager('v1');
  
//     try {
//       const project = await service.projects.get({
//         projectId: projectId,
//         auth: client,
        
//       });
  
//       project.data.consentScreen.testEmails = {
//         emails: [testUserEmail],
//       };
  
//       const response = await service.projects.update({
//         auth: oauth2Client,
//         projectId: projectId,
//         // auth: client,
//         requestBody: project.data,
//       });
  
//       console.log('Test user added successfully:', response.data);
//       res.send('Test user added successfully');
//     } catch (error) {
//       console.error('Failed to add test user:', error);
//       res.status(500).send('Failed to add test user');
//     }
//   });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
