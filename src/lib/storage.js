import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"


const _filename = fileURLToPath(import.meta.url)
const _dirname = path.dirname(_filename)
const DATA_DIR = path.join(_dirname, '../../data')

async function checkDir() {
    try{
        await fs.access(DATA_DIR)
    }catch{
        await fs.mkdir(DATA_DIR, {recursive: true})
    }
}

export async function readData(filename) {
    await checkDir()
    const filePath = path.join(DATA_DIR, filename)
    try{
        const data = await fs.readFile(filePath, 'utf-8')
        return JSON.parse(data)
    }catch (err){
        if (err.code === 'ENOENT'){ // file belum ada
            return []
        }throw err

    }
}

export async function writeData(filename, data) {
    await checkDir()
    const filePath = path.join(DATA_DIR, filename)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}