import * as UserModels from "../models/users.model.js"
import { constants } from "http2"

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getAll(req, res) {
    try {
        const users = UserModels.findAll();
        res.json({
            success: true,
            message: "success Get all data users",
            results: users
        })
    } catch (err) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed Get data because " + err.message,
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function getById(req, res) {
    try {
        const id = parseInt(req.params.id)
        const user = UserModels.findById(id);
        if (!user) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User Not found ",
            })
        }
        res.json({
            success: true,
            message: "Success found data user",
            results: user
        })

    } catch (err) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed Get data because " + err.message,
        })
    }
}

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export function createUser(req, res) {
    try {
        const {name, email, password} = req.body

        if (!name || !email || ! password){
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "data name or email or passord not null ",
            })
        }
        
        const existing = UserModels.findAll().find(u => u.email === email)
        if (existing){
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
export function updateUser(req, res) {
    try {
        const id = parseInt(req.params.id)
        const {name, email, password} = req.body

        const dataUpdate = {}
        if (name !== undefined) dataUpdate.name = name
        if (email !== undefined) dataUpdate.email = email
        if (password !== undefined) dataUpdate.password = password

        if (Object.keys(dataUpdate).length === 0){
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "No data field was updated",
            })
        }

        if (dataUpdate.email){
            const existing = UserModels.findAll().find(u => u.email === dataUpdate.email &&
                u.id !== id
            )
            if (existing){
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "data email is alredy exist",
                })
            }
        }

        const updateUser = UserModels.update(id, dataUpdate)
      
        if (!updateUser){
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User Not found ",
            })
        }

        res.json({
            success: true,
            message: `Success update data`,
            results: updateUser
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
export function deleteUser(req, res) {
    try {
        const id = parseInt(req.params.id)
        const deleted = UserModels.remove(id)
        if (!deleted) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User Not found ",
            })
        }
        res.json({
            success: true,
            message: "Success deleted data user",
        })

    } catch (err) {
        res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Failed Get data because " + err.message,
        })
    }
}