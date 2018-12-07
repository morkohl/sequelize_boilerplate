const tknConfig = require('../../src/config').security.jwt.accessToken;

exports.authHeader = tknConfig.extract.header;

exports.authHeaderValue = (accessToken) => [tknConfig.extract.prefix, accessToken].join(' ');