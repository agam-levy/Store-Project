//this is the main file of the server, הוא מרים את השרת
import dotenv from "dotenv"
dotenv.config();

import express from "express"
import bodyParser from "body-parser"

const app = express();

app.listen(PORT,()=>{
    console.log(`server is running on port: ${PORT}`)
});
const PORT= process.env.PORT || 7000;
