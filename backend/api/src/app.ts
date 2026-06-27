import express from "express";
import type {Request, Response} from "express";
import { pool } from "./config/db.js";
import cors from "cors";

//import routes
import authRoutes from "./modules/auth/auth_route.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async function(req:Request,res:Response){
    try {
        const result = await pool.query("SELECT NOW() as current_time");

        res.status(200).json({
            message: "Server and database is running",
            database_time: result.rows[0].current_time,
        });

    } catch (err:any) {
        console.error("database connection error: ", err);

        res.status(500).json({
            message: "database conenction failed"
        });

    }
})

//app.use(stuff)
app.use("/api/auth", authRoutes);
   
export default app;
