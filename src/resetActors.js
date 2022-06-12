import * as R from 'ramda';
import { doc, setDoc } from 'firebase/firestore';

const actors = {
  '0vN9omexae7Er3Vykqy4': {
    type: 'AI',
    speed: 10,
    currentAction: 'scratch',
    name: 'Frank',
    maxHealth: 100,
    status: 'ALIVE',
  },
  '4tw88URV84CKxdnSHCbI': {
    status: 'ALIVE',
    currentAction: 'stabby',
    type: 'CHARACTER',
    speed: 15,
    name: 'Bob',
    target: '0vN9omexae7Er3Vykqy4',
    maxHealth: 100,
  },
  E7izsNG79NbFNRnHwI5s: {
    maxHealth: 200,
    name: 'Chard',
    speed: 10,
    status: 'ALIVE',
    type: 'AI',
    currentAction: 'scrappin',
  },
  Q1Q4lkNnhgos7Tge9kL3: {
    currentAction: 'lifegiver',
    target: 'Q1Q4lkNnhgos7Tge9kL3',
    name: 'Doggo',
    type: 'CHARACTER',
    maxHealth: 100,
    status: 'ALIVE',
    speed: 20,
  },
  VCFVh9ErOauQneNrThRI: {
    status: 'ALIVE',
    type: 'CHARACTER',
    name: 'Jojo',
    currentAction: 'stabby',
    maxHealth: 100,
    speed: 8,
    target: 'gfs0VRfAmwHHkPYrBr9L',
  },
  gfs0VRfAmwHHkPYrBr9L: {
    status: 'ALIVE',
    maxHealth: 100,
    name: 'Eeeevil',
    currentAction: 'stabby',
    type: 'AI',
    speed: 12,
  },
};
const actorIds = R.keys(actors);

export const resetActors = (db) => {
  console.log('reset');
  R.map((id) => {
    const actor = R.prop(id, actors);
    setDoc(doc(db, 'actors', id), actor);
  }, actorIds);
};
