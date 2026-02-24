const Review = require('../models/mod-review')

const index_get = async (req, res) => {
    let reviews = await Review.find()
    for (var i = 0; i < reviews.length; i++)
    {
        const cutoff = 35
        if (reviews[i].content.length > cutoff)
        {
            reviews[i].content = reviews[i].content.slice(0, cutoff -1)
            reviews[i].content += "..."
        }
    }
    res.render('index', { reviews })
}

module.exports = {
    index_get
}