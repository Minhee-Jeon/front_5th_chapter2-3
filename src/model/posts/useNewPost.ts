import { useState } from 'react';

import { NewPost } from '../../entities/posts/model/NewPost';

import { initialNewPost } from './../../config/posts/initialData';

export const useNewPost = () => {
  const [newPost, setNewPost] = useState<NewPost>(initialNewPost);

  const updateNewPost = (key: string, value: string | number) => {
    setNewPost({ ...newPost, [key]: value });
  };

  const resetNewPost = () => {
    setNewPost(initialNewPost);
  };

  return { newPost, updateNewPost, resetNewPost };
};
