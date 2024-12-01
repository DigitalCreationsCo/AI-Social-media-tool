import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Facebook, Instagram, Linkedin, Twitter, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Platform } from '@/types/Social';

const SocialMediaPoster = ({ error, setError}: { error?: string; setError: any;}) => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ imageUrl: '', caption: '' });

  useEffect(() => {
    fetchPosts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to fetch posts');
    }
  };

  const handleInputChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  };

  const addPost = async () => {
    if (newPost.imageUrl && newPost.caption) {
      try {
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost),
        });
        if (response.ok) {
          await fetchPosts();
          setNewPost({ imageUrl: '', caption: '' });
          setError('');
        } else {
          setError('Failed to add post');
        }
      } catch (err) {
        setError('Failed to add post');
      }
    } else {
      setError('Please provide both an image URL and a caption.');
    }
  };

  const generateCaption = async () => {
    try {
      const response = await fetch('/api/ai/generate-caption', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: newPost.imageUrl }),
      });
      const data = await response.json();
      setNewPost({ ...newPost, caption: data.caption });
    } catch (err) {
      setError('Failed to generate caption');
    }
  };

  const shareToSocialMedia = async (platform: Platform, post) => {
    try {
      const response = await fetch(`/api/${platform.toLowerCase()}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      });
      if (response.ok) {
        alert(`Post shared to ${platform}!`);
      } else {
        setError(`Failed to share to ${platform}`);
      }
    } catch (err) {
      setError(`Failed to share to ${platform}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Social Media Poster</h1>
      
      <div className="mb-4">
        <Input
          type="text"
          name="imageUrl"
          value={newPost.imageUrl}
          onChange={handleInputChange}
          placeholder="Image URL"
          className="mb-2"
        />
        <div className="flex mb-2">
          <Textarea
            name="caption"
            value={newPost.caption}
            onChange={handleInputChange}
            placeholder="Caption"
            className="flex-grow mr-2"
          />
          <Button onClick={generateCaption} className="flex-shrink-0">
            <Wand2 className="mr-2 h-4 w-4" /> Generate
          </Button>
        </div>
        <Button onClick={addPost}>Add Post</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post: any, index) => (
          <Card key={post._id}>
            <CardHeader>
              <CardTitle>Post {index + 1}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={post.imageUrl} alt={`Post ${index + 1}`} className="w-full h-48 object-cover mb-2" />
              <p>{post.caption}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={() => shareToSocialMedia('instagram', post)} variant="outline">
                <Instagram className="mr-2 h-4 w-4" /> Instagram
              </Button>
              <Button onClick={() => shareToSocialMedia('facebook', post)} variant="outline">
                <Facebook className="mr-2 h-4 w-4" /> Facebook
              </Button>
              <Button onClick={() => shareToSocialMedia('linkedin', post)} variant="outline">
                <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
              </Button>
              <Button onClick={() => shareToSocialMedia('twitter', post)} variant="outline">
                <Twitter className="mr-2 h-4 w-4" /> Twitter
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaPoster;