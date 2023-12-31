import express from "express";
import z, { ZodError } from 'zod';
import sheets, { SHEET_ID } from './sheets.js';


const app = express();

const contractSchema = z.object({
    date: z.number(),
    name: z.string().min(1, { message: "name is required" }),
    dealer: z.string(),
    creditCard: z.string(),
    amount: z.number()

})

app.use(express.json());
app.use(express.static('public'))

app.post('/send-message', async (req, res) => {
    try {
        const body = contractSchema.parse(req.body);



        const rows = Object.values(body);
        console.log(rows);

        await sheets.spreadsheets.values.append({
            spreadsheetId: SHEET_ID,
            range: 'Data!A:E',
            insertDataOption: 'INSERT_ROWS',
            valueInputOption: 'RAW',
            requestBody: {
                values: [rows]
            }
        });


        res.json({ message: 'Data added' });
    } catch (error) {
        if (error instanceof ZodError) {
            res.status(400).json({ error: error.message })
        } else {
            res.status(400).json({ error })
        }
    }
});

app.listen(5000, () => console.log('app is running on local host 5000'));