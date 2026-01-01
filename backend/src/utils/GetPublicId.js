export const extractPublicId = (cloudinaryUrl) => {
  try {
    // Create a URL object to easily parse the path
    const url = new URL(cloudinaryUrl);
    const path = url.pathname; // e.g., /demo/image/upload/v1693456173/sample_folder/image_name.jpg

    // Find the index of "/upload/"
    const uploadIndex = path.indexOf('/upload/');
    if (uploadIndex === -1) return null;

    // Extract everything after "/upload/"
    let afterUpload = path.substring(uploadIndex + '/upload/'.length);

    // Remove versioning if present (starts with "v" followed by digits and a slash)
    afterUpload = afterUpload.replace(/^v\d+\//, '');

    // Remove file extension
    const lastDot = afterUpload.lastIndexOf('.');
    if (lastDot !== -1) {
      afterUpload = afterUpload.substring(0, lastDot);
    }

    return afterUpload;
  } catch (err) {
    return null;
  }
}
