import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';
import { FormData, Blob } from 'formdata-node';
import { fileFromPath } from 'formdata-node/file-from-path';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const client = new OpenAI(
  {
  baseURL: process.env['AI_SERVER_URL'],
  apiKey: process.env['OPENAI_API_KEY'] || 'llama_cpp',
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable();

  form.parse(req, async (err, fields, files) => {

    let tempFilePath = null;
    
    try {
    if (err) {
      throw new Error('Error processing the upload');
    }

    const file = files['image']?.[0];
    if (!file) {
      throw new Error('No file uploaded');
    }
    tempFilePath = file.filepath;

      const formData = new FormData();
      const fileObject = await fileFromPath(file.filepath, file.originalFilename!, { type: file.mimetype! });
      formData.set('file', fileObject);

      console.info('Sending file to AI server...');

      const response = await client.chat.completions.create({
        // completitions
        // prompt: 'Please describe the image in the following text box:',
        // { body: formData }

        model: 'vision-preview',
        messages: [
          {"role": "system", "content": "You are an assistant who perfectly describes images."},
          {
              "role": "user",
              "content": [
                  {"type" : "text", "text": "What's in this image?"},
                {"type": "image_url", "image_url": { "url": 'https://static.wixstatic.com/media/d79ad5_17efe3cfeae741f3947b61fc06fea3cd.jpg/v1/fill/w_976,h_581,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/d79ad5_17efe3cfeae741f3947b61fc06fea3cd.jpg' }} 
              ]
            }], 
          }
  );

      const result = await response;
      console.info('result:', result);  

      res.status(200).json(result);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error processing the request' });
    } finally {
      if (tempFilePath) {
        // Clean up: delete the temp file
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      }
    }
  });
}


// import formidable from 'formidable';
// import fs from 'fs';
// import fetch from 'node-fetch';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const form = formidable();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ message: 'Error processing the upload' });
//     }

//     const file = files['image']![0];
//     if (!file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }

//     try {
//       // const fileData = fs.readFileSync(file.filepath);
//       // console.info('File data:', fileData);

//       // const formData = new URLSearchParams();
      
//       // formData.append('file', fileData.toString('base64'));
//       // formData.append('filename', file.originalFilename || 'upload.file');

//       // Create a read stream from the file
//       const fileStream = fs.createReadStream(file.filepath);

//       // Create a new FormData instance
//       const formData = new FormData();
      
//       // Append the file stream to the FormData
//       formData.append('file', fileStream as any, file.originalFilename || 'upload.file');

//       console.info('formData:', formData);

//       const response = await fetch(`${process.env.AI_SERVER_URL}/describe-image`, {
//         method: 'POST',
//         body: formData,
//         headers: formData.getHeaders(),
//       });

//       console.info('Response:', response);
//       console.info('Response status:', response.status);
//       if (!response.ok) {
//         throw new Error('External API request failed');
//       }

//       const result = await response.json();
//       res.status(200).json(result);
//     } catch (error) {
//       console.error('Error:', error);
//       res.status(500).json({ message: 'Error processing the request' });
//     } finally {
//       // Clean up: delete the temp file
//       fs.unlinkSync(file.filepath);
//     }
//   });
// }