
const flashUtil = require('../util/flashMessage')

const loadFlash = ((req, res, next) => {
    const flash = flashUtil.getFlash(req, res)
    res.locals.flash = flash
    next()
})

module.exports = {
    loadFlash
}