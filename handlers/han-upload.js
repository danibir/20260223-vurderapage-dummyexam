const Client = require("ssh2-sftp-client")
const fs = require("fs")
const path = require("path")

const imageserverIp = "10.12.15.23"

const uploadImageSFTP = async (localFilePath, originalName) => {
    const sftp = new Client()

    const ext = path.extname(originalName) || ".png"
    const random = Math.floor(Math.random() * 1e9)
    const filename = `${Date.now()}-${random}${ext}`

    try {
        await sftp.connect({
            host: imageserverIp,
            port: 22,
            username: "uploader",
            password: "passwd"
        })

        const remotePath = `/images/${filename}`
        await sftp.put(localFilePath, remotePath)
        sftp.end()
        fs.unlink(localFilePath, () => {})
        return `http://${imageserverIp}/images/${filename}`

    } catch (err) {
        console.error("sftp upload failed:", err)
        sftp.end()
        fs.unlink(localFilePath, () => {})
        throw err
    }
}
const deleteImageSFTP = async (imageUrl) => {
    const sftp = new Client()

    try {
        const filename = imageUrl.split('/').pop()
        const remotePath = `/images/${filename}`

        await sftp.connect({
            host: imageserverIp,
            port: 22,
            username: "uploader",
            password: "passwd"
        })

        await sftp.delete(remotePath)
        sftp.end()
    } catch (err) {
        console.error("sftp delete failed:", err)
        sftp.end()
    }
}

module.exports = { 
    uploadImageSFTP,
    deleteImageSFTP
}
