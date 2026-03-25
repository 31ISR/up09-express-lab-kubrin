const Database = require("better-sqlite3")

const db = new Database("database.db")

db.prepare(`
    CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        
    )
    `).run()

    db.prepare(`
        CREATE TABLE IF NOT EXISTS book (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tittle TEXT NOT NULL,
            author TEXT NOT NULL,
            year INTEGER NOT NULL,
            genre TEXT NOT NULL,
            description TEXT NOT NULL,
            createdBy INTEGER NOT NULL,
            createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (createdBy) REFERENCES user(id)

        )
    `).run()

    db.prepare(`
        CREATE TABLE IF NOT EXISTS review (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            bookId INTEGER NOT NULL,
            
            userId INTEGER NOT NULL,
            
            rating INTEGER CHECK(rating>=1 and rating <=5),
            comment TEXT NOT NULL,
            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (bookId) REFERENCES book(id),
            FOREIGN KEY (userId) REFERENCES user(id)
        )
    `).run()

module.exports = db