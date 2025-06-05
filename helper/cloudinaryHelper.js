const cloudinary = require('./../config/cloudinary');
const Image = require('./../models/image');

const uploadImage = async (req, res) => {
    try {

        const result = await cloudinary.uploader.upload(req.path)


        if (!result) {
            return res.status(400).json({ message: 'Image upload failed' });
        }
        console.log('Image uploaded to Cloudinary Helper:', result);


        return {
            imageUrl: result.secure_url,
            imageId: result.public_id
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Error while uploading to cloudinary'); // Re-throw the error to be handled by the global error handler
        // res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { uploadImage }