import { useState, useCallback } from 'react';
import { auth, db, storage } from "../firebaseConfig";
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useFirebaseUpload = () => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const uploadFile = useCallback(async (file, path) => {
        if (!file || !auth.currentUser) return null;

        try {
            setUploading(true);
            setError(null);
            
            const storageRef = ref(storage, `${path}/${auth.currentUser.uid}/${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            
            return url;
        } catch (err) {
            setError('Failed to upload file');
            console.error('Upload error:', err);
            return null;
        } finally {
            setUploading(false);
        }
    }, []);

    return { uploadFile, uploading, error };
};

export const useFirebaseDocument = (collectionName) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateDocument = useCallback(async (docId, data) => {
        if (!auth.currentUser) return null;

        try {
            setLoading(true);
            setError(null);
            
            await updateDoc(doc(db, collectionName, docId), data);
            return true;
        } catch (err) {
            setError('Failed to update document');
            console.error('Update error:', err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    const getDocument = useCallback(async (docId) => {
        if (!auth.currentUser) return null;

        try {
            setLoading(true);
            setError(null);
            
            const docRef = doc(db, collectionName, docId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (err) {
            setError('Failed to fetch document');
            console.error('Fetch error:', err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [collectionName]);

    return { updateDocument, getDocument, loading, error };
};