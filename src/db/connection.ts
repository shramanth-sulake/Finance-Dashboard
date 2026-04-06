import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';

const dbPath = process.env.NODE_ENV === 'test' 
  ? ':memory:' 
  : path.join(__dirname, '../../database.sqlite');

const db = new Database(dbPath, { 
    verbose: process.env.NODE_ENV !== 'production' ? console.log : undefined 
});

// Enable modern SQLite features
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export default db;
