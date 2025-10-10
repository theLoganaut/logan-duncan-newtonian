// src/app/api/send-to-sheets/route.ts
import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const {row, week} = await req.json(); // still fine

  if (!Array.isArray(row)) {
    return NextResponse.json({ message: 'Invalid row data' }, { status: 400 });
  }

  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!rawJson) {
    return NextResponse.json({ message: 'Missing GOOGLE_SERVICE_ACCOUNT_JSON' }, { status: 500 });
  }

  // console.log("raw creditionals parse", JSON.parse(rawJson))
  // console.log("raw broke")

  let credentials;
  try {
    credentials = JSON.parse(rawJson);
  } catch (err) {
    console.error('Invalid GOOGLE_SERVICE_ACCOUNT_JSON:', err);
    return NextResponse.json({ message: 'Bad credentials format' }, { status: 500 });
  }


  try {
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // const res = await sheets.spreadsheets.get({
    //   spreadsheetId: '1Nqa-xRQYOQq5nRDskHWPmT5F1rzYzuMYMOL_fYXuP-w',
    // });
    // console.log(res.data.sheets.map(s => s.properties.title));

    await sheets.spreadsheets.values.append({
      spreadsheetId: "1Nqa-xRQYOQq5nRDskHWPmT5F1rzYzuMYMOL_fYXuP-w", // make sure this is correct!
      range: `'W18'!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'OVERWRITE',
      requestBody: {
        values: [row],
      },
    });

    return NextResponse.json({ message: 'Success' });
  } catch (err) {
    console.error('Error in /api/send-to-sheets:', err);
    return NextResponse.json({ message: err.message ?? err.toString() }, { status: 500 });
  }
}