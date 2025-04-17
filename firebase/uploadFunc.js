const {storage} = require('../firebase/index')
const { ref, uploadBytes, getDownloadURL, deleteObject } = require('firebase/storage');
const {v4: uuidv4} = require('uuid')

module.exports.uploadFiles = async(files) => {
    if(!files || files.length <= 0){throw new Error('No files');}
    const urls = []

    for(const file of files){
        const fileName = `uploads/${uuidv4()}-${file.originalname}`
        const storageRef = ref(storage,`${fileName}`);
        await uploadBytes(storageRef,file.buffer)
        const downloadUrl = await getDownloadURL(storageRef);
        urls.push({fileName:fileName,url:downloadUrl});
    }

    return urls;
}

module.exports.deleteFile = async(files) => {
    for(let file of files){
        const fileRef = ref(storage,file);
        await deleteObject(fileRef)
    }
}