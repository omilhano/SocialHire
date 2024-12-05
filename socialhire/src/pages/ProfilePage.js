import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Spinner, Alert, Card, Button } from "react-bootstrap";
import RemoveFriendModal from "../components/RemoveFriendModal";
import BlockUserModal from "../components/BlockUserModal"; // Import the Block User Modal
import { UserPostsSection } from "../components/profile/UserPostsSection"; // Import UserPostsSection
import { JobPostsSection } from "../components/profile/JobPostsSection"; // Import JobPostsSection


const ProfilePage = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [friendshipStatus, setFriendshipStatus] = useState(null);
  const [blockStatus, setBlockStatus] = useState(null);
  const [showRemoveFriendModal, setShowRemoveFriendModal] = useState(false);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false); // State for Block Modal
  const [userPosts, setUserPosts] = useState([]); // State for user's posts
  const [userJobs, setUserJobs] = useState([]); // State for user's jobs
  const [editMode, setEditMode] = useState(false); // Edit mode for posts
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
          fetchUserPosts(profile.userId); // Fetch user's posts
          fetchUserJobs(profile.userId); // Fetch user's jobs
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
  }, [username, loggedInUserId]);

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

  const handleBlockUser = () => {
    console.log("User has been blocked!");
    setShowBlockUserModal(false);
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
          <Card.Subtitle className="text-muted text-center profile-card-subtitle">
            {profileData.location}
          </Card.Subtitle>
          <Card.Text className="mt-3 text-center profile-card-text">
            {profileData.about}
          </Card.Text>
        </Card.Body>
      </Card>

      {!isCurrentUserProfile && (
        <div className="action-buttons">
          {friendshipStatus === "friends" && (
            <>
              <Button
                variant="danger"
                className="mt-3"
                onClick={() => setShowRemoveFriendModal(true)}
              >
                Remove Friend
              </Button>
              <RemoveFriendModal
                show={showRemoveFriendModal}
                onHide={() => setShowRemoveFriendModal(false)}
                onConfirm={() => {
                  handleRemoveFriend();
                  setShowRemoveFriendModal(false);
                }}
              />
            </>
          )}
          {friendshipStatus === null && (
            <Button className="follow-button mt-3" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
          {friendshipStatus === "pending" && (
            <Button className="follow-button mt-3" disabled>
              Request Pending
            </Button>
          )}
          {friendshipStatus !== "blocked" && (
            <Button
              variant="dark"
              className="mt-3"
              onClick={() => setShowBlockUserModal(true)}
            >
              Block User
            </Button>
          )}
        </div>
      )}
      <BlockUserModal
        show={showBlockUserModal}
        onHide={() => setShowBlockUserModal(false)}
        onConfirm={handleBlockUser}
      />

      {/* User Posts Section */}
      <UserPostsSection posts={userPosts} />

      {/* Job Posts Section */}
      <JobPostsSection jobs={userJobs} />
    </Container>
  );
};

export default ProfilePage;
