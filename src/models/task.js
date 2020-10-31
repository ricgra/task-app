const mongoose = require('mongoose');


const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // TODO: check performance of populate instead of a nested documents version
        // relationship
        ref: 'User'
    }
}, {
    // Create auto timestamps fields
    timestamps: true
});

taskSchema.statics.allowedUpdates = ['description', 'completed'];

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;