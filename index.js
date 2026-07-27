import express from "express"
import router from "./src/routers/index.js"
import qs from "qs"
// import {constants} from "node:http2"
// import auth

const app = express()

app.set('query parser', (str) => qs.parse(str))
app.use(express.urlencoded())

app.use(router)

const PORT = process.env.PORT || 8080

app.listen(PORT,()=>{
    console.log(`server listening on port ${PORT}`)
})