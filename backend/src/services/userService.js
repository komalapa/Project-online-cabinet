module.exports = {
    getUserByEmail: async (email) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    createUser: async (name, email, passwordHash, number) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "INSERT INTO users (name, email, password, phone_number) VALUES (?,?,?,?)",
            [name, email, passwordHash, number]);
    },

    getUserById: async (id) => {
        const pool = await require("../database/database").getConnectionPool();
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [id]
        );
        if (rows.length > 0) {
            return rows[0];
        } else {
            return undefined;
        }
    },

    updateUser: async(user) => {
        const pool = await require("../database/database").getConnectionPool();
        await pool.query(
            "UPDATE users SET name = ?, email = ?, password = ?, phone_number = ? WHERE id = ?",
            [user.name, user.email, user.password, user.phoneNumber, user.id ]
        );

        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE id = ?',
            [user.id]
        );

        return rows[0];
    }
}