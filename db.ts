import mongoose from "mongoose";
mongoose.set("strictQuery", false);
const db = mongoose.connect(
  "mongodb://127.0.0.1:27017/graphql",
  {
    retryWrites: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Database connected successfully");
    }
  }
);
export default db;
