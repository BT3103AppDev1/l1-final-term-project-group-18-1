import { db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

async function sendFriendRequest(userId, friendId) {
  const requestId = userId < friendId ? `${userId}_${friendId}` : `${friendId}_${userId}`;

  await setDoc(doc(db, 'friendRequests', requestId), {
    from: userId,
    to: friendId,
    status: 'pending', 
    createdAt: new Date() 
  });
}

export { sendFriendRequest };
