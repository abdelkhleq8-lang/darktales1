import { Story } from '../types';

export const INITIAL_STORIES: Story[] = [
  {
    id: 'story-raven',
    title: 'طائر الغراب الأخير',
    excerpt: 'كان يحط على إطار نافذتي العتيقة كلما استحضرت ملامح شخص في ذاكرتي. ينقر ثلاث نقرات بطيئة على الزجاج المثلج، وفي فجر اليوم التالي يُعلن نبأ موته المفاجئ دون أي سبب طبي...',
    content: `كانت الساعة تشير إلى الثالثة فجراً عندما سمعت النقر لأول مرة.
ثلاث نقرات باردة، منتظمة، ومحسوبة بدقة مخيفة على لوح الزجاج المتجمد لنافذة غرفتي في الطابق الرابع.

فتحت الستائر ببطء لأجد غراباً أسود ضخماً، ريشه يبدو كأنه مصنوع من سبج صلب، وعيناه لا تعكسان الضوء بل تمتصانه كفجوتين في العدم. والأغرب أنه لم يرمش قط.

في تلك الليلة بالذات، كنت أفكر بصديقي القديم "سامي" الذي لم أره منذ أعوام. في الصباح التالي، تلقيت مكالمة تخبرني بوفاته في حادث غامض أثناء نومه دون أي أثر لاعتلال صحي.

ظننتها صدفة بائسة، حتى تكررت الحادثة بعد أسبوعين حين تذكرت خالي المريض. نقر الغراب ثلاث نقرات ثانية، وقبل شروق الشمس كان خالي قد فارق الحياة.

الآن، وأنا أكتب هذه الكلمات تحت ضوء المصباح الخافت المرتعش، عاد الغراب وحط على النافذة من جديد. لكن هذه المرة... لم أكن أفكر في أي شخص سوى نفسي.`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJJkrJiyC4p0j7Ju1CEl-P-hRCR-GLoDq5c1GtyaeVNzEYmW7hQzXcqdWkM5fgHoQn7U6kRgHdgSbTqxiqXyLD1EuPgzVGFgn_1TOOp0YStC6mqf_fP5BeKTRe6425nb-tjUbrRjQSFPN5Q56S5ydpq--YMmwoBv0-kReyAPZBc2O9Ohu4PCdfBcH90d9qmBEdOEqad-3eKmAYcF6MZozKCxb47lTg9Gc1McEIBrl-sa55zEYNpfSc',
    author: {
      id: 'author-1',
      name: 'سارة خليل',
      badge: 'نبوءات الموت'
    },
    category: 'folk_legends',
    categoryLabel: 'أساطير شعبية',
    subGenreLabel: 'نبوءات الموت',
    readTimeMinutes: 5,
    likesCount: 2840,
    isLiked: false,
    isSaved: true,
    featured: true,
    audioUrl: 'https://cdn.freesound.org/previews/456/456578_9347805-lq.mp3',
    ambientAudio: {
      title: 'نعيق أسراب غِربان المقبرة',
      duration: '03:54',
      type: 'crow_swarms',
      defaultActive: true
    },
    createdAt: 'منذ ساعتين'
  },
  {
    id: 'story-basement',
    title: 'همسات في القبو العتيق',
    excerpt: 'كل ليلة بعد منتصف الليل، تبدأ الجدران بسرد حكايات الذين لم يغادروا المنزل قط... كانت أصوات شهقات مكتومة تدعوني لنزول الدرج الخشبي المهترئ خطوة بخطوة.',
    content: `اشتريت هذا البيت الريفي بسعر بخس لم أصدقه، وتجاهلت تحذيرات الجيران المسنين في القرية المجاورة.
"لا تنزل إلى القبو بعد غروب الشمس"، قالها العجوز وهو يرتعش.

في الأسبوع الأول، كانت الأمور طبيعية، باستثناء برودة غير مبررة تتصاعد من شقوق الأرضية الخشبية. ولكن في ليلة ممطرة، سمعت صوتاً يشبه تدحرج عملة معدنية على درجات السلم المؤدي للقبو.

نزلت ببطء حاملاً مصباحي اليدوي. درجات السلم كانت تئن تحت وطأة خطواتي المرتجفة.
وعندما وصل ضوء المصباح إلى أسفل القبو، رأيت دوائر مرسومة بطباشير أبيض وبقايا حبال معلقة في السقف، وعلى الجدار المقابل حفرت عبارة واحدة بأظافر بشرية: "أنت لست الوحيد هنا".`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBd_aOb90qXd4Xe7aZi5W6QMMIHg2HuitF72U1ofX9DXk_cZ54L4XC7UcDx8VHU2P9lNFHyQXfFpZzmwBfvYcIZrme1gDK-sXEkzYU0-5Ss7sdqr9RA5Dfoe5zEWDqIKFAbycZyWD7Np4lEl162LsrLn-5YM2r2WOjRq5fM2eWmrS3dJcETwunB2YO5AEEnaq4eUVtz_KiUAMphSsOuzH4Rg95Z7kS79eeDx_vFBcmv3tQbiimNmgSh',
    author: {
      id: 'author-2',
      name: 'طارق المنشاوي',
      badge: 'شهادات أرشيفية'
    },
    category: 'haunted_houses',
    categoryLabel: 'بيوت مسكونة',
    subGenreLabel: 'رعب نفسي • أصوات حقيقية',
    readTimeMinutes: 8,
    likesCount: 1420,
    isLiked: false,
    isSaved: false,
    featured: false,
    audioUrl: 'https://cdn.freesound.org/previews/469/469279_6687700-lq.mp3',
    ambientAudio: {
      title: 'همسات وتمتمات في الظلام',
      duration: '06:12',
      type: 'creepy_whispers',
      defaultActive: false
    },
    createdAt: 'أمس'
  },
  {
    id: 'story-mirror',
    title: 'مرآة الحمام المكسورة',
    excerpt: 'انعكاسي في المرآة تحرك قبلي بثانية واحدة كاملة، ثم التفت ونظر إليّ مباشرة وابتسم ابتسامة لم تكن ابتسامتي، بينما كنت متجمداً أمام المغسلة لا أقوى على التنفس...',
    content: `كنت أغسل وجهي بالماء البارد محاولاً طرد الصداع النصفي الذي يطاردني منذ أيام.
رفعت رأسي ونظرت في المرآة المشروخة طولياً.
كان الانعكاس دقيقاً في البداية، لكن عندما التفتت يدي لتلتقط المنشفة، بقيت يد الانعكاس مستقرة على حافة الحوض.

اتسعت عيناي رعباً وأنا أراقب الصورة في المرآة:
جسدي الآخر لم يتحرك معي. بل ببطء شديد، رفع رأسه ونظر إلي مباشرة عبر الزجاج، ثم فتح فمه بابتسامة عريضة غير بشرية تمتد إلى شحمتي أذنيه، ورفع سبابته واضعاً إياها فوق شفتيه قائلاً بصوت مكتوم خرج من خلف الجدار:
"ششش... حان دوري للخروج".`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0Dhe8xQJbIqvZRe9iBgLHqM48D-ai_dg6OXaO89UD9R7i3dBNxPHdvDhvyRpvsfXbbGyZx86PkBkBRv1z772n5AsaM64f4HmCsqi_WBZ3xMZqFnJNzcQEDKo8kAgSUF2e_UzVY0YbOMcHBwhlu8fawcV1vUC7nCX1zhVXM5FL0q_oCShPpHIdheu6y7IxENnliPG62LEDWmgC2jo1oc7k2ADbYGVY22vIh6j3BtuRzJNmzKRdA3Wz',
    author: {
      id: 'author-3',
      name: 'د. شريف عزمي',
      badge: 'أخصائي نفسي'
    },
    category: 'dark_entities',
    categoryLabel: 'كيانات مظلمة',
    subGenreLabel: 'ظواهر خارقة • شهادة موثقة',
    readTimeMinutes: 6,
    likesCount: 960,
    isLiked: false,
    isSaved: false,
    featured: false,
    audioUrl: 'https://cdn.freesound.org/previews/495/495005_10748135-lq.mp3',
    ambientAudio: {
      title: 'نبضات قلب متسارعة وأنفاس رعب',
      duration: '04:45',
      type: 'heartbeat_chase',
      defaultActive: false
    },
    createdAt: 'منذ يومين'
  },
  {
    id: 'story-train',
    title: 'المحطة المهجورة (قطار الساعة ٣:٣٣)',
    excerpt: 'لا يوجد قطار مسجل في جداول الهيئة في هذا التوقيت، لكن صافرة نحاسية تصدح في النفق المظلم، وتفتح الأبواب لركاب بلا وجوه ينظرون نحو الأسفل بصمت رهيب...',
    content: `فاتني آخر قطار في محطة المترو المركزية، ووجدت نفسي عالقاً على الرصيف السفلي بعد إغلاق الأنوار العامة وبقاء أضواء الطوارئ الحمراء الخافتة.
نظرت إلى شاشة الرحلات: كانت خالية، والساعة تشير إلى 3:32 فجراً.

وفجأة، دوت صافرة معدنية تصم الآذان من أعماق النفق، واهتزت القضبان بعنف.
توقف قطار أسود عتيق يعود للقرن الماضي، وبخار بارد كثيف يتدفق من تحت عجلاته.
فُتحت الأبواب بصوت صرير فظيع. في الداخل، كان هناك ركاب جالسون يرتدون ثياباً من حقب زمنية مختلفة، لكن وجوههم كانت ملساء تماماً كالشمع الذائب دون عيون أو أنوف.

أشار إلي أحدهم بإصبعه للدخول، وهمس صوت في مكبرات المحطة المعطلة: "الرحلة بلا عودة، اصعد الآن".`,
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpkUSZqe8o-74B__3bVLK_qeZNuAL98aydodZMfq73Wi2AnZ0PQiW7bELvsQ9nzB01ZH7wYYTyOH4J6yxD9LDP7FoQH3UKuTXibPKHgRgyApmwwQUr9Okj-57BCPrYaeXopbpEgQrrO1FqK5szGcOXpHc74OyeFtduDYXOakmb3ysWBbClZBa-c8F3fFBRJYJjxh1-MYOlnlakbE30gUPanSumcYNUa2Cor_PQuanjOUYDhwiyF-bm',
    author: {
      id: 'author-4',
      name: 'رامي وحيد',
      badge: 'أساطير المدن'
    },
    category: 'mysterious_crimes',
    categoryLabel: 'جرائم غامضة',
    subGenreLabel: 'أساطير مدنية • غموض حضري',
    readTimeMinutes: 10,
    likesCount: 3120,
    isLiked: true,
    isSaved: true,
    featured: false,
    audioUrl: 'https://cdn.freesound.org/previews/416/416838_5121236-lq.mp3',
    ambientAudio: {
      title: 'أصداء وصرخات استغاثة بعيدة',
      duration: '08:20',
      type: 'ghostly_screams',
      defaultActive: false
    },
    createdAt: 'منذ ٣ أيام'
  }
];
