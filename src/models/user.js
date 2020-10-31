const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const Logger = require('../utils/logger');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 7,
        validate(value) {
            if (value.includes('password')) {
                throw new Error('Cannot contains password in value');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
});

// TODO: check performance of populate instead of a nested documents version
// Virtual property - relation between two entities virtual
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    Logger.debug('Generate auth token');
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    // Return a clone
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    Logger.debug('Find user by credentials');
    const user = await User.findOne({ email: email });
    if (!user) {
        throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};

userSchema.statics.allowedUpdates = ['name', 'password', 'age', 'email'];

// Middleware - encode password - hash plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    Logger.debug('Before user [' + user._id + '] save');
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

//Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this;
    Logger.debug('Before user [' + user._id + '] delete');
    await Task.deleteMany({ owner: user._id });

    next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;