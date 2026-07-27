import { readData, writeData } from "../lib/storage.js"

// let users = []
// let currentId = 1
const USERS_FILE = 'users.json'

const readUsers = async function () {
    const data = await readData(USERS_FILE)
    return Array.isArray(data) ? data : []
}

const writeUsers = async function (users) {
    await writeData(USERS_FILE, users)
}

const getIdUsers = (users) => {
    if (users.length === 0) return 1
    return Math.max(...users.map(u => u.id)) + 1
}

// Helper sorting
const applySorting = (users, sortConfig) => {
    const { column, order } = sortConfig;
    return users.sort((a, b) => {
        let valA = a[column];
        let valB = b[column];

        // Handle string case-insensitive
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });
};

// Helper filter search
const applySearchFilters = (users, search) => {
    if (!search || typeof search !== 'object') return users;
    for (const [column, value] of Object.entries(search)) {
        if (value) {
            const searchValue = value.toLowerCase().trim();
            users = users.filter(user => {
                const fieldValue = user[column]?.toString().toLowerCase() || '';
                return fieldValue.includes(searchValue);
            });
        }
    }
    return users;
};

export const findAll = async function (limit, page, search, sortConfig) {
    let users = await readUsers()

    // Terapkan filter search (jika ada)
    users = applySearchFilters(users, search);

    // Terapkan sorting (default id asc jika tidak diberikan)
    users = applySorting(users, sortConfig);

    // jika tidak ada paging maka tampilkan all data
    if (!limit && !page) {
        return users.map(({ password, ...rest }) => rest)
    }
    // jika ada paging
    const total = users.length
    const totalPages = Math.ceil(total / limit)
    if (page > totalPages) {
        page = totalPages
    }
    const offset = (page - 1) * limit
    const limitUser = users.slice(offset, offset + limit)


    return limitUser.map(({ password, ...rest }) => rest)
}

export const findById = async function (id) {
    const users = await readUsers()
    const user = users.find(user => user.id === id)
    if (!user) return null
    const { password, ...rest } = user
    return rest
}

export const findByEmail = async function (email) {
    const users = await readUsers()
    const user = users.find(user => user.email === email)
    if (!user) return null

    return user
}

export const create = async function (userData) {
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


