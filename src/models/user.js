import mongoose from 'mongoose';
import {createHmac, randomBytes} from 'crypto';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: [true, 'Email is already registered']
    },
    salt: {
        type: String,
    },  
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String,
        default: '/images/profile.png'
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
}, { timestamps: true });

UserSchema.pre('save', function(next) {
    const user = this;

    if(!user.isModified('password')) {
        return;
    } 

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt)
    .update(user.password)
    .digest('hex');

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

UserSchema.static('matchPassword', async function(email, password) {
    const user = await this.findOne({ email });
    if(!user) {
        throw new Error('Invalid email');
    };

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest('hex');

    if(userProvidedHash !== hashedPassword) {
        throw new Error('Invalid password');
    }

    return user;

});
const User = mongoose.model('User', UserSchema);

export default User;