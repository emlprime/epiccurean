import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const watchActors = (db, onChange) => {
  const q = query(collection(db, 'actors'));
  return onSnapshot(q, (querySnapshot) => {
    const actors = {};
    querySnapshot.forEach((doc) => {
      const actor = doc.data()
      actors[doc.id] = actor;
    });
    onChange(actors);
  });
};
