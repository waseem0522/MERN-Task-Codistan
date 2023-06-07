import dotenv from 'dotenv'
dotenv.config({});

import express from 'express';
import { google } from 'googleapis';
import { v4 as  uuid} from 'uuid'

const calendar = google.calendar({
  version : "v3",
  auth : process.env.API_KEY
})

// const map = google.map({
//   version : "v3",
//   auth : process.env.API_KEY
// })

const app = express();

const PORT = process.env.NODE_ENV || 8000;

const oauth2Client  = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URL
)

const scope = [
  'https://www.googleapis.com/auth/calendar'
];

app.get("/google", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scope
    });
    res.redirect(url)
});

app.get('/google/redirect', async (req, res) => {
  const code = req.query.code;
  // const { tokens } = await oauth2Client.getToken(code);
  // oauth2Client.setCredentials(tokens);
  oauth2Client.getToken(code, (err, token) => {
    if (err) {
      res.status(500).send(err);
    } 
    oauth2Client.setCredentials(token);
  })
  res.send({
    msg: "You are Logged In"
  })
})



app.get("/schedule_event", async (req, res) => {
  const event = {
     calendarId: "primary",
     auth: oauth2Client,
     conferenceDataVersion: 1,
     requestBody: {
       summary: "Technology Junction Event 2023",
       start: {
         dateTime: "2023-06-01T10:00:00-07:00",
         timeZone: "America/Los_Angeles"
       },
       end: {
         dateTime: "2023-06-03T11:00:00-07:00",
         timeZone: "America/Los_Angeles"
       },
       conferenceData: {
         createRequest: {
           requestId: uuid(),
         },
       },
       attendees: [
         {
           email: "engmuhammadwaseem0522@gmail.com"
         },
         {
           email: "farrukhrizwan387@gmail.com",
         },
         {
           email: "adilsiddiqui131@gmail.com",
         },
       ],
       description: "You all are informed about this event to attend the meeting through Google Meet. We have already sent an email to all participants.",
       location: "Technolgy Junction NESTP Rawalpindi",
       sendNotifications: true,
     },
   };

   const response = await calendar.events.insert(event);
   const meetUrl = response.data.hangoutLink; // Retrieve the Google Meet URL

   console.log(meetUrl);
   res.send({
     msg: "Event Scheduled",
     meetUrl: meetUrl // Include the Meet URL in the response
   });

})





// app.get("/schedule_event", async (req, res) => {
//    await calendar.events.insert({
//       calendarId: "primary",
//       auth: oauth2Client,
//       conferenceDataVersion: 1,
//       requestBody: {
//         summary: "Technology Junction Event 2023",
//         start: {
//           dateTime: "2023-06-01T10:00:00-07:00",
//           timeZone: "America/Los_Angeles"
//           },
//           end: {
//             dateTime: "2023-06-03T11:00:00-07:00",
//             timeZone: "America/Los_Angeles"
//             },
//             conferenceData: {
//               createRequest: {
//                 requestId: uuid(),
//             },
            
//           },
//           attendees: [
//             {
//               email: "engmuhammadwaseem0522@gmail.com"
//             },
//             {
//               email: "farrukhrizwan387@gmail.com",
//             },
//             {
//               email: "adilsiddiqui131@gmail.com",
//             },
//           ],
//           description: "You all are inform about this event to attend the meeting through google meet we already sent email to all particepent",
//           location: "Technolgy Junction NESTP Rawalpindi",
//           sendNotifications: true,
//           // email: "adilsiddiqui131@gmail.com",
//       },
      

//     });
//     console.log(res)
//     res.send({
//       msg: "Event Scheduled"
//     })
// })
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

