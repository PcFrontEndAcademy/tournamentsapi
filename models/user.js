const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

async function createHashedPassword(next) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
}
UserSchema.pre('save', createHashedPassword);

UserSchema.methods.isValidPassword = async function isValidPassword(password) {
    // eslint-disable-next-line no-return-await
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);
