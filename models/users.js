const mongoose = require("mongoose");
const { capitalizeStr } = require("../modules/capitalizeStr");

const settingsSchema = mongoose.Schema({
  timeFormat: String,
  distUnit: String,
  tempUnit: String,
  globalNotification: String,
})

const userSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      minLength: [2, "Minimum of 2 characters."],
      maxLength: [50, "Maximum of 50 characters"],
      trim: true,
    },
    lastname: {
      type: String,
      minLength: [2, "Minimum of 2 characters"],
      maxLength: [50, "Maximum of 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email address is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: String,
    token: String,
    settings: settingsSchema,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  if (this.firstname) {
    this.firstname = capitalizeStr(this.firstname);
  }
  if (this.lastname) {
    this.lastname = capitalizeStr(this.lastname);
  }
  next();
});

const User = mongoose.model("users", userSchema);

module.exports = User;
