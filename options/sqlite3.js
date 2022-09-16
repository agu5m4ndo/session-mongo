const options = {
    client: 'sqlite3',
    connection: {
        filename: './DB/ecommerce.db3'
    },
    useNullAsDefault: true
}

module.exports = { options }