
module.exports = {
    secretKey: 'tctav-node-2018',
    server: {
        name: 'Workspace API',
        version: '1.0.0',
        strictRouting: true,
        port: 9000
    },
    database: {
        host: 'mongodb://dbws:123456@ds237660.mlab.com:37660',
        dbname: 'pro-api',
    },
    redis: {
        host: 'localhost',
        port: 6379,
        password: '123456'
    }
}