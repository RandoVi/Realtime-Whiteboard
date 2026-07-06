const express = require('express');

const app = express();

require('dotenv').config();

const rawPort = process.env.PORT;
const PORT: number = rawPort ? Number(rawPort) : 3000;

if (Number.isNaN(PORT)) {
    throw new Error(`Invalid PORT value: ${rawPort}`);
}

// Handling GET / Request
app.get('/', (_req: import('express').Request, res: import('express').Response) => {
    res.send('Welcome to typescript backend!');
})

// Server setup
app.listen(PORT,() => {
    console.log('The application is listening '
          + 'on port http://localhost:'+PORT);
})