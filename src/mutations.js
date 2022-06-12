import { doc, updateDoc } from 'firebase/firestore';

export const updateActor = (db, id, patch) => {
  updateDoc(doc(db, "actors", id), patch)
}

