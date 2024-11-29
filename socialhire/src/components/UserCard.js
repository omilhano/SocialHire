import { useNavigate } from "react-router-dom";

const UserCard = ({ user }) => {
    const navigate = useNavigate();

    const handleViewProfile = () => {
        navigate(`/profile/${user.username}`);
    };

    return (
        <div className="user-card">
            <h3>{user.firstName} {user.lastName}</h3>
            <button onClick={handleViewProfile}>View Profile</button>
        </div>
    );
};

export default UserCard;
