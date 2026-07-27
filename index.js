import express from "express"
import router from "./src/routers/index.js"
// import {constants} from "node:http2"
// import auth

const app = express()

app.use(express.urlencoded())

console

app.use(router)

app.listen(8080,()=>{
    console.log("server listening on port 8080")
})