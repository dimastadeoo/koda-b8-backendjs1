import express from "express"
import router from "./src/routers/index.js"
import qs from "qs"
import corsMiddleware from "./src/middlewares/corsMiddleware.js"
import { constants } from "node:http2"
import { fileURLToPath } from "node:url"
import path from "node:path"

const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)

const app = express()
const PORT = process.env.PORT || 8080

app.set('query parser', (str) => qs.parse(str))
app.use(express.urlencoded())
app.use(corsMiddleware)
app.use('/uploads/file', express.static(path.join(_dirname, 'uploads')));

app.use(router)


app.all("{*all}", function (req, res) {
    res.status(constants.HTTP_STATUS_NOT_FOUND).json({
        success: false,
        message: "Resources Not Found",
    })
})


app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})