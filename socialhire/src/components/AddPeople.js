import React, {useEffect, useState} from 'react';
import { Card } from 'react-bootstrap';
import db from "../firebaseConfig";
import { doc, getDoc, updateDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const PeopleToBefriend = () => {
    const [randomUsers, setRandomUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch users collection
                const usersSnapshot = await getDocs(collection(db, "users"));
                const usersList = usersSnapshot.docs.map(doc => doc.data());
                
                // Select random users
                const randomUsersList = getRandomUsers(usersList, 3); // Select 3 random users
                setRandomUsers(randomUsersList);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);

    const getRandomUsers = (users, count) => {
        const shuffledUsers = [...users];
        for (let i = shuffledUsers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledUsers[i], shuffledUsers[j]] = [shuffledUsers[j], shuffledUsers[i]]; // Swap
        }
        return shuffledUsers.slice(0, count); // Get the top 'count' random users
    };

    return (
        <div className="people-to-befriend">
            <h2>People You May Know</h2>
            {randomUsers.map((user, index) => (
                <Card key={index} className="mb-3">
                    <Card.Body>
                        <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                        <Card.Text>{user.profession || 'Profession not available'}</Card.Text>
                        <button className="btn btn-primary">Add Friend</button>
                    </Card.Body>
                </Card>
            ))}
        </div>
    );
};

export default PeopleToBefriend;
