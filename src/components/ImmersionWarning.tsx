import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ImmersionWarning: React.FC = () => {
  return (
    <section id="immersion-warning-section" className="w-full pt-1">
      <div className="rounded-2xl p-4 bg-[#141316]/90 border border-red-900/30 backdrop-blur-md flex items-start gap-3 shadow-lg">
        <div className="p-2 rounded-xl bg-red-950/80 border border-red-800/40 text-red-400 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex flex-col space-y-1">
          <span className="text-xs md:text-sm font-bold text-white tracking-wide">
            تحذير تجربة الانغماس الصوتي
          </span>
          <p className="text-xs text-[#c8a09b] leading-relaxed">
            يُنصح باستخدام سماعات الرأس في غرفة مظلمة للاستفادة الكاملة من المؤثرات الصوتية ثلاثية الأبعاد (8D). في حال شعورك بدوار أو قلق مفاجئ، يُرجى إيقاف المؤثرات الصوتية فوراً.
          </p>
        </div>
      </div>
    </section>
  );
};
