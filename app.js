const bodyParser = require("body-parser")
const express = require("express")
const connectDb= require("./db/dbconnection").connectDb
const cors = require("cors")
const app = express()
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")

connectDb()
app.use(bodyParser.urlencoded
    ({
        extended: true
    }))
dotenv.config({ path: ".env" });
app.use(cookieParser());
app.use(cors({
    origin:"*"
}))
app.use("/", require("./routes/UserRoutes"))
app.use("/", require("./routes/RoleRoutes"))
app.use("/", require("./routes/PermissionRoutes"));
app.use("/", require("./routes/GroupRoutes"));
app.listen(3000, ()=>{
    console.log("listening to port 3000")
})