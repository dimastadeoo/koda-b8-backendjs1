import * as UserModels from "../models/users.model.js"
import { constants } from "node:http2"


/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function register(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "data name or email or passord not null ",
            })
        }

        const existing = UserModels.findAll().find(u => u.email === email)
        if (existing) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "data email is alredy exist",
            })
        }
        const newUser = UserModels.create({
            name, email, password
        })
        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "Success create data user",
            results: newUser
        })

    } catch (err) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed Send data because " + err.message,
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "email or passord not null",
            })
        }
        const foundUser = UserModels.findByEmail(email)
        console.log(foundUser.password)
        console.log(password)
        if (!foundUser){
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "email input not found",
            })
        }

        if (foundUser.password !== password){
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "password input is wrong",
            })
        }
        res.setHeader('Authentication', 'hello')

        res.json({
            success: true,
            message: `Success Login user ${foundUser.email}`,
            results: {
                token: 'hello',
                user: foundUser
            }
        })

    }catch (err){
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed Send data because " + err.message,
        })
    }
}