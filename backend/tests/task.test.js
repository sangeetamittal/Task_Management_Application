const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

async function createUserAndGetToken(role = 'Manager') {
    if (role === 'Manager') {
        const res1 = await request(app).post('/api/auth/register').send({
            username: 'Manager User',
            email: 'manager@example.com',
            password: 'Password123',
            role,
        });

        console.log(res1.body)

        const res2 = await request(app).post('/api/auth/login').send({
            email: 'manager@example.com',
            password: 'Password123',
        });

        console.log(res2.body)

        return { token: res2.body.token, userId: res2.body.user.id };
    }
    else {
        const res1 = await request(app).post('/api/auth/register').send({
            username: `Employee User`,
            email: `employee@example.com`,
            password: 'Password123',
            role,
        });

        const res2 = await request(app).post('/api/auth/login').send({
            email: 'employee@example.com',
            password: 'Password123',
        });

        return { token: res2.body.token, userId: res2.body.user.id };
    }

}

afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

afterEach(async () => {
    await Task.deleteMany({});
    await User.deleteMany({});
});

describe('Tasks API Integration Tests', () => {
    test('Manager can create a task', async () => {
        const { token, userId } = await createUserAndGetToken('Manager');
        const assignedUser = new User({
            username: 'Assigned User',
            email: 'assigned@example.com',
            password: 'Password123',
            role: 'Employee',
        });
        await assignedUser.save();

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task',
                description: 'Task description',
                status: 'Pending',
                assignedTo: assignedUser._id.toString(),
                dueDate: new Date().toISOString(),
                createdBy: userId.toString(),
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('message', 'Task created');
    });

    test('Employee cannot create a task', async () => {
        const { token } = await createUserAndGetToken('Employee');

        const res = await request(app)
            .post('/api/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'New Task',
                assignedTo: new mongoose.Types.ObjectId().toString(),
                dueDate: new Date().toISOString(),
            });

        expect(res.statusCode).toBe(403);
        expect(res.body).toHaveProperty('message', 'Access denied: insufficient role');
    });

    test('Manager and Employee can get all tasks', async () => {
        const manager = await createUserAndGetToken('Manager');
        const employee = await createUserAndGetToken('Employee');

        // Create a task by manager
        const task = await request(app).post('/api/tasks').set('Authorization', `Bearer ${manager.token}`).send({
            title: 'New Task',
            description: 'Task description',
            status: 'Pending',
            assignedTo: employee.userId.toString(),
            dueDate: new Date().toISOString(),
            createdBy: manager.userId.toString(),
        });

        console.log(task)

        // Manager get tasks
        let res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${manager.token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        // Employee get tasks
        res = await request(app).get('/api/tasks').set('Authorization', `Bearer ${employee.token}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

});
