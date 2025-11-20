const memory = new Map(); // userId -> { persona }

export function getSettings(userId) {
  return memory.get(userId) ?? { persona: 'cool' };
}
export function setPersona(userId, persona) {
  memory.set(userId, { persona });
}
