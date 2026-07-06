import { createUser } from './users/createUsers';
import { deleteUser } from './users/deleteUser';
import { findUsers } from './users/findUsers';
import { updateUser } from './users/updateUser';

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

app.get('/create', (_req: import('express').Request, res: import('express').Response) => {
    res.send('Creating mock user');
    createUser();
})

app.get('/update', (_req: import('express').Request, res: import('express').Response) => {
    res.send('Updating mock user');
    updateUser();
})

app.get('/find', (_req: import('express').Request, res: import('express').Response) => {
    res.send('Returning all users');
    findUsers();
})

app.get('/delete', (_req: import('express').Request, res: import('express').Response) => {
    res.send('Deleting mock user');
    deleteUser();
})

// Server setup
app.listen(PORT,() => {
    console.log('The application is listening '
          + 'on port http://localhost:'+PORT);
})