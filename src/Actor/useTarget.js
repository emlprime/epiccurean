export const useTarget = (stateControl) => {
  const [state, dispatch] = stateControl;

  
  return [target, setTarget];
}