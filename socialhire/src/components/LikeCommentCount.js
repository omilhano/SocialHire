import React, { useState, useEffect } from 'react';
import { Plus, PencilIcon, TrashIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { auth } from "../../firebaseConfig";
import { Timestamp } from 'firebase/firestore';
import PostModal from '../PostModal';


export const LikeCommentCount = ({
    postsId
}) => {

    const { updateDocument, getDocument, deleteDocument } = useFirebaseDocument('posts');

    const likeCount = (post) => {

    };
    const commentCount = (post) => {

    };
    

}
