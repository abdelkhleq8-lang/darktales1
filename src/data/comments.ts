import { Comment } from '../types';

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  'story-raven': [
    {
      id: 'c-raven-1',
      storyId: 'story-raven',
      authorName: 'سفيان القحطاني',
      avatarColor: 'bg-red-900',
      content: 'النهاية أصابتني بالقشعريرة! أسلوب السرد والجو الصوتي جعلني أشعر وكأن هناك من يراقبني حقاً في الغرفة.',
      createdAt: 'منذ نصف ساعة',
      likesCount: 14,
    },
    {
      id: 'c-raven-2',
      storyId: 'story-raven',
      authorName: 'منى عبد الرحمن',
      avatarColor: 'bg-purple-950',
      content: 'يا إلهي، نقرات الغراب الثلاث على الزجاج... لن أستطيع النوم الليلة بمفردي أبداً!',
      createdAt: 'منذ ساعتين',
      likesCount: 9,
    },
    {
      id: 'c-raven-3',
      storyId: 'story-raven',
      authorName: 'د. يوسف النجار',
      avatarColor: 'bg-zinc-800',
      content: 'سرد محبوك يذكرني بأعمال إدغار آلان بو بطابع عربي معاصر. التدرج في التوتر ممتاز.',
      createdAt: 'منذ ٥ ساعات',
      likesCount: 22,
    },
  ],
  'story-basement': [
    {
      id: 'c-base-1',
      storyId: 'story-basement',
      authorName: 'كريم الباز',
      avatarColor: 'bg-amber-950',
      content: 'الصوت في الخلفية (صرير الخشب وخطوات الأقدام) زاد من رعب القصة أضعافاً!',
      createdAt: 'منذ ٤ ساعات',
      likesCount: 8,
    },
    {
      id: 'c-base-2',
      storyId: 'story-basement',
      authorName: 'هدى سليم',
      avatarColor: 'bg-rose-950',
      content: 'عبارة "أنت لست الوحيد هنا" جمدت الدم في عروقي.',
      createdAt: 'منذ ٦ ساعات',
      likesCount: 11,
    },
  ],
  'story-mirror': [
    {
      id: 'c-mirror-1',
      storyId: 'story-mirror',
      authorName: 'زياد السعيد',
      avatarColor: 'bg-blue-950',
      content: 'فوبيا المرايا هي أسوأ أنواع الرعب النفسي، وهذا النص جسدها بدقة مروعة.',
      createdAt: 'أمس',
      likesCount: 19,
    },
  ],
  'story-train': [
    {
      id: 'c-train-1',
      storyId: 'story-train',
      authorName: 'مازن الشامي',
      avatarColor: 'bg-emerald-950',
      content: 'ركاب بلا وجوه ينظرون نحو الأسفل... وصف سينمائي مرعب جداً.',
      createdAt: 'منذ يومين',
      likesCount: 15,
    },
  ],
};
