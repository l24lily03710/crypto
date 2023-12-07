const  mongoose = require("mongoose");
const  bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mail: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true }, // Unique Google ID
});

// Hash password
userSchema.pre('save', function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) return next(err);
          user.password = hash;
          next();
      });
  });
});

// Static method to find or create user
userSchema.statics.findOrCreate = function (condition, callback) {
  const self = this;
  self.findOne(condition, function (err, result) {
    if (err) {
      callback(err, null);
    } else if (result) {
      callback(err, result);
    } else {
      let newUser = new self(condition);
      newUser.save(function (err, savedUser) {
        callback(err, savedUser);
      });
    }
  });
};
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

module.exports = mongoose.model("users", userSchema);
