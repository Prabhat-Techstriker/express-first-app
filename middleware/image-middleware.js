const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'my-uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const checkfilefilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb(new Error('Not an image. Please uipload only image.'))
    }
}

module.exports = multer({
    storage: storage, fileFilter: checkfilefilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})