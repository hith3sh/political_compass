import { Question } from '../lib/types';

export const enhancedQuestions: Question[] = [
  // =====================================
  // ECONOMIC QUESTIONS (24 questions)
  // =====================================
  
  // Market Regulation & Government Intervention (6 questions)
  {
    id: 1,
    text: {
      en: "Free markets should be regulated to protect workers and consumers.",
      si: "කම්කරුවන් සහ පාරිභෝගිකයන් ආරක්ෂා කිරීම සඳහා නිදහස් වෙලඳපල නියාමනය කළ යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 2,
    text: {
      en: "A company should be able to hire and fire employees without government interference.",
      si: "සමාගමකට රජයේ මැදිහත්වීමකින් තොරව සේවකයන් බඳවා ගැනීමට සහ සේවයෙන් පහ කිරීමට හැකි විය යුතුය."
    },
    category: 'economic'
  },
  {
    id: 3,
    text: {
      en: "The government should control key industries like healthcare, education, and utilities.",
      si: "සෞඛ්‍ය, අධ්‍යාපනය සහ උපයෝගිතා වැනි ප්‍රධාන කර්මාන්ත රජය පාලනය කළ යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 4,
    text: {
      en: "Price controls on essential goods lead to shortages and inefficiency.",
      si: "අත්‍යවශ්‍ය භාණඩවල මිල පාලනය හිඟයට සහ අකාර්යක්ෂමතාවයට තුඩු දෙයි."
    },
    category: 'economic'
  },
  {
    id: 5,
    text: {
      en: "Environmental protection should take priority over economic growth.",
      si: "ආර්ථික වර්ධනයට වඩා පරිසර ආරක්ෂණයට ප්‍රමුඛත්වය දිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 6,
    text: {
      en: "Monopolies should be broken up by government action.",
      si: "ඒකාධිකාර රජයේ ක්‍රියාමාර්ග මගින් බිඳ දැමිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },

  // Taxation & Wealth Distribution (6 questions)
  {
    id: 7,
    text: {
      en: "High taxes on the wealthy are necessary for a fair society.",
      si: "සාධාරණ සමාජයක් සඳහා ධනවතුන්ට ඉහළ බදු අවශ්‍ය වේ."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 8,
    text: {
      en: "Progressive taxation discourages innovation and hard work.",
      si: "ප්‍රගතිශීලී බදු අයකිරීම නවෝත්පාදනය සහ වෙහෙස මහන්සිය අධෛර්යගත කරයි."
    },
    category: 'economic'
  },
  {
    id: 9,
    text: {
      en: "The government should provide universal basic income to all citizens.",
      si: "රජය සියලුම පුරවැසියන්ට විශ්වීය මූලික ආදායමක් ලබා දිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 10,
    text: {
      en: "Welfare programs create dependency and reduce incentives to work.",
      si: "සුභසාධන වැඩසටහන් යැපීම ඇති කරන අතර වැඩ කිරීමේ දිරිගැන්වීම් අඩු කරයි."
    },
    category: 'economic'
  },
  {
    id: 11,
    text: {
      en: "Economic inequality is a necessary part of a competitive society.",
      si: "ආර්ථික අසමානතාවය තරඟකාරී සමාජයක අත්‍යවශ්‍ය කොටසකි."
    },
    category: 'economic'
  },
  {
    id: 12,
    text: {
      en: "Inheritance taxes prevent the concentration of wealth across generations.",
      si: "උරුම බදු පරම්පරා හරහා ධනය සමුච්චය වීම වළක්වයි."
    },
    category: 'economic',
    reversed: true
  },

  // Labor & Employment (6 questions)
  {
    id: 13,
    text: {
      en: "Labor unions do more harm than good to the economy.",
      si: "කම්කරු සංගම් ආර්ථිකයට යහපත්ට වඩා අහිතකර ය."
    },
    category: 'economic'
  },
  {
    id: 14,
    text: {
      en: "Workers should have a legal right to form unions and strike.",
      si: "කම්කරුවන්ට සංගම් පිහිටුවීමට සහ වර්ජනයට නීතිමය අයිතියක් තිබිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 15,
    text: {
      en: "The minimum wage should be abolished to allow market forces to work.",
      si: "වෙළඳපල බලවේගයන්ට ක්‍රියා කිරීමට ඉඩ දීම සඳහා අවම වැටුප අහෝසි කළ යුතුය."
    },
    category: 'economic'
  },
  {
    id: 16,
    text: {
      en: "A 35-hour work week would improve work-life balance without harming productivity.",
      si: "පැය 35ක වැඩ සතියක් ඵලදාயිතාවයට හානි නොකර වැඩ-ජීවිත සමතුලිතතාවය වැඩි දියුණු කරයි."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 17,
    text: {
      en: "Gig economy workers should be classified as independent contractors, not employees.",
      si: "ගිග් ආර්ථික කම්කරුවන් සේවකයන් ලෙස නොව ස්වාධීන කොන්ත්‍රාත්කරුවන් ලෙස වර්ගීකරණය කළ යුතුය."
    },
    category: 'economic'
  },
  {
    id: 18,
    text: {
      en: "Companies should be required to provide healthcare and retirement benefits to all workers.",
      si: "සමාගම්වලට සියලුම කම්කරුවන්ට සෞඛ්‍ය සේවා සහ විශ්‍රාම ප්‍රතිලාభ ලබා දීමට අවශ්‍ය විය යුතුය."
    },
    category: 'economic',
    reversed: true
  },

  // Trade & Globalization (6 questions)
  {
    id: 19,
    text: {
      en: "Free trade benefits all countries involved.",
      si: "නිදහස් වෙළඳාම සම්බන්ධ සියලුම රටවලට ප්‍රයෝජනවත් වේ."
    },
    category: 'economic'
  },
  {
    id: 20,
    text: {
      en: "Tariffs are necessary to protect domestic industries and jobs.",
      si: "දේශීය කර්මාන්ත සහ රැකියා ආරක්ෂා කිරීම සඳහා තීරුබදු අවශ්‍ය වේ."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 21,
    text: {
      en: "Multinational corporations have too much power over national governments.",
      si: "බහුජාතික සමාගම්වලට ජාතික ආන්ඩු මත ඕනෑවට වඩා බලයක් ඇත."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 22,
    text: {
      en: "International trade agreements should prioritize economic efficiency over worker protection.",
      si: "ජාත්‍යන්තර වෙළඳ ගිණුම් කම්කරු ආරක්ෂණයට වඩා ආර්ථික කාර්යක්ෂමතාවයට ප්‍රමුඛත්වය දිය යුතුය."
    },
    category: 'economic'
  },
  {
    id: 23,
    text: {
      en: "Developed countries should provide more aid and debt relief to developing nations.",
      si: "සංවර්ධිත රටවල් සංවර්ධනය වන ජාතීන්ට වැඩි ආධාර සහ ණය සහන ලබා දිය යුතුය."
    },
    category: 'economic',
    reversed: true
  },
  {
    id: 24,
    text: {
      en: "Economic sanctions are an effective tool for promoting democracy and human rights.",
      si: "ජනාධිපතිත්වය සහ මානව අයිතිවාසිකම් ප්‍රවර්ධනය කිරීම සඳහා ආර්ථික සම්බාධක ක්‍රීයාත්මක මෙවලමකි."
    },
    category: 'economic'
  },

  // =====================================
  // SOCIAL QUESTIONS (24 questions)
  // =====================================

  // Personal Freedom vs Authority (6 questions)
  {
    id: 25,
    text: {
      en: "Individual freedom should be prioritized over collective security.",
      si: "සාමූහික ආරක්ෂාවට වඩා පුද්ගල නිදහසට ප්‍රමුඛත්වය දිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 26,
    text: {
      en: "The government should have the right to monitor private communications for security purposes.",
      si: "ආරක්ෂක අරමුණු සඳහා පුද්ගලික සන්නිවේදනයන් අධීක්ෂණය කිරීමේ අයිතිය රජයට තිබිය යුතුය."
    },
    category: 'social'
  },
  {
    id: 27,
    text: {
      en: "Citizens should accept government authority without question.",
      si: "පුරවැසියන් ප්‍රශ්න නොකර රජයේ අධිකාරිත්වය පිළිගත යුතුය."
    },
    category: 'social'
  },
  {
    id: 28,
    text: {
      en: "Civil disobedience is acceptable when laws are unjust.",
      si: "නීති අසාධාරණ වූ විට සිවිල් අකීකරුකම පිළිගත හැකිය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 29,
    text: {
      en: "People should be free to live their lives as they choose, even if it goes against social norms.",
      si: "එය සමාජ සාමාන්‍යයන්ට විරුද්ධ වුවද මිනිසුන්ට තමන් කැමති ආකාරයට ජීවත් වීමට නිදහස තිබිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 30,
    text: {
      en: "National security concerns justify limiting some civil liberties.",
      si: "ජාතික ආරක්ෂක උත්සුකයන් සමහර සිවිල් නිදහස සීමා කිරීම යුක්ති සහගත කරයි."
    },
    category: 'social'
  },

  // Law Enforcement & Justice (6 questions)
  {
    id: 31,
    text: {
      en: "Strict law enforcement is necessary to maintain social order.",
      si: "සමාජ සාමය පවත්වා ගැනීම සඳහා දැඩි නීති ක්‍රියාත්මක කිරීම අවශ්‍ය වේ."
    },
    category: 'social'
  },
  {
    id: 32,
    text: {
      en: "The death penalty is an appropriate punishment for serious crimes.",
      si: "බරපතළ අපරාධ සඳහා මරණ දණුවම සුදුසු දඬුවමකි."
    },
    category: 'social'
  },
  {
    id: 33,
    text: {
      en: "Rehabilitation should be prioritized over punishment in the criminal justice system.",
      si: "අපරාධ යුක්තිය ක්‍රමයේ දඬුවමට වඹ්බ පුනරුත්ථාපනයට ප්‍රමුඛත්වය දිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 34,
    text: {
      en: "Police should have broad powers to investigate crimes and maintain order.",
      si: "අපරාධ විමර්ශනය කිරීමට සහ සාමය පවත්වා ගැනීමට පොලිසියට පුළුල් බලතල තිබිය යුතුය."
    },
    category: 'social'
  },
  {
    id: 35,
    text: {
      en: "Drug use should be treated as a health issue, not a criminal one.",
      si: "මත්ද්‍රව්‍ය භාවිතය අපරාධයක් ලෙස නොව සෞඛ්‍ය ගැටලුවක් ලෙස සැලකිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 36,
    text: {
      en: "Mandatory minimum sentences ensure consistent justice.",
      si: "අනිවාර්ය අවම දඬුවම් ගම ස්ථිර යුක්තිය සහතික කරයි."
    },
    category: 'social'
  },

  // Traditional Values vs Progressive Change (6 questions)
  {
    id: 37,
    text: {
      en: "Traditional values should be preserved and promoted by society.",
      si: "සම්ප්‍රදායික වටිනාකම් සමාජය විසින් සංරක්ෂණය කර ප්‍රවර්ධනය කළ යුතුය."
    },
    category: 'social'
  },
  {
    id: 38,
    text: {
      en: "Society should adapt to changing social norms rather than resist them.",
      si: "සමාජය වෙනස් වන සමාජ සම්මතයන්ට ප්‍රතිරෝධය දැක්වීමට වඬ්බ අනුගත විය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 39,
    text: {
      en: "Religious beliefs should not influence government policy.",
      si: "ආගමික විශ්වාස රජයේ ප්‍රතිපත්තිවලට බලපාන්නේ නැත."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 40,
    text: {
      en: "Schools should teach traditional moral values alongside academic subjects.",
      si: "පාසල් අධ්‍යාපන විෂය සමඟ සම්ප්‍රදායික සදාචාරාත්මක වටිනාකම් ඉගැන්විය යුතුය."
    },
    category: 'social'
  },
  {
    id: 41,
    text: {
      en: "Cultural diversity should be celebrated even if it challenges mainstream values.",
      si: "සංස්කෘතික විවිධත්වය ප්‍රධාන ධාරාවේ වටිනාකම්වලට අභියෝග කළ වුවද එය සමරනු ලැබිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 42,
    text: {
      en: "Same-sex marriage should be legally recognized.",
      si: "සමලිංගික විවාහ නීතිමය වශයෙන් පිළිගත යුතුය."
    },
    category: 'social',
    reversed: true
  },

  // Immigration & Multiculturalism (6 questions) 
  {
    id: 43,
    text: {
      en: "Immigration should be strictly controlled to preserve national identity.",
      si: "ජාතික අනන්‍යතාවය ආරක්ෂා කිරීම සඳහා ආගමනය දැඩි ලෙස පාලනය කළ යුතුය."
    },
    category: 'social'
  },
  {
    id: 44,
    text: {
      en: "Multiculturalism enriches society and should be encouraged.",
      si: "බහුසංස්කෘතිවාදය සමාජය පොහොසත් කරන අතර එයට උත්සාහ දිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 45,
    text: {
      en: "Immigrants should be required to fully assimilate into the host country's culture.",
      si: "සංක්‍රමණිකයන් ආගන්ගුක රටේ සංස්කෘතියට සම්පූර්ණයෙන්ම ලම් කිරීමට අවශ්‍ය විය යුතුය."
    },
    category: 'social'
  },
  {
    id: 46,
    text: {
      en: "Refugees and asylum seekers deserve protection regardless of economic impact.",
      si: "සරණාගතයන් සහ පනසරා ගන්නන්ට ආර්ථික බලපෑම නොසලකා ආරක්ෂාව ලැබිය යුතුය."
    },
    category: 'social',
    reversed: true
  },
  {
    id: 47,
    text: {
      en: "National language should be the only official language in government and education.",
      si: "ජාතික භාෂාව රජයේ සහ අධ්‍යාපනයේ එකම නිල භාෂාව විය යුතුය."
    },
    category: 'social'
  },
  {
    id: 48,
    text: {
      en: "Birthright citizenship should be guaranteed to all children born in the country.",
      si: "රටේ උපන් සියලුම දරුවන්ට උපන් අයිතිය පුරවැසිභාවය සහතික කළ යුතුය."
    },
    category: 'social',
    reversed: true
  }
];