import { doc, updateDoc } from 'firebase/firestore';

export const addWounds = (db, id, wounds) => {
  updateDoc(doc(db, "actors", id), {wounds})
}
