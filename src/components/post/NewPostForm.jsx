// src/components/post/NewPostForm.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';

const NewPostForm = ({ onCreatePost }) => {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      await onCreatePost(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 text-white rounded-md shadow-md p-4 mb-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-600 mb-4"
        rows="3"
      ></textarea>
      <button
        type="submit"
        className="bg-indigo-600 text-white rounded-md py-2 px-4 hover:bg-indigo-500"
      >
        Post
      </button>
    </form>
  );
};

NewPostForm.propTypes = {
  onCreatePost: PropTypes.func.isRequired,
};

export default NewPostForm;
