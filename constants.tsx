
import { Post, User, Chat, AppNotification } from './types';

// Fixed MOCK_USER by adding missing followingIds and followerIds properties
export const MOCK_USER: User = {
  id: 'u1',
  name: 'عبدالرحمن العتيبي',
  email: 'abdurrahman@creativity.sa',
  bio: 'شاعر وعاشق للكلمة العربية، أبحث عن الجمال في تفاصيل الحياة اليومية.',
  savedPostIds: [],
  followingIds: [],
  followerIds: [],
  followersCount: 1240,
  followingCount: 850,
  isVerified: true,
};

export const INITIAL_POSTS: Post[] = [
  {
    id: 'p1',
    authorId: 'u2',
    authorName: 'نورة السعيد',
    content: 'على ضفاف الصمت تهمس الأرواح، وتحكي الحروف ما عجزت عنه القلوب. كن كالغمام، يمر صامتاً ويترك في الأرض أثراً.',
    likes: 124,
    date: 'منذ ساعتين',
    isVerifiedAuthor: true,
    comments: [
      { id: 'c1', authorName: 'فارس', content: 'كلمات لامست الوجدان، شكراً لكِ.', date: 'قبل ساعة' }
    ],
  },
  {
    id: 'p2',
    authorId: 'u3',
    authorName: 'فارس الشمري',
    content: 'تغرب الشمس في عينيكِ فجراً..\nوتشرق في حنايا الروح سراً.',
    likes: 89,
    date: 'منذ ٤ ساعات',
    imageUrl: 'https://images.unsplash.com/photo-1470252649358-96949c750b8b?auto=format&fit=crop&q=80&w=800',
    comments: [],
  }
];

export const MOCK_CHATS: Chat[] = [
  {
    id: 'chat1',
    // Added missing participantId property to comply with Chat interface
    participantId: 'u2',
    participantName: 'نورة السعيد',
    lastMessage: 'أهلاً بك، يسعدني التعاون معك في القصيدة القادمة.',
    timestamp: 'منذ ساعة',
    messages: [
      { id: 'm1', senderId: 'u1', text: 'السلام عليكم يا نورة، هل قرأتِ خاطرتي الأخيرة؟', timestamp: '١٠:٣٠ ص' },
      { id: 'm2', senderId: 'u2', text: 'وعليكم السلام، نعم قرأتها وكانت رائعة جداً!', timestamp: '١٠:٤٥ ص' },
      { id: 'm3', senderId: 'u2', text: 'أهلاً بك، يسعدني التعاون معك في القصيدة القادمة.', timestamp: '١١:٠٠ ص' },
    ]
  }
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  // Fixed missing fromId property in MOCK_NOTIFICATIONS
  { id: 'n1', type: 'LIKE', fromId: 'u2', fromName: 'نورة السعيد', content: 'أعجبت بخاطرتك الأخيرة', date: 'منذ ٥ دقائق', isRead: false },
  // Fixed missing fromId property in MOCK_NOTIFICATIONS
  { id: 'n2', type: 'COMMENT', fromId: 'u3', fromName: 'فارس الشمري', content: 'علق على منشورك: "كلمات رائعة!"', date: 'منذ ساعة', isRead: false }
];

export const COLORS = {
  bg: '#0f172a',
  card: '#1e293b',
  text: '#f8fafc',
  primary: '#fbbf24', // Gold
  secondary: '#0ea5e9', // Sky Blue
  muted: '#94a3b8',
  border: '#334155',
};
