import { readData, writeData } from "../lib/storage.js"

// let users = []
// let currentId = 1
const USERS_FILE = 'users.json'

const readUsers = async function(){
    const data = await readData(USERS_FILE)
    return Array.isArray(data) ? data : []
}

const writeUsers = async function(users) {
    await writeData(USERS_FILE, users)
}

const getIdUsers = (users) =>{
    if (users.length === 0) return 1
    return Math.max(...users.map(u => u.id)) + 1
}

export const findAll = async function(limit, page) {
    const users = await readUsers()

    if (!limit && !page){
        return users.map(({password, ...rest}) => rest)
    }
    const total = users.length
    const totalPages = Math.ceil(total / limit)
    if (page > totalPages){
        page = totalPages
    }
    const offset = (page - 1) * limit
    const limitUser = users.slice(offset, offset + limit)
    

    return limitUser.map(({password, ...rest}) => rest)
}

export const findById = async function(id) {
    const users = await readUsers()
    const user = users.find(user => user.id === id)
    if (!user) return null
    const {password, ...rest} = user
    return rest
}

export const findByEmail = async function(email) {
    const users = await readUsers()
    const user = users.find(user => user.email === email)
    if (!user) return null

    return user
}

export const create = async function(userData) {
    const users = await readUsers()
    const now = new Date().toISOString()

    const newUser = {
        id: getIdUsers(users),
        ...userData,
        created_at: now,
        updated_at: now
    }
    users.push(newUser)
    await writeUsers(users)
    const { password, ...rest } = newUser
    return rest
}

export async function update(id, updateField) {
    const users = await readUsers()
    const now = new Date().toISOString()

    const index = users.findIndex(user => user.id === id)
    if (index === -1) return null

    users[index] = {
        ...users[index],
        ...updateField,
        updated_at: now
    }
    const { password, ...rest } = users[index]
    return rest
}

export const remove = async function (id) {
    const users = await readUsers()
    const index = users.findIndex(user => user.id === id)
    if (index === -1) return false

    users.splice(index, 1)
    await writeUsers(users)

    return true
}


