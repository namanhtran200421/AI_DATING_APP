import dotenv from "dotenv";
import app from "./app.js";

dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, function(err){
    if(!err){
        console.log(`server run on: ${PORT}`)
    } else {
        console.log('error', err);
    }
})