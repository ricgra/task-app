const request = require('supertest');
require('../src/server');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDatabase } = require('./fixtures/db');


beforeEach(setupDatabase)

test('Signup a new user', async () => {
    const response = await request(app)
        .post('/users')
        .send({
            name: 'Jessy',
            email: 'jessy@test.it',
            password: 'mytestpass'
        }).expect(201);

    // Assert the DB changed correctly
    const user = await User.findById(response.body.user._id);

    expect(user).not.toBeNull();

    // Assertion about response
    expect(response.body.user.name).toBe('Jessy');

    expect(response.body)
        .toMatchObject({
            user: {
                name: 'Jessy',
                email: 'jessy@test.it'
            },
            token: user.tokens[0].token
        });
});

test('Should login existing user', async () => {
    const response = await request(app)
        .post('/users/login')
        .send({
            email: userOne.email,
            password: userOne.password
        })
        .expect(200);

    const user = await User.findById(userOneId);

    expect(response.body.token).toBe(user.tokens[1].token);
})

test('Should not login nonexisting user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            email: 'fake',
            password: 'fake'
        })
        .expect(400);
})

test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200);
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401);
})

test('Should not delete account for unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401);
})

test('Should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200);

    const user = await User.findById(userOneId)

    expect(user).toBeNull();
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send({
            name: 'New mike'
        })
        .expect(200);

    const user = await User.findById(userOneId)

    expect(user.name).toBe('New mike');
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send({
            location: 'Bahamas'
        })
        .expect(500);
})