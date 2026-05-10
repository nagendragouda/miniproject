import * as fs from 'fs'
import * as path from 'path'

const DB_DIR = path.join(process.cwd(), '.dev-data')
const DB_FILE = path.join(DB_DIR, 'user-details.json')

// Ensure directory exists
function ensureDbDir() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
}

// Read all records
function readDb(): Record<string, any> {
  ensureDbDir()
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.warn('⚠️  Failed to read local database:', err)
  }
  return {}
}

// Write all records
function writeDb(data: Record<string, any>) {
  ensureDbDir()
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    console.error('❌ Failed to write to local database:', err)
    throw err
  }
}

export const localDb = {
  async selectAll() {
    const db = readDb()
    return {
      data: db,
      error: null
    }
  },

  // Get single record by user_id
  async select(userId: string) {
    const db = readDb()
    const record = db[userId]
    return {
      data: record || null,
      error: null
    }
  },

  // Insert new record
  async insert(record: any) {
    const userId = record.user_id
    const db = readDb()

    const normalizeText = (value: string) => (value || '').trim().replace(/\s+/g, ' ').toLowerCase()
    const normalizeEmail = (value: string) => (value || '').trim().toLowerCase()
    const normalizePhone = (value: string) => (value || '').replace(/\D/g, '')

    const incoming = {
      username: normalizeText(record.username || ''),
      institution_name: normalizeText(record.institution_name || ''),
      email: normalizeEmail(record.email || ''),
      phone_number: normalizePhone(record.phone_number || '')
    }
    
    if (db[userId]) {
      return {
        data: null,
        error: { message: 'Record already exists' }
      }
    }

    for (const existing of Object.values(db) as any[]) {
      if (!existing) continue

      const existingNormalized = {
        username: normalizeText(existing.username || ''),
        institution_name: normalizeText(existing.institution_name || ''),
        email: normalizeEmail(existing.email || ''),
        phone_number: normalizePhone(existing.phone_number || '')
      }

      if (
        (incoming.username && incoming.username === existingNormalized.username) ||
        (incoming.institution_name && incoming.institution_name === existingNormalized.institution_name) ||
        (incoming.email && incoming.email === existingNormalized.email) ||
        (incoming.phone_number && incoming.phone_number === existingNormalized.phone_number)
      ) {
        return {
          data: null,
          error: { message: 'Duplicate value detected for unique profile fields' }
        }
      }
    }

    db[userId] = {
      ...record,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    writeDb(db)
    return {
      data: [db[userId]],
      error: null
    }
  },

  // Update existing record
  async update(userId: string, updates: any) {
    const db = readDb()

    const normalizeText = (value: string) => (value || '').trim().replace(/\s+/g, ' ').toLowerCase()
    const normalizeEmail = (value: string) => (value || '').trim().toLowerCase()
    const normalizePhone = (value: string) => (value || '').replace(/\D/g, '')
    
    if (!db[userId]) {
      return {
        data: null,
        error: { message: 'Record not found' }
      }
    }

    const incoming = {
      username: normalizeText(updates.username || ''),
      institution_name: normalizeText(updates.institution_name || ''),
      email: normalizeEmail(updates.email || ''),
      phone_number: normalizePhone(updates.phone_number || '')
    }

    for (const [id, existing] of Object.entries(db) as [string, any][]) {
      if (!existing || id === userId) continue

      const existingNormalized = {
        username: normalizeText(existing.username || ''),
        institution_name: normalizeText(existing.institution_name || ''),
        email: normalizeEmail(existing.email || ''),
        phone_number: normalizePhone(existing.phone_number || '')
      }

      if (
        (incoming.username && incoming.username === existingNormalized.username) ||
        (incoming.institution_name && incoming.institution_name === existingNormalized.institution_name) ||
        (incoming.email && incoming.email === existingNormalized.email) ||
        (incoming.phone_number && incoming.phone_number === existingNormalized.phone_number)
      ) {
        return {
          data: null,
          error: { message: 'Duplicate value detected for unique profile fields' }
        }
      }
    }

    db[userId] = {
      ...db[userId],
      ...updates,
      updated_at: new Date().toISOString()
    }

    writeDb(db)
    return {
      data: db[userId],
      error: null
    }
  },

  // Delete record
  async delete(userId: string) {
    const db = readDb()
    delete db[userId]
    writeDb(db)
    return {
      data: null,
      error: null
    }
  }
}
