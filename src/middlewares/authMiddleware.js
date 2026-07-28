import {constants} from "node:http2"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {function()} next
 */
function authMiddleware(req, res, next) {
    const authHeader = req.header("Authorization")

    if (authHeader !== "hello") {
        return res.status(constants.HTTP_STATUS_UNAUTHORIZED).json({
            success: false,
            message: "Unauthorized",
        })
    }
    next()
}

export default authMiddleware