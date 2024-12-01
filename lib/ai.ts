import { FileJSON } from "formidable";

export async function describeImage(image: FileJSON) {
    console.info('url ', process.env.AI_SERVER_URL);

    const formData = new FormData();

    const imageFile = await fetch(image.filepath).then(res => res.blob());
    formData.append('file', imageFile, image.originalFilename!);

    const response = await fetch(`${process.env.AI_SERVER_URL}/describe-image`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to describe image");
    }

    return response.json();
}

export async function generateCaptionWithAI(imageUrl: string) {
  return `AI-generated caption for image at ${imageUrl}`;
}