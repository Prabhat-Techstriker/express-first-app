const mongoose = require('mongoose');
const { Schema } = mongoose;

const ImageSchema = new Schema({
    image_url: {
        type: String,
        required: true,
    },
    imageId: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Image', ImageSchema);