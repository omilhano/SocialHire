import { useState, useCallback } from 'react';
import { auth, db, storage } from "../firebaseConfig";
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, query, where, getDocs, deleteDoc} from 'firebase/firestore';
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

    const updateDocument = useCallback(async (collectionName, docId, data) => {
        if (!auth.currentUser) return null;
        console.log("Experience data:", data); // Debug log
        console.log("Experience Id:", docId); // Debug log
        
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

    const getDocument = useCallback(async (collectionName, docId) => {
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

    const getDocumentsByUserId = useCallback(
        async (collectionName, userId) => {
            if (!userId) return null;

            try {
                setLoading(true);
                setError(null);

                // Create a reference to the collection and apply the query filter
                const collectionRef = collection(db, collectionName);
                const q = query(collectionRef, where("userId", "==", userId));

                // Execute the query
                const querySnapshot = await getDocs(q);

                // Map through the query results and retrieve data from each document
            const documents = querySnapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Document data:", data); // Debug log
                return {
                    id: doc.id,
                    ...data,
                    startDate: data.startDate ? data.startDate.toDate() : null,
                    endDate: data.endDate ? data.endDate.toDate() : null,
                };
            });

                console.log("Experiences:", documents); // Debug log

                return documents; // Returns an array of documents that match the userId
            } catch (err) {
                setError("Failed to fetch documents");
                console.error("Fetch error:", err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [collectionName]
    );

    const addDocument = async (collectionName, docId = null, data) => {
        if (typeof data !== 'object' || data === null) {
            console.error("Invalid data provided. Data must be a non-null object.");
            return { success: false, error: "Data must be a non-null object" };
        }
        console.log("Experience data being sent to addDocument:", docId); // Debug log
        console.log("Experience data being sent to addDocument:", data); 

        try {
            // Create a document reference based on whether a `docId` is provided
            const docRef = docId 
                ? doc(db, collectionName, docId) 
                : await addDoc(collection(db, collectionName), data);
    
            // If updating an existing document, use setDoc; otherwise, addDoc already added the document
            if (docId) await setDoc(docRef, data);
    
            console.log("Document successfully added or updated with ID:", docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Error adding document:", error);
            return { success: false, error: "Failed to add document" };
        }
    };

    const deleteDocument = async (collectionName, docId) => {
        if (!docId || typeof docId !== 'string') {
            console.error("Invalid document ID provided. A non-empty string ID is required.");
            return { success: false, error: "A valid document ID is required" };
        }
    
        try {
            const docRef = doc(db, collectionName, docId);
            console.log("Deleting document at:", docRef.path);
            await deleteDoc(docRef);
            console.log("Document successfully deleted with ID:", docId);
            return { success: true };
        } catch (error) {
            console.error("Error deleting document:", error.code, error.message);
            return { success: false, error: error.message };
        }
    };

    return { updateDocument, getDocument, getDocumentsByUserId, addDocument, deleteDocument, loading, error };
};