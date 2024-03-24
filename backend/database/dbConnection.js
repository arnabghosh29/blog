import mongoose from "mongoose";
export const dbconnection = () => {
    mongoose.connect(process.env.MONGO_URL, {
        dbName: "MERN_STACK_BLOG"
    }).then(() => {
        console.log("connection to db")
    }).catch(err => {
        console.log(`some error db: ${err}`)
    })
}