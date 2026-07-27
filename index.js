import express from "express"
import router from "./src/routers/index.js"
// import {constants} from "node:http2"
// import auth

const app = express()

app.use(express.urlencoded())

console

app.use(router)

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`)
})