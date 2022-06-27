import * as R from 'ramda';
import { doc, setDoc, updateDoc } from 'firebase/firestore';

export const updateActor = (db, id, patch) => {
  if (id) {
    updateDoc(doc(db, 'actors', id), patch);
  }
};

export const setActors = (db, actors) => {
  const actorIds = R.keys(actors);
  R.map((id) => {
    const actor = R.prop(id, actors);
    if (id) {
      setDoc(doc(db, 'actors', id), actor);
    }
  }, actorIds);
};
