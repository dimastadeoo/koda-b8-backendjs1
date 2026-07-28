import * as UserModels from "../models/users.model.js"
import { constants } from "node:http2"
import fs from "node:fs"
import path from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, '../../uploads');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function getAll(req, res) {
    try {
        let { limit, page, search, sort } = req.query;

        // Filter search hanya untuk kolom yang diizinkan
        const allowedColumns = ['name', 'email'];
        let filteredSearch = {};
        let invalidColumns = []

        // kondisi jika ada query string search
        if (search) {
            // Jika search adalah string → format salah
            if (typeof search === 'string') {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "Format search harus menggunakan object, contoh: search[name]=value atau search[email]=value"
                });
            }
            if (search && typeof search === 'object') {
                const entries = Object.entries(search);

                for (const [key, value] of entries) {
                    if (!value) continue; // skip jika nilai kosong
                    if (allowedColumns.includes(key)) {
                        filteredSearch[key] = value;
                    } else {
                        invalidColumns.push(key);
                    }
                }
                // Jika ada kolom yang tidak diizinkan
                if (invalidColumns.length > 0) {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                        success: false,
                        message: `Kolom yang diizinkan untuk search hanya: ${allowedColumns.join(', ')}. Kolom tidak valid: ${invalidColumns.join(', ')}`
                    });
                }
                // Jika semua kolom diabaikan karena nilai kosong
                if (Object.keys(filteredSearch).length === 0 && entries.length > 0) {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                        success: false,
                        message: "Nilai pencarian tidak boleh kosong"
                    });
                }
            }
        }
        // kondisi jika ada query string paging
        if (limit || page) {
            if (!limit || limit < 1) {
                limit = 5
            }
            if (!page || page < 1) {
                page = 1
            }
            page = parseInt(page)
            limit = parseInt(limit)
            if (isNaN(page) || isNaN(limit)) {
                res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "query page or limit must be a number",
                })
                return
            }
        }

        // --- Validasi Sort ---
        const allowedSortColumns = ['id', 'name', 'email'];
        let sortConfig = {}

        if (sort) {
            if (typeof sort === 'string') {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "Format sort harus menggunakan object, contoh: sort[id]=asc atau sort[name]=desc"
                });
            }
            if (typeof sort === 'object') {
                const entries = Object.entries(sort);
                if (entries.length === 0) {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                        success: false,
                        message: "Sort object tidak boleh kosong"
                    });
                }
                // Ambil hanya entry pertama (kita hanya support satu kolom sort)
                const [column, order] = entries[0];
                if (!allowedSortColumns.includes(column)) {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                        success: false,
                        message: `Kolom yang diizinkan untuk sort hanya: ${allowedSortColumns.join(', ')}. Kolom tidak valid: ${column}`
                    });
                }
                const normalizedOrder = order?.toLowerCase();
                if (normalizedOrder !== 'asc' && normalizedOrder !== 'desc') {
                    return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                        success: false,
                        message: `Nilai order harus 'asc' atau 'desc'. Nilai tidak valid: ${order}`
                    });
                }
                sortConfig = { column, order: normalizedOrder };
            }
        }

        const users = await UserModels.findAll(limit, page, filteredSearch, sortConfig);
        res.json({
            success: true,
            message: "success Get all data users",
            results: users
        })
    } catch (err) {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
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
export async function getById(req, res) {
    try {
        const id = parseInt(req.params.id)
        const user = await UserModels.findById(id);
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
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
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
export async function createUser(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "data name or email or passord not null ",
            })
        }

        const data = await UserModels.findAll()
        const existing = data.find(u => u.email === email)
        if (existing) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "data email is alredy exist",
            })
        }
        const newUser = await UserModels.create({
            name, email, password
        })
        res.status(constants.HTTP_STATUS_CREATED).json({
            success: true,
            message: "Success create data user",
            results: newUser
        })

    } catch (err) {
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
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
export async function updateUser(req, res) {
    try {
        const id = parseInt(req.params.id)
        const { name, email, password } = req.body

        const dataUpdate = {}
        if (name !== undefined) dataUpdate.name = name
        if (email !== undefined) dataUpdate.email = email
        if (password !== undefined) dataUpdate.password = password

        if (Object.keys(dataUpdate).length === 0) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "No data field was updated",
            })
        }

        if (dataUpdate.email) {
            const data = await UserModels.findAll()
            const existing = data.find(u => u.email === dataUpdate.email &&
                u.id !== id
            )

            if (existing) {
                return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                    success: false,
                    message: "data email is alredy exist",
                })
            }
        }

        const updateUser = await UserModels.update(id, dataUpdate)

        if (!updateUser) {
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
        return res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
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
export async function deleteUser(req, res) {
    try {
        const id = parseInt(req.params.id)
        const deleted = await UserModels.remove(id)
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

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 */
export async function uploadPicture(req, res) {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "ID users must be a number",
            })
        }
        const user = await UserModels.findById(id)
        if (!user) {
            return res.status(constants.HTTP_STATUS_NOT_FOUND).json({
                success: false,
                message: "User Id Not Found",
            })
        }
        if (!req.file) {
            return res.status(constants.HTTP_STATUS_BAD_REQUEST).json({
                success: false,
                message: "Upload file is failed",
            })
        }

        // --- Hapus file lama jika ada ---
        const oldPicture = user.picture; 
        if (oldPicture) {
            // Ubah path relatif menjadi absolut
            const oldFilePath = path.join(UPLOAD_DIR, path.basename(oldPicture));
            if (fs.existsSync(oldFilePath)) {
                try {
                    fs.unlinkSync(oldFilePath);
                    console.log(`old file is deleted: ${oldFilePath}`);
                } catch (err) {
                    console.error(`old file is fail deleted: ${err.message}`);
                }
            }
        }


        const picturePath = `/uploads/${req.file.filename}`
        const updateUser = await UserModels.update(id, {picture: picturePath})

        res.json({
            success: true,
            message: `Success upload picture`,
            results: updateUser
        })

    } catch (err) {
        // Tangani error dari multer
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'Ukuran file maksimal 2 MB'
            });
        }
        if (err.message && err.message.includes('image type')) {
            return res.status(400).json({
                success: false,
                message: err.message
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed upload picture: " + err.message,
        });
    }
}