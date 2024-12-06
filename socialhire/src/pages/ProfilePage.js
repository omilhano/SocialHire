import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import RemoveFriendModal from "../components/RemoveFriendModal";
import BlockUserModal from "../components/BlockUserModal";
import { UserPostsSection } from "../components/profile/UserPostsSection";
import { JobPostsSection } from "../components/profile/JobPostsSection";
import { UserExperiencesSection } from "../components/profile/UserExperiencesSection";

const ProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [blockStatus, setBlockStatus] = useState(null);
  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [userPosts, setUserPosts] = useState([]);
  const [userJobs, setUserJobs] = useState([]);
  const [userExperiences, setUserExperiences] = useState([]);
  const auth = getAuth();
  const loggedInUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userQuery = query(
          collection(db, "users"),
          where("username", "==", username)
        );
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          const profile = querySnapshot.docs[0].data();
          setProfileData(profile);
          checkFriendshipStatus(loggedInUserId, profile.userId);
          if (!profile.privateProfile || friendshipStatus === "friends") {
            fetchUserPosts(profile.userId);
            fetchUserJobs(profile.userId);
            fetchUserExperiences(profile.userId);
          }
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async (userId) => {
      try {
        const postsQuery = query(
          collection(db, "posts"),
          where("userId", "==", userId)
        );
        const postsSnapshot = await getDocs(postsQuery);
        const posts = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserPosts(posts);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    const fetchUserJobs = async (userId) => {
      try {
        const jobsQuery = query(
          collection(db, "jobs"),
          where("userId", "==", userId)
        );
        const jobsSnapshot = await getDocs(jobsQuery);
        const jobs = jobsSnapshot.docs.map((doc) => ({
          jobID: doc.id,
          ...doc.data(),
        }));
        setUserJobs(jobs);
      } catch (err) {
        console.error("Error fetching user jobs:", err);
      }
    };

    const fetchUserExperiences = async (userId) => {
      try {
        const experiencesQuery = query(
          collection(db, "experience"),
          where("userId", "==", userId)
        );
        const experiencesSnapshot = await getDocs(experiencesQuery);
        const experiences = experiencesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserExperiences(experiences);
      } catch (err) {
        console.error("Error fetching user experiences:", err);
      }
    };

    const checkFriendshipStatus = async (loggedInUserId, profileUserId) => {
      try {
        if (loggedInUserId === profileUserId) return;

        const connectionsQuery = query(
          collection(db, "Connections"),
          where("user_id", "in", [loggedInUserId, profileUserId]),
          where("connected_user_id", "in", [loggedInUserId, profileUserId])
        );
        const snapshot = await getDocs(connectionsQuery);

        if (!snapshot.empty) {
          const connection = snapshot.docs[0].data();
          if (connection.status === "blocked") {
            if (connection.user_id === loggedInUserId) {
              setBlockStatus("blocked");
            } else {
              setBlockStatus("blockedByOther");
            }
          } else {
            setFriendshipStatus(connection.status);
          }
        }
      } catch (err) {
        console.error("Error checking friendship status:", err);
      }
    };

    fetchProfile();
  }, [username, loggedInUserId, friendshipStatus]);

  const handleAddFriend = async () => {
    try {
      const connectionsCollectionRef = collection(db, "Connections");
      await addDoc(connectionsCollectionRef, {
        user_id: loggedInUserId,
        connected_user_id: profileData.userId,
        status: "pending",
        created_at: new Date(),
      });
      setFriendshipStatus("pending");
    } catch (err) {
      console.error("Error sending friend request:", err);
    }
  };

  const handleRemoveFriend = async () => {
    try {
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      const snapshot = await getDocs(connectionsQuery);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await deleteDoc(doc(db, "Connections", docId));
        setFriendshipStatus(null);
      }
    } catch (err) {
      console.error("Error removing friend:", err);
    }
  };

  const handleBlockUser = async () => {
    try {
      const connectionsQuery = query(
        collection(db, "Connections"),
        where("user_id", "in", [loggedInUserId, profileData.userId]),
        where("connected_user_id", "in", [loggedInUserId, profileData.userId])
      );
      const snapshot = await getDocs(connectionsQuery);

      if (!snapshot.empty) {
        const docId = snapshot.docs[0].id;
        await updateDoc(doc(db, "Connections", docId), { status: "blocked" });
      } else {
        await addDoc(collection(db, "Connections"), {
          user_id: loggedInUserId,
          connected_user_id: profileData.userId,
          status: "blocked",
          created_at: new Date(),
        });
      }

      setBlockStatus("blocked");
      setShowBlockUserModal(false);
    } catch (err) {
      console.error("Error blocking user:", err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!profileData) {
    return (
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Alert variant="warning">Profile not found</Alert>
      </Container>
    );
  }

  const isCurrentUserProfile = loggedInUserId === profileData.userId;

  return (
    <Container className="profile-container d-flex flex-column justify-content-center align-items-center">
      <div className="profile-image-wrapper">
        <img
          src={
            profileData.profileImageUrl ||
            `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&background=177b7b&color=ffffff`
          }
          alt={`${profileData.firstName} ${profileData.lastName}`}
          className="profile-image"
        />
      </div>

      <Card className="profile-card mt-3 shadow-sm">
        <Card.Body>
          <Card.Title className="text-center profile-card-title">
            {profileData.firstName} {profileData.lastName}
          </Card.Title>
          <Card.Text className="text-center">
            {profileData.headline}
          </Card.Text>
        </Card.Body>
      </Card>

      {!isCurrentUserProfile && (
        <div className="d-flex justify-content-center align-items-center mt-2">
          {friendshipStatus === "friends" && (
            <Button
              variant="outline-danger"
              onClick={() => setShowRemoveFriendModal(true)}
            >
              Remove Friend
            </Button>
          )}
          {friendshipStatus === "pending" && (
            <Button variant="secondary" disabled>
              Friend Request Sent
            </Button>
          )}
          {friendshipStatus === null && (
            <Button variant="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
          {blockStatus !== "blocked" && (
            <Button
              variant="danger"
              className="ms-2"
              onClick={() => setShowBlockUserModal(true)}
            >
              Block User
            </Button>
          )}
        </div>
      )}

      {(!profileData.privateProfile || friendshipStatus === "friends") && (
        <>
          <UserPostsSection posts={userPosts} />
          <JobPostsSection jobs={userJobs} />
          <UserExperiencesSection experiences={userExperiences} />
        </>
      )}

      {profileData.privateProfile && friendshipStatus !== "friends" && (
        <Card className="profile-card mt-3 shadow-sm">
          <Card.Body>
            <Card.Text className="text-center">
              This profile is private. Become friends to view more details.
            </Card.Text>
          </Card.Body>
        </Card>
      )}

      <BlockUserModal
        show={showBlockUserModal}
        onHide={() => setShowBlockUserModal(false)}
        onConfirm={handleBlockUser}
      />
    </Container>
  );
};

export default ProfilePage;
