const jwt = require('jsonwebtoken')
const moongose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


const userOneId = new moongose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike',
    email: 'mike@test.it',
    password: 'mytestpass',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new moongose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Walter',
    email: 'walter@test.it',
    password: 'mytestpass',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new moongose.Types.ObjectId(),
    description: 'Task one from test',
    completed: false,
    owner: userOneId
}

const taskTwo = {
    _id: new moongose.Types.ObjectId(),
    description: 'Task two from test',
    completed: false,
    owner: userOneId
}

const taskThree = {
    _id: new moongose.Types.ObjectId(),
    description: 'Task three from test',
    completed: true,
    owner: userTwoId
}

const setupDatabase = async () => {
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}


module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}