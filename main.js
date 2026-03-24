const express = require("express")
const db = require("./db")
const bcr = require("bcryptjs")
const app = express()
const SECRET = "dfgdgf"
const jwt = require("jsonwebtoken")
const res = require("express/lib/response")
app.use(express.json())
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization


    if (!authHeader) return res.status(401)
        .json({ error: "missing auth header" })
    const token = authHeader.split(" ")[1]
    if (!token) return res.status(401).json({ error: "wrong token format" })
    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (error) {
        console.error(error)

    }
}

app.get("/user", (req, res) => {
    const user = db.prepare("SELECT * FROM user").all()
    console.log(user);

    return res.status(200).json(user)
})

app.post("/api/auth/register", (req, res) => {
    const { email, username, password } = req.body
    try {
        if (!email || !username || !password)
            return res
                .status(400)
                .json({ error: "Не хватает папы" })
        const syncSalt = bcr.genSaltSync(10)
        const hashed = bcr.hashSync(password, syncSalt)
        const query = db.prepare(`INSERT INTO user (username, email, password, role) VALUES (?, ?, ?, ?)`).run(username, email, hashed, "user")
        const newUser = db.prepare("SELECT * FROM user WHERE id  = ?").get(query.lastInsertRowid)
        const { password: _, ...safeUser } = newUser
        res.status(201).json(safeUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: "Что-то пошло не так" })
    }
});

app.listen(3000)