import * as R from 'ramda';
import { setActors } from './mutations'

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
    type: 'CHARACTER',
    speed: 15,
    name: 'Bob',
    maxHealth: 100,
  },
  E7izsNG79NbFNRnHwI5s: {
    maxHealth: 100,
    name: 'Chard',
    speed: 10,
    status: 'ALIVE',
    type: 'AI',
    currentAction: 'scrappin',
  },
  Q1Q4lkNnhgos7Tge9kL3: {
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
    maxHealth: 100,
    speed: 8,
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

export const resetActors = (db) => {
  setActors(db, actors)
}