module.exports = {
    getAddresses: async(userId) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM addresses WHERE user_id = ?',
                [userId]
            );

            return rows;
        } finally {
            connection.release();
        }
    },

    getAddressById: async(userId, addressId) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM addresses WHERE user_id = ? AND id = ?',
                [userId, addressId]
            );

            if (rows.length > 0) {
                return rows[0];
            } else {
                return undefined;
            }
        } finally {
            connection.release();
        }
    },

    createAddress: async(userId, address, apartments, fias) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "INSERT INTO addresses (user_id, address, apartments, fias_code) " +
                "VALUES (?,?,?,?)",
                [userId, address, apartments, fias]);

            const [rows] = await connection.query("SELECT LAST_INSERT_ID() AS newId");
            const id = rows[0].newId;

            return await module.exports.getAddressById(userId, id);
        } finally {
            connection.release();
        }
    },

    updateAddress: async(address) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "UPDATE addresses SET address = ?, apartments = ?, fias_code = ? WHERE id = ? AND user_id = ?",
                [address.address, address.apartments, address.fias, address.id, address.userId]
            );
            const [rows] = await connection.execute(
                'SELECT * FROM addresses WHERE id = ?',
                [address.id]
            );

            return rows[0];
        } finally {
            connection.release();
        }
    },

    deleteAddresses: async(addressId, userId) => {
        const pool = await require("../database/database").getConnectionPool();
        const connection = await pool.getConnection();
        try {
            await connection.query(
                "DELETE FROM addresses WHERE id = ? AND user_id = ?",
                [addressId, userId]
            );
        } finally {
            connection.release();
        }
    }
}