    const Client = require("ssh2-sftp-client")
    const fs = require("fs")
    const os = require('os')
    const path = require("path")

    const imageserverIp = "10.12.15.23"

    let privateKey = null
    try{
        const privateKeyPath = path.join(os.homedir(), ".ssh", "sftp_node_key")
        privateKey = fs.readFileSync(privateKeyPath)
    } catch (err) {}

    const uploadImageSFTP = async (localFilePath, originalName) => {
        const sftp = new Client()

        const ext = path.extname(originalName) || ".png"
        const random = Math.floor(Math.random() * 1e9)
        const filename = `${Date.now()}-${random}${ext}`

        try {
            const connectConfig = await sftp.connect({
                host: imageserverIp,
                port: 22,
                username: "uploader",
                password: "passwd"
            })
            if (privateKey) { 
                connectConfig.privateKey = privateKey 
            }

            const remotePath = `/images/${filename}`
            await sftp.put(localFilePath, remotePath)
            sftp.end()
            fs.unlink(localFilePath, () => {})
            return `http://${imageserverIp}/images/${filename}`
        } catch (err) {
            console.error("sftp upload failed:", err)
            if (sftp.sftp) { 
                await sftp.end() 
            }
            fs.unlink(localFilePath, () => {})
            throw err
        }
    }
    const deleteImageSFTP = async (imageUrl) => {
        const sftp = new Client()

        try {
            const filename = imageUrl.split('/').pop()
            const remotePath = `/images/${filename}`

            const connectConfig = await sftp.connect({
                host: imageserverIp,
                port: 22,
                username: "uploader",
                password: "passwd"
            })
            if (privateKey) { 
                connectConfig.privateKey = privateKey 
            }

            await sftp.delete(remotePath)
            sftp.end()
        } catch (err) {
            console.error("sftp delete failed:", err)
            if (sftp.sftp) { 
                await sftp.end() 
            }
            throw err
        }
    }

    module.exports = { 
        uploadImageSFTP,
        deleteImageSFTP
    }
