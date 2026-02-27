const Review = require('../models/mod-review')
const User = require('../models/mod-user')
const upload = require("../handlers/han-upload")
const { createFlashCookie } = require('../util/flashMessage')

const create_get = (req, res) => {
    res.render('reviewcreate')
}
const create_post = async (req, res) => {
    try {
        const reviewData = { ...req.body, op: req.user.username }

        if (req.file) {
            const localPath = req.file.path
            reviewData.imageurl = await upload.uploadImageSFTP(localPath, req.file.originalname)
        }

        const review = new Review(reviewData)
        await review.save()

        let user = await User.findOne({ username: req.user.username })
        user.posts.push(review._id) 
        await user.save()

        createFlashCookie(res, 'Publiserte vurdering!', 'success')
        res.redirect('/')
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt under lagring av vurderingen.', 'error')
        res.redirect('/review/create')
    }
}

const view_get = async (req, res) => {
    try {
        const _id = req.params._id
        const review = await Review.findOne({ _id })
        res.render('reviewview', { review })
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect('/')
    }
}

const delete_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username
        let review = await Review.findOne({ _id })

        if (!review) {
            createFlashCookie(res, 'Kunne ikke finne vurdering.', 'error')
            return res.redirect(`/review/view/${_id}`)
        }
        if (review.op != username && req.user.isAdmin == false) {
            createFlashCookie(res, 'Ikke autorisert til å slette vurdering.', 'error')
            return res.redirect(`/review/view/${_id}`)
        } 
        if (review.imageurl) { 
            await upload.deleteImageSFTP(review.imageurl)
        }
        
        review = await Review.deleteOne({ _id })
        
        const user = await User.findOne({ username })
        user.posts = user.posts.filter(item => item !== _id)
        await user.save()
        createFlashCookie(res, 'Slettet vurdering!', 'success')
        res.redirect(`/`)
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt under lagring av vurderingen.', 'error')
        res.redirect(`/review/view/${_id}`)
    }
}

const like_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username

        const review = await Review.findOne({ _id })
        const user = await User.findOne({ username })       
        if (!review) {
            createFlashCookie(res, 'Kunne ikke finne vurdering.', 'error')
            return res.redirect(`/review/view/${_id}`)
        }
        if (review.op == username) {
            createFlashCookie(res, 'Ikke authorisert til å stemme; du kan ikke stemme på din egen vurdering!', 'error')
            return res.redirect(`/review/view/${_id}`)
        }
        
        const alreadyLiked = review.likes.some(id => id.toString() === user._id.toString())
        
        if (!alreadyLiked) {
            review.likes.push(user._id)
            review.dislikes = review.dislikes.filter(id => id.toString() !== user._id.toString())
            createFlashCookie(res, 'Likte vurdering.', 'success')
        } else {
            review.likes = review.likes.filter(id => id.toString() !== user._id.toString())
            createFlashCookie(res, 'U-likte vurdering.', 'success')
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect('/')
    }
}
const dislike_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username

        const review = await Review.findOne({ _id }) 
        const user = await User.findOne({ username })       
        if (!review) {
            createFlashCookie(res, 'Kunne ikke finne vurdering.', 'error')
            return res.redirect('/')
        }
        if (review.op == username) {
            createFlashCookie(res, 'Ikke authorisert til å stemme; du kan ikke stemme på din egen vurdering!', 'error')
            return res.redirect('/')
        }
        const alreadyDisliked = review.dislikes.some(id => id.toString() === user._id.toString())
        
        if (!alreadyDisliked) {
            review.dislikes.push(user._id)
            review.likes = review.likes.filter(id => id.toString() !== user._id.toString())
            createFlashCookie(res, 'Mislikte vurdering.', 'success')
        } else {
            review.dislikes = review.dislikes.filter(id => id.toString() !== user._id.toString())
            createFlashCookie(res, 'U-mislikte vurdering.', 'success')
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect('/')
    }
}

const report_post = async (req, res) => {
    try {
        const _id = req.params._id
        const username = req.user.username

        const review = await Review.findOne({ _id }) 
        const user = await User.findOne({ username })       
        if (!review) {
            createFlashCookie(res, 'Kunne ikke finne vurdering.', 'error')
            return res.redirect('/')
        }
        if (review.op == username) {
            createFlashCookie(res, 'Ikke authorisert til å reporte vurdering.', 'error')
            return res.redirect('/')
        }
        const alreadyReported = review.reports.some(id => id.toString() === user._id.toString())
        
        if (!alreadyReported) {
            review.reports.push(user._id)
            createFlashCookie(res, 'Rapportert vurdering.', 'success')
        } else {
            createFlashCookie(res, 'Error; du har allerede rapportert vurderingen.', 'error')
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect('/')
    }
}

const reports_get = async (req, res) => {
    let reviews = await Review.find({ reports: { $not: { $size: 0 } } })
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
    reviews.sort((a, b) => (b.reports.length) - (a.reports.length))
    res.render('reviewreports',  { reviews })
}

const dismiss_post = async (req, res) => {
    try {
        const _id = req.params._id

        const review = await Review.findOne({ _id })        
        if (!review) {
            createFlashCookie(res, 'Kunne ikke finne vurdering.', 'error')
            return res.redirect('/')
        }
        
        if (review.reports.length > 0) {
            review.reports = []
            createFlashCookie(res, 'Autentiserte vurderingen!.', 'success')
        } else {
            createFlashCookie(res, 'Vurderingen er allerede autentisk.', 'Info')
        }
        await review.save()
        res.redirect(`/review/view/${_id}`)
    } catch (err) {
        console.log(err)
        createFlashCookie(res, 'Error, noe gikk galt.', 'error')
        res.redirect('/')
    }
}

module.exports = {
    create_get,
    create_post,
    view_get,
    delete_post,
    like_post,
    dislike_post,
    report_post,
    dismiss_post,
    reports_get
}