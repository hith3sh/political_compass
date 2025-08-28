// Avatar utilities for user profile pictures

export interface Avatar {
  id: string;
  filename: string;
  name: string;
}

// Generate list of available avatars (memo_1.png to memo_35.png)
export const availableAvatars: Avatar[] = Array.from({ length: 35 }, (_, i) => {
  const num = i + 1;
  return {
    id: `memo_${num}`,
    filename: `memo_${num}.png`,
    name: `Avatar ${num}`
  };
});

// Get avatar by ID
export function getAvatarById(id: string): Avatar | undefined {
  return availableAvatars.find(avatar => avatar.id === id);
}

// Get random avatar
export function getRandomAvatar(): Avatar {
  const randomIndex = Math.floor(Math.random() * availableAvatars.length);
  return availableAvatars[randomIndex];
}

// Get avatar URL
export function getAvatarUrl(filename: string): string {
  return `/avatars/${filename}`;
}