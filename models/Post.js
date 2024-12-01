import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  imageUrl: String,
  caption: String,
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);