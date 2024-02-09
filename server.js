// index.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Import path module

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// MongoDB Connection URL
const mongoURI = 'mongodb://localhost:27017/blog.blogs';

// Connect to MongoDB using Mongoose
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Define BlogPost model
const BlogPost = mongoose.model('BlogPost', {
    title: String,
    body: String,
    author: String,
    timestamp: { type: Date, default: Date.now }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoints
// Create a new blog post
app.post('/blogs', async (req, res) => {
    const { title, body, author } = req.body;
    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
    }
    try {
        const newPost = await BlogPost.create({ title, body, author });
        res.status(201).json(newPost);
    } catch (err) {
        console.error('Error creating blog post:', err);
        res.status(500).json({ message: 'Failed to create blog post' });
    }
});

// Retrieve all blog posts
app.get('/blogs', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find({});
        res.json(blogPosts);
    } catch (err) {
        console.error('Error fetching blog posts:', err);
        res.status(500).json({ message: 'Failed to fetch blog posts' });
    }
});

// Retrieve a single blog post by ID
app.get('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blogPost = await BlogPost.findById(id);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(blogPost);
    } catch (err) {
        console.error('Error fetching blog post:', err);
        res.status(500).json({ message: 'Failed to fetch blog post' });
    }
});

// Update a blog post by ID
app.put('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    const { title, body, author } = req.body;
    if (!title || !body) {
        return res.status(400).json({ message: 'Title and body are required' });
    }
    try {
        const updatedPost = await BlogPost.findByIdAndUpdate(id, { title, body, author }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json(updatedPost);
    } catch (err) {
        console.error('Error updating blog post:', err);
        res.status(500).json({ message: 'Failed to update blog post' });
    }
});

// Delete a blog post by ID
app.delete('/blogs/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await BlogPost.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Blog post not found' });
        }
        res.json({ message: 'Blog post deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog post:', err);
        res.status(500).json({ message: 'Failed to delete blog post' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

