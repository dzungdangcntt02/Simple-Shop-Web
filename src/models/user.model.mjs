import mongoose from 'mongoose'
import slugify from 'slugify'
// import bcrypt from 'bcrypt'

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: [8, 'Password must be at least 8 characters'],
    private: true,
  },
  slug: {
    type: String,
  },
  status: {
    type: String,
    default: 'inactive',
    enum: ['active', 'inactive', 'banned'],
  },
  address: {
    type: String,
    minLength: [30, 'Address must be longer than 30 characters'],
  },
  phoneNumber: {
    type: String,
    maxLength: [11, 'Phone number must be shorter than 12 characters'],
  },
}, {
  timestamps: true,
})

userSchema.pre('save', async function (next) {
  this.slug = slugify(this.username, { lower: true })
  next()
})

// userSchema.pre('save', async function (next) {
//   const user = this;
//   if (user.isModified('password')) {
//     user.password = await bcrypt.hash(user.password, 8);
//   }
//   next();
// });

const User = mongoose.model('User', userSchema)

export default User
