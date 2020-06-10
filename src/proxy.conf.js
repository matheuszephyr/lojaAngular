const PROXY_CONFIG = [
    {
        context: ['/api'],
        target: 'https://localhost:44309/',
        secure: true,
        pathRewrite: {'^/api' : ''}
    }
];

module.exports = PROXY_CONFIG;