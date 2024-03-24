import { catchAsyncErroes } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js"
import { User } from "../models/userSchema.js";
import { sendToken } from "../utils/jwtToken.js"
import cloudinary from "cloudinary";

export const register = catchAsyncErroes(async (req, res, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("User Avatar Required!", 400));
    }
    const { avatar } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(
            new ErrorHandler(
                "Invalid file type. Please provide your avatar in png, jpg or webp format.",
                400
            )
        )
    }

    const { name, email, password, phone, role, education } = req.body;
    if (!name || !email || !password || !phone || !role || !education || !avatar) {
        return next(new ErrorHandler("please fill full details!", 400))
    }
    let user = await User.findOne({ email });
    if (user) {
        return next(new ErrorHandler("User already existes", 400));
    }

    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary error:",
            cloudinaryResponse.error || "Unknown cloudinary error!"
        );
    }
    user = await User.create({
        name, email, password, phone, role, education, avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        }
    });

    sendToken(user, 201, res, "User Registered!")
    // res.status(200).json({
    //     success: true,
    //     message: "User registered"
    // })

});


export const login = catchAsyncErroes(async (req, res, next) => {
    const { email, password, role, } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler("please fill full form", 400))
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid   password", 400));
    }
    if (user.role !== role) {
        return next(new ErrorHandler(`User with provided role(${role}) Not found`, 400));
    }
    sendToken(user, 201, res, "User LogIn!");


})


export const logout = catchAsyncErroes(async (req, res, next) => {
    res
        .status(201)
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(Date.now()),
        })
        .json({
            success: true,
            message: "LogOut Successfully.",
        });
});
// export const getMyProfile = catchAsyncErroes((req, res, next) => {
//     const user = req.user;

//     res.status(200).json({
//         success: true,
//         user,
//     });
export const getMyProfile = catchAsyncErroes((req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user,
    });
});
// });

export const getAllAuthors = catchAsyncErroes(async (req, res, next) => {
    const authors = await User.find({ role: "Author" })
    res.status(200).json({
        success: true,
        authors,
    });
});