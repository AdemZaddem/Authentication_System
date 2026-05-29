import "dotenv/config"
import express from "express"
import authRoutes from "./routes/auth.js"
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cors({origin:'http://localhost:5173'}))

app.use("/auth", authRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))