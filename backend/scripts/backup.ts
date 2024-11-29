import { exec } from 'child_process'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGODB_URI
const BACKUP_PATH = '/path/to/backup/directory'

const backupCommand = `mongodump --uri="${MONGO_URI}" --out="${BACKUP_PATH}/$(date +%Y-%m-%d_%H-%M-%S)"`

exec(backupCommand, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao fazer backup: ${error}`)
    return
  }
  console.log(`Backup concluído: ${stdout}`)
})

