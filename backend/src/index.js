import dotenv from "dotenv";
dotenv.config({
    path: "./.env"
});

import { app } from "./app.js";
import { connectDB } from "../src/db/indexDB.js";

const port = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(port, () => {
        console.log(`Server is running at ${port}`);
    });
})
.catch((error) => {
    console.log(`Database connection error: ${error}`);
});
