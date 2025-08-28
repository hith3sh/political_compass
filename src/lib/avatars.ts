// Avatar utilities for user profile pictures

export interface Avatar {
  id: string;
  filename: string;
  name: string;
}

// Available political figures as avatars
export const availableAvatars: Avatar[] = [
  { id: 'anura', filename: 'anura.jpg', name: 'Anura Kumara Dissanayake' },
  { id: 'anurudda', filename: 'anurudda.jpg', name: 'Anurudda' },
  { id: 'bruno', filename: 'bruno.jpeg', name: 'Bruno Diwakara' },
  { id: 'carlo', filename: 'carlo.jpg', name: 'Carlo' },
  { id: 'chinthana', filename: 'chinthana.jpg', name: 'Chinthana Dharmadasa' },
  { id: 'dayan', filename: 'dayan.jpg', name: 'Dayan Jayatilleka' },
  { id: 'deepthi', filename: 'deepthi.jpg', name: 'Deepthi Kumara' },
  { id: 'eranda', filename: 'eranda.jpg', name: 'Eranda Ginige' },
  { id: 'harini', filename: 'harini.jpg', name: 'Harini Amarasooriya' },
  { id: 'iraj', filename: 'iraj.jpg', name: 'Iraj' },
  { id: 'jr', filename: 'JR.jpg', name: 'J.R. Jayewardene' },
  { id: 'mahinda', filename: 'mahinda.jpeg', name: 'Mahinda Rajapaksa' },
  { id: 'mathini', filename: 'mathini.jpg', name: 'Mathini' },
  { id: 'melani', filename: 'melani.jpeg', name: 'Melani Gunathilake' },
  { id: 'nalin', filename: 'nalin.jpg', name: 'Nalin De Silva' },
  { id: 'nirmal', filename: 'nirmal_dewasiri.jpg', name: 'Nirmal Dewasiri' },
  { id: 'pubudu', filename: 'pubudu_jagoda.jpg', name: 'Pubudu Jagoda' },
  { id: 'ranil', filename: 'ranil.jpg', name: 'Ranil Wickremesinghe' },
  { id: 'sajith', filename: 'sajithpremadasa.jpg', name: 'Sajith Premadasa' },
  { id: 'sandakath', filename: 'sandakath.jpg', name: 'Sandakath Mahagamaarachchi' },
  { id: 'sarath', filename: 'Sarath_Wijesuriya.jpg', name: 'Sarath Wijesuriya' },
  { id: 'shiral', filename: 'shiral_lakthilaka.jpg', name: 'Shiral Lakthilaka' },
  { id: 'swrd', filename: 'swrd.jpg', name: 'S.W.R.D. Bandaranaike' },
  { id: 'thamalu', filename: 'thamalu.jpg', name: 'Thamalu Piyadigama' },
  { id: 'tilvin', filename: 'tilvin.jpg', name: 'Tilvin Perera' },
  { id: 'upali', filename: 'upali_kohomban.jpg', name: 'Upali Kohomban' },
  { id: 'wangeesa', filename: 'wangeesa.jpeg', name: 'Wangeesa Sumanasekara' },
  { id: 'wimal', filename: 'wimal_weerawansa.jpg', name: 'Wimal Weerawansa' }
];

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
  return `/people/${filename}`;
}