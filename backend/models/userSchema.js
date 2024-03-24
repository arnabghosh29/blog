import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        minLength: [3, "Name must conntain leats 3 charatear!"],
        maxLength: [32, "Name must conntain leats 32 charatear!"]
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "plase provied a valid email"],

    },
    phone: {
        type: Number,
        required: true,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        }, url: {
            type: String,
            required: true,
        }

    },
    education: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        required: true,
        enum: ["Reader", "Author"]

    },
    password: {

        type: String,
        required: true,
        minLength: [8, "Password must conntain leats 8 charatear!"],
        maxLength: [32, "Password connot exceed 32 charatear!"],
        select: false
    },
    createdon: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
};
// userSchema.methods.getJWTToken = function () {
//     return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//         expiresIn: process.env.JWT_EXPIRES
//     })
// }
//GENERATING A JWT TOKEN WHEN A USER REGISTERS OR LOGINS, IT DEPENDS ON OUR CODE THAT WHEN DO WE NEED TO GENERATE THE JWT TOKEN WHEN THE USER LOGIN OR REGISTER OR FOR BOTH. 
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES,
    });
};

export const User = mongoose.model("User", userSchema)