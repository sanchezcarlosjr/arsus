import * as functions from 'firebase-functions';

const express = require('express');
const cors = require('cors');

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// build multiple CRUD interfaces:
app.get('/:id', (req: any, res: any) => res.send('ID'));
app.get('/:name', (req: any, res: any) => res.send('List'));

export const apiHandler = functions.https.onRequest(app);
