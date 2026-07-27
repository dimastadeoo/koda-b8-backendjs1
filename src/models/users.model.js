let users = []
let currentId = 1

const now = new Date().toISOString()

export const findAll = () => users

export const findById = (id) => users.find(user => user.id === id)

export const create = (userData) => {
    const newUser = {
        id: currentId++,
        ...userData,
        created_at: now,
        updated_at: now,
    }
    users.push(newUser)
    return newUser
}

export function update(id, updateField) {
    const index = users.findIndex(user => user.id === id)
    if (index === -1) return null

    users[index] = {
        ...users[index],
        ...updateField,
        updated_at: now,
    }
    return users[i]
}

export const remove = function(id){
    const index = users.findIndex(user => user.id === id)
    if (index === -1) return null

    users.splice(index, 1)
}

