export type HorrorSoundCategory =
  | 'غابات ورياح'
  | 'بيوت وخشب عتيق'
  | 'أصوات وهمسات بشرية'
  | 'نبض ورعب نفسي'
  | 'معادن وقطارات صناعية';

export interface HorrorCategoryInfo {
  id: string;
  name: HorrorSoundCategory;
  icon: string;
  description: string;
}

export const horrorSoundCategories: HorrorCategoryInfo[] = [
  { id: 'forest', name: 'غابات ورياح', icon: '🌲', description: 'أصوات غابات مظلمة ورياح وعواصف ورعود' },
  { id: 'houses', name: 'بيوت وخشب عتيق', icon: '🏚️', description: 'صرير أبواب وأرضيات خشبية قديمة ومصراع قبو' },
  { id: 'human', name: 'أصوات وهمسات بشرية', icon: '👥', description: 'همسات شيطانية وصرخات استغاثة وقهقهات وأنفاس' },
  { id: 'psychological', name: 'نبض ورعب نفسي', icon: '🫀', description: 'نبضات قلب خائفة وصندوق موسيقى ملعون وطنين أذن' },
  { id: 'industrial', name: 'معادن وقطارات صناعية', icon: '⛓️', description: 'سلاسل حديدية وقطار أشباح وأجراس وراديو EVP' },
];

export interface HorrorSoundOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: HorrorSoundCategory;
  frequencyBand: 'Bass عميق ومنخفض' | 'Mid تردد رنان ومتوسط' | 'Treble تردد حاد وعالٍ' | 'إيقاع ونبض ميكانيكي' | 'هوائي وأصوات بشرية';
  url?: string;
}

export const horrorSoundOptions: HorrorSoundOption[] = [
  // 1. غابات مظلمة ورياح وعواصف (Dark Forests, Winds & Storms)
  {
    id: 'forest_night_wind',
    name: 'عواء رياح الغابة المظلمة',
    icon: '🌲',
    description: 'عواء رياح هوجاء تتغلغل بين فروع الأشجار الميتة مصحوبة بصفير حاد متقطع وهدير ليل موحش.',
    category: 'غابات ورياح',
    frequencyBand: 'Mid تردد رنان ومتوسط',
  },
  {
    id: 'rain_thunder_storm',
    name: 'عاصفة رعدية ورعود منخفضة',
    icon: '⛈️',
    description: 'هزيم رعد عميق بترددات Bass منخفضة تهز الأرض مع انهمار مطر غزير يضرب النوافذ والأرض الرطبة.',
    category: 'غابات ورياح',
    frequencyBand: 'Bass عميق ومنخفض',
  },
  {
    id: 'crow_swarms',
    name: 'نعيق أسراب الغربان وبوم الليل',
    icon: '🦅',
    description: 'نعيق حاد ومفاجئ لغربان سوداء وبوم يتربص في عتمة الغابة مع رفيف أجنحة خفيفة بين الأغصان.',
    category: 'غابات ورياح',
    frequencyBand: 'Treble تردد حاد وعالٍ',
  },
  {
    id: 'creepy_swamp',
    name: 'مستنقع الأرواح وفقاعات غازية',
    icon: '🫧',
    description: 'فقاعات غازية لزجة تنفجر ببطء في مياه آسنة مع تنقيط مائي رطب وصدى طيني مقبض.',
    category: 'غابات ورياح',
    frequencyBand: 'Bass عميق ومنخفض',
  },

  // 2. صرير أبواب وأرضيات خشبية قديمة (Creaking Wood & Abandoned Houses)
  {
    id: 'creaking_doors',
    name: 'صرير باب مسكون ومفصلات صدئة',
    icon: '🚪',
    description: 'مفصلات حديد صدئة تئن وتصرخ بألم أثناء دفع باب خشبي ثقيل ببطء في ممر مظلم.',
    category: 'بيوت وخشب عتيق',
    frequencyBand: 'Mid تردد رنان ومتوسط',
  },
  {
    id: 'footsteps_creaking_wood',
    name: 'خطوات ثقيلة فوق ألواح خشب تئن',
    icon: '👣',
    description: 'وقع أقدام متثاقلة تقترب خطوة بخطوة فوق ألواح أرضية خشبية عتيقة تنحني وتصدر طقطقة واضحة.',
    category: 'بيوت وخشب عتيق',
    frequencyBand: 'إيقاع ونبض ميكانيكي',
  },
  {
    id: 'scratching_wooden_walls',
    name: 'خربشة أظافر ومخالب خلف الجدران',
    icon: '🖐️',
    description: 'حكّ سريع وعالي التردد لأظافر بشرية ومخالب تحاول بيأس حفر واختراق الجدار الخشبي لغرفتك.',
    category: 'بيوت وخشب عتيق',
    frequencyBand: 'Treble تردد حاد وعالٍ',
  },
  {
    id: 'basement_hatch',
    name: 'سحب مصراع قبو واهتزاز أرضي',
    icon: '🕳️',
    description: 'جرّ مصراع قبو ثقيل واحتكاك حجري يتبعه صدى مجوف واهتزاز عميق من أسفل السرداب.',
    category: 'بيوت وخشب عتيق',
    frequencyBand: 'Bass عميق ومنخفض',
  },

  // 3. همسات وأصوات بشرية مرعبة (Creepy Whispers & Screams)
  {
    id: 'creepy_whispers',
    name: 'همسات وتمتمات شيطانية متعددة',
    icon: '👻',
    description: 'أصوات أثيرية متداخلة تهمس في أذنك بكلمات غامضة ونبرة باردة تتنقل بين اليمين واليسار.',
    category: 'أصوات وهمسات بشرية',
    frequencyBand: 'هوائي وأصوات بشرية',
  },
  {
    id: 'ghostly_screams',
    name: 'صرخات استغاثة وعويل شبحي بعيد',
    icon: '😱',
    description: 'عويل حاد وصرخات رعب مفاجئة تنطلق من أعماق الممرات المهجورة ثم تتلاشى في صدى موحش.',
    category: 'أصوات وهمسات بشرية',
    frequencyBand: 'Treble تردد حاد وعالٍ',
  },
  {
    id: 'witch_laughter',
    name: 'قهقهات هستيرية مرعبة ومتقطعة',
    icon: '🧙‍♀️',
    description: 'ضحكات متقطعة وخبيثة تتردد في السكون بنبرة جنونية ساخرة تثير الرعب والشك.',
    category: 'أصوات وهمسات بشرية',
    frequencyBand: 'هوائي وأصوات بشرية',
  },
  {
    id: 'heavy_breathing',
    name: 'أنفاس لاهثة وحارة خلف العنق',
    icon: '🌬️',
    description: 'شهيق وزفير مضطرب وبطيء تسمعه وتحس بحرارته بقربك مباشرة في ظلام دامس دون أن ترى أحداً.',
    category: 'أصوات وهمسات بشرية',
    frequencyBand: 'هوائي وأصوات بشرية',
  },

  // 4. نبضات قلب مخيفة ورعب نفسي (Heartbeats & Psychological Tension)
  {
    id: 'heartbeat_panic',
    name: 'دقات قلب مرعوبة ورجفة صدرية',
    icon: '🫀',
    description: 'نبضات قلب مزدوجة Bass عميقة ومتسارعة ترج القفص الصدري كأن صاحبها يركض مذعوراً.',
    category: 'نبض ورعب نفسي',
    frequencyBand: 'Bass عميق ومنخفض',
  },
  {
    id: 'cursed_musicbox',
    name: 'صندوق موسيقى ملعون بنغمات نشاز',
    icon: '🎶',
    description: 'ألحان طفولية رنانة مشوهة بنغمات نشاز كئيبة تتباطأ تدريجياً كأن زمبرك الساعة يشارف على التوقف.',
    category: 'نبض ورعب نفسي',
    frequencyBand: 'Treble تردد حاد وعالٍ',
  },
  {
    id: 'clock_doom',
    name: 'تكتكة ساعة موت ميكانيكية عتيقة',
    icon: '🕰️',
    description: 'دقات رقاص ميكانيكية حاسمة ومنتظمة كل ثانية مع رنين مجوف يوحي باقتراب اللحظة الأخيرة.',
    category: 'نبض ورعب نفسي',
    frequencyBand: 'إيقاع ونبض ميكانيكي',
  },
  {
    id: 'tinnitus_drone',
    name: 'طنين أذن حاد يتبعه فراغ نفسي',
    icon: '🫨',
    description: 'صفير حاد بتردد مرتفع جداً يخترق السمع يصحبه فراغ بارد يرمز لهول الصدمة والذهول.',
    category: 'نبض ورعب نفسي',
    frequencyBand: 'Treble تردد حاد وعالٍ',
  },

  // 5. قطارات وعناصر معدنية صناعية (Industrial Metals, Chains & Ghost Trains)
  {
    id: 'chains_graveyard',
    name: 'صليل سلاسل حديدية تُسحب على الحجر',
    icon: '⛓️',
    description: 'حلقات حديدية ثقيلة تصطك ببعضها وتُجر ببطء على بلاط بارد وشواهد قبور حجرية.',
    category: 'معادن وقطارات صناعية',
    frequencyBand: 'Mid تردد رنان ومتوسط',
  },
  {
    id: 'ghost_train_fog',
    name: 'صفير قطار أشباح حديدي في الضباب',
    icon: '🚂',
    description: 'بوق قطار بخاري عتيق يعوي من بعيد وسط ضباب كثيف مع دمدمة محركات واهتزاز القضبان.',
    category: 'معادن وقطارات صناعية',
    frequencyBand: 'Bass عميق ومنخفض',
  },
  {
    id: 'monastery_bells',
    name: 'رنين أجراس كنيسة جنائزية ضخمة',
    icon: '🔔',
    description: 'ضربات بطيئة على جرس برونزي عملاق تتلاشى أصداؤها الثقيلة بنغمات كئيبة في الضباب.',
    category: 'معادن وقطارات صناعية',
    frequencyBand: 'Mid تردد رنان ومتوسط',
  },
  {
    id: 'radio_static_evp',
    name: 'ترددات راديو صناعي وأصوات EVP',
    icon: '📻',
    description: 'تشويش موجات أثيرية وتداخل إشارات راديو تناظرية تحاول من خلالها الأرواح إيصال رسالة.',
    category: 'معادن وقطارات صناعية',
    frequencyBand: 'هوائي وأصوات بشرية',
  },
];

