import { Question } from '../lib/types';

export const questions: Question[] = [
  // Economic Questions (12 questions)
  {
    id: 1,
    text: {
      en: "A company should be able to hire and fire employees without government interference.",
      si: "සමාගමකට රජයේ මැදිහත්වීමකින් තොරව සේවකයන් බඳවා ගැනීමට සහ සේවයෙන් පහ කිරීමට හැකි විය යුතුය."
    },
    category: 'economic'
  },
  {
    id: 2,
    text: {
      en: "Free markets should be regulated to protect workers and consumers.",
      si: "කම්කරුවන් සහ පාරිභෝගිකයන් ආරක්ෂා කිරීම සඳහා නිදහස් වෙලඳපල නියාමනය කළ යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 3,
    text: {
      en: "Private healthcare is more efficient than government-run healthcare.",
      si: "රජය විසින් පවත්වාගෙන යනු ලබන සෞඛ්‍ය සේවාවට වඩා පුද්ගලික සෞඛ්‍ය සේවාව වඩා කාර්යක්ෂම ය."
    },
    category: 'economic'
  },
  {
    id: 4,
    text: {
      en: "The government should provide universal basic income to all citizens.",
      si: "රජය සියලුම පුරවැසියන්ට විශ්වීය මූලික ආදායමක් ලබා දිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 5,
    text: {
      en: "High taxes on the wealthy are necessary for a fair society.",
      si: "සාධාරණ සමාජයක් සඳහා ධනවතුන්ට ඉහළ බදු අවශ්‍ය වේ."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 6,
    text: {
      en: "Private property rights are fundamental to economic freedom.",
      si: "ආර්ථික නිදහස සඳහා පුද්ගලික දේපල අයිතිවාසිකම් මූලික වේ."
    },
    category: 'economic'
  },
  {
    id: 7,
    text: {
      en: "Labor unions do more harm than good to the economy.",
      si: "කම්කරු සංගම් ආර්ථිකයට යහපත්ට වඩා අහිතකර ය."
    },
    category: 'economic'
  },
  {
    id: 8,
    text: {
      en: "The government should own and control major industries.",
      si: "රජය ප්‍රධාන කර්මාන්ත හිමි කර ගෙන පාලනය කළ යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 9,
    text: {
      en: "Free trade benefits all countries involved.",
      si: "නිදහස් වෙළඳාම සම්බන්ධ සියලුම රටවලට ප්‍රයෝජනවත් වේ."
    },
    category: 'economic'
  },
  {
    id: 10,
    text: {
      en: "Economic inequality is a necessary part of a competitive society.",
      si: "ආර්ථික අසමානතාවය තරඟකාරී සමාජයක අත්‍යවශ්‍ය කොටසකි."
    },
    category: 'economic'
  },
  {
    id: 11,
    text: {
      en: "The minimum wage should be abolished to allow market forces to work.",
      si: "වෙළඳපල බලවේගයන්ට ක්‍රියා කිරීමට ඉඩ දීම සඳහා අවම වැටුප අහෝසි කළ යුතුය."
    },
    category: 'economic'
  },
  {
    id: 12,
    text: {
      en: "Government spending on social programs should be increased.",
      si: "සමාජ වැඩසටහන් සඳහා රජයේ වියදම් වැඩි කළ යුතුය."
    },
    category: 'economic',
    reversed: true
  },

  // Social Questions (12 questions)
  {
    id: 13,
    text: {
      en: "The government should have the right to monitor private communications for security purposes.",
      si: "ආරක්ෂක අරමුණු සඳහා පුද්ගලික සන්නිවේදනයන් අධීක්ෂණය කිරීමේ අයිතිය රජයට තිබිය යුතුය."
    },
    category: 'social'
  },
  {
    id: 14,
    text: {
      en: "Individual freedom should be prioritized over collective security.",
      si: "සාමූහික ආරක්ෂාවට වඩා පුද්ගල නිදහසට ප්‍රමුඛත්වය දිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 15,
    text: {
      en: "Traditional values should be preserved and promoted by society.",
      si: "සම්ප්‍රදායික වටිනාකම් සමාජය විසින් සංරක්ෂණය කර ප්‍රවර්ධනය කළ යුතුය."
    },
    category: 'social'
  },
  {
    id: 16,
    text: {
      en: "People should be free to live their lives as they choose, even if it goes against social norms.",
      si: "එය සමාජ සාමාන්‍යයන්ට විරුද්ධ වුවද මිනිසුන්ට තමන් කැමති ආකාරයට ජීවත් වීමට නිදහස තිබිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 17,
    text: {
      en: "Strict law enforcement is necessary to maintain social order.",
      si: "සමාජ සාමය පවත්වා ගැනීම සඳහා දැඩි නීති ක්‍රියාත්මක කිරීම අවශ්‍ය වේ."
    },
    category: 'social'
  },
  {
    id: 18,
    text: {
      en: "Censorship of offensive content in media is sometimes justified.",
      si: "මාධ්‍යයේ අහිතකර අන්තර්ගත වාරණය කිරීම සමහර විට යුක්ති සහගත ය."
    },
    category: 'social'
  },
  {
    id: 19,
    text: {
      en: "Religious beliefs should not influence government policy.",
      si: "ආගමික විශ්වාස රජයේ ප්‍රතිපත්තිවලට බලපාන්නේ නැත."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 20,
    text: {
      en: "Citizens should accept government authority without question.",
      si: "පුරවැසියන් ප්‍රශ්න නොකර රජයේ අධිකාරිත්වය පිළිගත යුතුය."
    },
    category: 'social'
  },
  {
    id: 21,
    text: {
      en: "Civil disobedience is acceptable when laws are unjust.",
      si: "නීති අසාධාරණ වූ විට සිවිල් අකීකරුකම පිළිගත හැකිය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 22,
    text: {
      en: "The death penalty is an appropriate punishment for serious crimes.",
      si: "බරපතළ අපරාධ සඳහා මරණ දණුවම සුදුසු දඬුවමකි."
    },
    category: 'social'
  },
  {
    id: 23,
    text: {
      en: "Immigration should be strictly controlled to preserve national identity.",
      si: "ජාතික අනන්‍යතාවය ආරක්ෂා කිරීම සඳහා ආගමනය දැඩි ලෙස පාලනය කළ යුතුය."
    },
    category: 'social'
  },
  {
    id: 24,
    text: {
      en: "Personal drug use should be decriminalized.",
      si: "පුද්ගලික මත්ද්‍රව්‍ය භාවිතය අපරාධකරණයෙන් ඉවත් කළ යුතුය."
    },
    category: 'social',
    reversed: true
  }
];