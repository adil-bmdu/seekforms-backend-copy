const cloudinary = require('cloudinary').v2;

// Cloudinary Configuration
const { CLOUDINARY_API_KEY, CLOUDINARY_NAME, CLOUDINARY_API_SECRET_KEY } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET_KEY
});
const generatePublicId = (originalFileName) => {
    const timestamp = Date.now();
    const fileExtension = originalFileName.split('.').pop(); // Get the file extension
    return `${timestamp}.${fileExtension}`; // Create a unique public ID
};
/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer to upload
 * @param {string} originalFileName - The original name of the file (without extension)
 * @param {Object} options - Additional options for the upload (optional)
 * @returns {Promise<Object>} - Resolves with the Cloudinary result
 */
const uploadToCloudinary = (fileBuffer, originalFileName, options = {}) => {
    const publicId = generatePublicId(originalFileName); // Generate public ID using original file name
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                public_id: publicId, // Use the original file name as the public ID
                resource_type: 'auto', // Auto-detect the resource type (image, video, etc.)
                ...options // Spread any additional options
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        ).end(fileBuffer);
    });
};


/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @returns {Promise<Object>} - Resolves with the deletion result
 */
const deleteFromCloudinary = async (publicId) => {
    try {
        console.log("Attempting to delete image with publicId:", publicId);
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        console.log("Deletion result:", result);
        return result;
    } catch (error) {
        console.error("Error deleting from Cloudinary:", error);
        throw error; // Rethrow the error after logging it
    }
};


module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};