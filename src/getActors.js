import { collection, query, where, onSnapshot } from "firebase/firestore";

export const watchActors = (db, onChange) => {
  const q = query(collection(db, "actors"));
  return onSnapshot(q, (querySnapshot) => {
    const actors = [];
    querySnapshot.forEach((doc) => {
      actors.push(doc.data().name);
    });
    onChange(actors);
  });
};
