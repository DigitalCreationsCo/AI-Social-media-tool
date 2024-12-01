import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ImageDescriptionComponent = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setIsLoading(true);
    setDescription('');

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('/api/ai/describe-image', {
        method: 'POST',
        body: formData,
      });

      console.info('response:', response);
      if (!response.ok) {
        throw new Error('Failed to get image description');
      }

      const data = await response.json();
      setDescription(data.description);
    } catch (error) {
      console.error('Error:', error);
      setDescription('Failed to get image description. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Image Description</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"
          />
          <Button type="submit" disabled={!image || isLoading} className="w-full">
            {isLoading ? 'Processing...' : 'Describe Image'}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        {description && (
          <div className="mt-4">
            <h3 className="font-semibold">Description:</h3>
            <p>{description}</p>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageDescriptionComponent;