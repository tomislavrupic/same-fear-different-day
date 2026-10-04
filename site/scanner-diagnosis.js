export function createDiagnosis(random = Math.random) {
  const roll = Math.floor(random() * 13);
  const percent = () => Math.floor(random() * 101);
  return { kind: roll === 0 ? 'd13' : roll <= 4 ? 'contamination' : 'human', brainRot: percent(), confusion: percent() };
}
