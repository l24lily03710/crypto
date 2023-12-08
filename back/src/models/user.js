const  mongoose = require("mongoose");
const  bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  mail: { type: String, required: true, unique: true},
  password: { type: String, required: true }
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

/*userSchema.virtual("id").get(function () {
  return this._id;
});*/
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
});

module.exports = mongoose.model("users", userSchema);
