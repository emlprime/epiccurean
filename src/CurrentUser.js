export const getCurrentUser = (firebase) => {
  return firebase.auth().currentUser
}
