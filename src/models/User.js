const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcrypt

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' }
});

// 1. Encrypt password BEFORE saving to the database
userSchema.pre('save', async function(next) {
    // If the password hasn't been modified, skip this
    if (!this.isModified('password')) {
        next();
    }
    // Generate a "salt" and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 2. Add a method to check passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
