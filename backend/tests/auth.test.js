const request = require('supertest')
const app = require('../server')
const mongoose = require('mongoose')
const User = require('../models/User')

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
})

afterEach(async () => {
    await User.deleteMany({});
});

describe('Auth API Unit Tests', () => {
    test('Should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'Test User',
            email: 'testuser@example.com',
            password: 'Password123',
            role: 'Manager'
        });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    test('Should not register user with duplicate email', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'User1',
            email: 'dupe@example.com',
            password: 'Password123',
            role: 'Employee'
        });

        const res = await request(app).post('/api/auth/register').send({
            username: 'User2',
            email: 'dupe@example.com',
            password: 'Password456',
            role: 'Manager'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Email already registered');
    });

    test('Should login an existing user', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'Login User',
            email: 'login@example.com',
            password: 'TestPass123',
            role: 'Employee'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'login@example.com',
            password: 'TestPass123'
        });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Login Successful!');
        expect(res.body).toHaveProperty('token');
    });

    test('Should fail login with incorrect password', async () => {
        await request(app).post('/api/auth/register').send({
            username: 'Bad Login',
            email: 'badlogin@example.com',
            password: 'RightPass123',
            role: 'Manager'
        });

        const res = await request(app).post('/api/auth/login').send({
            email: 'badlogin@example.com',
            password: 'WrongPass'
        });

        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Invalid Password');
    });
})