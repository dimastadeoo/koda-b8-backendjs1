let users = []
let currentId = 1

export const findAll = () => users.map(({password, ...rest}) => rest)

export const findById = (id) => {
    const user = users.find(user => user.id === id)
    if (!user) return null
    const {password, ...rest} = user
    return rest
}

export const findByEmail = (email) => {
    const user = users.find(user => user.email === email)
    if (!user) return null

    return user
}

export const create = (userData) => {
    const now = new Date().toISOString()

    const newUser = {
        id: currentId++,
        ...userData,
        created_at: now,
        updated_at: now
    }
    users.push(newUser)
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
}

export function update(id, updateField) {
    const now = new Date().toISOString()

    const index = users.findIndex(user => user.id === id)
    if (index === -1) return null

    users[index] = {
        ...users[index],
        ...updateField,
        updated_at: now
    }
    const { password, ...userWithoutPassword } = users[index]
    return userWithoutPassword
}

export const remove = function (id) {
    const index = users.findIndex(user => user.id === id)
    if (index === -1) return null

    users.splice(index, 1)
    return true
}


