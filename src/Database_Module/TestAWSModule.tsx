import React, { ChangeEvent, useState } from 'react';
import AWS from 'aws-sdk';


const TestR2: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'application/pdf',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    // Add more supported types as needed
  ];

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setFile(selectedFile);
    } else {
      alert('Invalid file type. Only images and PDFs are allowed.');
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    setUploading(true);
    const S3_BUCKET = "healthcare"; // Replace with your bucket name
    const REGION = "auto"; // Replace with your region

    AWS.config.update({
      accessKeyId: "522146207badcf686b8b18f3812f8554",
      secretAccessKey: "a82dffeffda48e6b49edaaf957b8f1b18465d22ab715c59225a036f6d6170208",
    });

    const s3 = new AWS.S3({
      params: { Bucket: S3_BUCKET },
      region: REGION,
    });

    const params = {
      Bucket: S3_BUCKET,
      Key: file.name,
      Body: file,
    };

    try {
      const upload = await s3.upload(params).promise();
      console.log(upload);
      setUploading(false);
      alert("File uploaded successfully.");
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Error uploading file: " + error); // Inform user about the error
    }
  };

  return (
    <>
      <div className="">
        <input type="file" required onChange={handleFileChange} />
        <button onClick={uploadFile}>{uploading ? 'Uploading...' : 'Upload File'}</button>
      </div>
    </>
  );
};

export default TestR2;




// AWS.config.update({
//   accessKeyId: '522146207badcf686b8b18f3812f8554',
//   secretAccessKey: 'a82dffeffda48e6b49edaaf957b8f1b18465d22ab715c59225a036f6d6170208',
//   region: 'Asia-Pacific (APAC)'
// });


// {
//     '$metadata': {
//     httpStatusCode: 200,
//         requestId: undefined,
//         extendedRequestId: undefined,
//         cfId: undefined,
//         attempts: 1,
//         totalRetryDelay: 0
// },
//     Buckets: [
//     { Name: 'user-uploads', CreationDate: 2022-04-13T21:23:47.102Z },
//     { Name: 'my-bucket-name', CreationDate: 2022-05-07T02:46:49.218Z }
//     ],
//     Owner: {
//         DisplayName: '...',
//         ID: '...'
//     }
// }


// {
//     '$metadata': {
//       httpStatusCode: 200,
//       requestId: undefined,
//       extendedRequestId: undefined,
//       cfId: undefined,
//       attempts: 1,
//       totalRetryDelay: 0
//     },
//     CommonPrefixes: undefined,
//     Contents: [
//       {
//         Key: 'cat.png',
//         LastModified: 2022-05-07T02:50:45.616Z,
//         ETag: '"c4da329b38467509049e615c11b0c48a"',
//         ChecksumAlgorithm: undefined,
//         Size: 751832,
//         StorageClass: 'STANDARD',
//         Owner: undefined
//       },
//       {
//         Key: 'todos.txt',
//         LastModified: 2022-05-07T21:37:17.150Z,
//         ETag: '"29d911f495d1ba7cb3a4d7d15e63236a"',
//         ChecksumAlgorithm: undefined,
//         Size: 279,
//         StorageClass: 'STANDARD',
//         Owner: undefined
//       }
//     ],
//     ContinuationToken: undefined,
//     Delimiter: undefined,
//     EncodingType: undefined,
//     IsTruncated: false,
//     KeyCount: 8,
//     MaxKeys: 1000,
//     Name: 'my-bucket-name',
//     NextContinuationToken: undefined,
//     Prefix: undefined,
//     StartAfter: undefined
//   }