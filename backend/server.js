const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const connectDB = require("./config/db")

dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use("/uploads",express.static("uploads"))

app.use("/api/auth",require("./routes/authRoutes"))
app.use("/api/crop",require("./routes/cropRoutes"))
app.use("/api/weather",require("./routes/weatherRoutes"))

app.listen(5000,()=>{
console.log("Server running on port 5000")
})