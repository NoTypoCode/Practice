import { google } from 'googleapis';
import key from '../secrets.json' assert {type: 'json'};

export const SHEET_ID = "1X05QrNF7DBSzmXxz6icJzaR5EL8s27cH8Zx5ZT5S9Ms";

const client = new google.auth.JWT(key.client_email, null, key.private_key, ['https://www.googleapis.com/auth/spreadsheets',]);

const sheets = google.sheets({ version: 'v4', auth: client });

export default sheets;