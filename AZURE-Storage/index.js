
const { BlobServiceClient } = require("@azure/storage-blob");

const accountName = process.env.AZURE_STORAGE_CONNECTION_STRING;

module.exports = async function (context, req) {

    let responseMessage = { "status": "" }
    try {

        if (!accountName) throw Error('Azure Storage accountName not found');

        const blobServiceClient = BlobServiceClient.fromConnectionString(accountName);
        // Create a unique name for the container
        const containerName = 'sample-container';

        // Get a reference to a container
        const containerClient = blobServiceClient.getContainerClient(containerName);
        // Create a unique name for the blob
        const blobName = 'sample-textfile' + '.txt';

        // Get a block blob client
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);


        if (req.query.operation == "create container") {

            // Create the container
            const createContainerResponse = await containerClient.create();
            responseMessage.status = `Container was created successfully.\n\trequestId:${createContainerResponse.requestId}\n\tURL: ${containerClient.url}`;

        } else if (req.query.operation == "create blob") {

            // Display blob name and url
            console.log(
                `\nUploading to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blockBlobClient.url}`
            );

            // Upload data to the blob
            const data = 'Hello, World!';
            const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
            responseMessage.status = `Blob was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`;

        } else if (req.query.operation == "delete container") {
            // Delete container
            console.log('\nDeleting container...');

            const deleteContainerResponse = await containerClient.delete();
            responseMessage.status = `Container was deleted successfully. requestId: , ${deleteContainerResponse.requestId}`;

        } else if (req.query.operation == "delete blob") {
            // Delete container
            console.log('\nDeleting blob...');

            const deleteBlobResponse = await blockBlobClient.delete();
            responseMessage.status = `Blob was deleted successfully. requestId: , ${deleteBlobResponse.requestId}`;
        }
    } catch (error) {
        responseMessage.status = error;
    } finally {
        context.res = {
            body: responseMessage
        };
    }


}