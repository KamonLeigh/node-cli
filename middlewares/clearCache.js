const { clearhash } = require('../services/cache');


module.exports = async( req, res, next) => {
    await next();

    clearhash(req.user.id);
};