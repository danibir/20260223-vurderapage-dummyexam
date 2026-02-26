const Review = require('../models/mod-review')

const index_get = async (req, res) => {
    let reviews = await Review.find()
    for (var i = 0; i < reviews.length; i++)
    {
        const cutoff = 35
        if (reviews[i].content.length > cutoff)
        {
            reviews[i].content = reviews[i].content.slice(0, cutoff)
            reviews[i].content += "..."
        }
        if (reviews[i].url.length > cutoff)
        {
            reviews[i].url = reviews[i].url.slice(0, cutoff)
            reviews[i].url += "..."
        }
    }
    reviews.sort((a, b) => (b.likes.length - b.dislikes.length * 0.3) - (a.likes.length - a.dislikes.length * 0.3))
    res.render('index', { reviews })
}

const faq_get = (req, res) => {
    res.render('faq')
}

module.exports = {
    index_get,
    faq_get
}