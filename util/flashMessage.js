function createFlashCookie(res, message, type = 'info') {
    const payload = JSON.stringify({ message, type })
    res.cookie('flash', payload, {
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 5000
    })
}

function getFlash(req, res) {
    if (!req.cookies?.flash) {
        return null
    }

    let data
    try {
        data = JSON.parse(req.cookies.flash)
    } catch {
        data = { message: req.cookies.flash, type: 'info' }
    }

    res.clearCookie('flash')
    return data
}

module.exports = { 
    createFlashCookie, 
    getFlash 
}
