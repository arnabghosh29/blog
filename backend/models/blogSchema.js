// import mongoose from "mongoose";

// const blogSchema = new mongoose.Schema({
//     title: {
//         type: String,
//         required: true,
//         minLength: [10, "blog title must contain at least 10chracters!"],
//         maxLength: [40, "blog title cannot contain at least 4chracters!"]
//     },
//     mainImage: {
//         public_id: {
//             type: String,
//             required: true,
//         },
//         url: {
//             type: String,
//             required: true,
//         }
//     },
//     intro: {
//         type: String,
//         required: true,
//         minLength: [200, "blog title must contain at least 200chracters!"],

//     },
//     paraOneImage: {
//         public_id: {
//             type: String,
//         },
//         url: {
//             type: String,

//         },
//     },
//     paraOneDescription: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },
//     paraOneTitle: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },
//     paraTwoImage: {
//         public_id: {
//             type: String,
//         },
//         url: {
//             type: String,

//         },
//     },
//     paraTwoDescription: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },
//     paraTwoTitle: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },

//     paraThreeImage: {
//         public_id: {
//             type: String,
//         },
//         url: {
//             type: String,

//         },
//     },
//     paraThreeDescription: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },
//     paraThreeTitle: {
//         type: String,
//         minLength: [50, "blog title must contain at least 500chracters!"],
//     },
//     category: {
//         type: String,
//         required: true,
//     },
//     createBy: {
//         type: mongoose.Schema.ObjectId,
//         ref: "User",
//         required: true
//     },
//     authorName: {
//         type: String,
//         required: true
//     },
//     authorAvatar: {
//         type: String,
//         required: true,
//     }
// });

// export const Blog = mongoose.model("Blog", blogSchema)

import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    mainImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    intro: {
        type: String,
        required: true,
        minLength: [250, "Blog intro must contain at least 250 characters!"],
    },
    paraOneImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraOneDescription: {
        type: String,
    },
    paraOneTitle: {
        type: String,
    },
    paraTwoImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraTwoDescription: {
        type: String,
    },
    paraTwoTitle: {
        type: String,
    },
    paraThreeImage: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    paraThreeDescription: {
        type: String,
    },
    paraThreeTitle: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    authorAvatar: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        default: false,
    },
});

export const Blog = mongoose.model("Blog", blogSchema);
