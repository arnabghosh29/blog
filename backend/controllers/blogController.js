import { catchAsyncErroes } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Blog } from "../models/blogSchema.js"
import cloudinary from "cloudinary"

export const blogPost = catchAsyncErroes(async (req, res, next) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Blog Main Image Is Mandatory!", 400));
    }
    const { mainImage, paraOneImage, paraTwoImage, paraThreeImage } = req.files;
    if (!mainImage) {
        return next(new ErrorHandler("Blog Main Image Is Mandatory!", 400));
    }
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (
        !allowedFormats.includes(mainImage.mimetype) ||
        (paraOneImage && !allowedFormats.includes(paraOneImage.mimetype)) ||
        (paraTwoImage && !allowedFormats.includes(paraTwoImage.mimetype)) ||
        (paraThreeImage && !allowedFormats.includes(paraThreeImage.mimetype))
    ) {
        return next(
            new ErrorHandler(
                "Invalid file type. Only JPG, PNG and WEBP Formats Are Allowed!",
                400
            )
        );
    }
    const {
        title,
        intro,
        paraOneDescription,
        paraOneTitle,
        paraTwoDescription,
        paraTwoTitle,
        paraThreeDescription,
        paraThreeTitle,
        category,
        published,
    } = req.body;

    const createdBy = req.user._id;
    const authorName = req.user.name;
    const authorAvatar = req.user.avatar.url;

    if (!title || !category || !intro) {
        return next(
            new ErrorHandler("Title, Intro and Category Are Required Fields!", 400)
        );
    }

    const uploadPromises = [
        cloudinary.uploader.upload(mainImage.tempFilePath),
        paraOneImage
            ? cloudinary.uploader.upload(paraOneImage.tempFilePath)
            : Promise.resolve(null),
        paraTwoImage
            ? cloudinary.uploader.upload(paraTwoImage.tempFilePath)
            : Promise.resolve(null),
        paraThreeImage
            ? cloudinary.uploader.upload(paraThreeImage.tempFilePath)
            : Promise.resolve(null),
    ];

    const [mainImageRes, paraOneImageRes, paraTwoImageRes, paraThreeImageRes] =
        await Promise.all(uploadPromises);

    if (
        !mainImageRes ||
        mainImageRes.error ||
        (paraOneImage && (!paraOneImageRes || paraOneImageRes.error)) ||
        (paraTwoImage && (!paraTwoImageRes || paraTwoImageRes.error)) ||
        (paraThreeImage && (!paraThreeImageRes || paraThreeImageRes.error))
    ) {
        return next(
            new ErrorHandler("Error occured while uploading one or more images!", 500)
        );
    }
    const blogData = {
        title,
        intro,
        paraOneDescription,
        paraOneTitle,
        paraTwoDescription,
        paraTwoTitle,
        paraThreeDescription,
        paraThreeTitle,
        category,
        createdBy,
        authorAvatar,
        authorName,
        published,
        mainImage: {
            public_id: mainImageRes.public_id,
            url: mainImageRes.secure_url,
        },
    };
    if (paraOneImageRes) {
        blogData.paraOneImage = {
            public_id: paraOneImageRes.public_id,
            url: paraOneImageRes.secure_url,
        };
    }
    if (paraTwoImageRes) {
        blogData.paraTwoImage = {
            public_id: paraTwoImageRes.public_id,
            url: paraTwoImageRes.secure_url,
        };
    }
    if (paraThreeImageRes) {
        blogData.paraThreeImage = {
            public_id: paraThreeImageRes.public_id,
            url: paraThreeImageRes.secure_url,
        };
    }
    const blog = await Blog.create(blogData);
    res.status(200).json({
        success: true,
        message: "Blog Uploaded!",
        blog,
    });
});
