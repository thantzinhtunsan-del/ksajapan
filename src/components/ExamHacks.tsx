import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Zap, Target, Lightbulb } from 'lucide-react';

const SUBJECTS = [
  '人間の尊厳と自立',
  '人間関係とコミュニケーション',
  '社会の理解',
  '介護の基本',
  'コミュニケーション技術',
  '生活支援技術',
  '介護過程',
  '発達と老化の理解',
  '認知症の理解',
  '障害の理解',
  'こころとからだのしくみ',
  '医療的ケア',
  '総合問題',
];

interface Hack {
  title: string;
  sigmaStrategy: string;
  trapAlert: string;
}

const STRATEGIES: Record<string, Hack[]> = {
  '人間の尊厳と自立': [
    {
      title: 'Human Dignity & Independence',
      sigmaStrategy: 'Focus on the concept of "Self-Determination" and "Normalisation".',
      trapAlert: 'Avoid choices that treat users as passive recipients of care.',
    },
  ],
  '人間関係とコミュニケーション': [
    {
      title: 'Relationships & Communication',
      sigmaStrategy: 'Emphasize "Empathy" and "Acceptance" (受容).',
      trapAlert: 'Watch out for judgmental or dismissive responses.',
    },
  ],
  '社会の理解': [
    {
      title: 'Understanding Society',
      sigmaStrategy: 'Master the "Long-term Care Insurance System" (介護保険制度).',
      trapAlert: 'Don\'t confuse municipal roles with national government roles.',
    },
  ],
  '介護の基本': [
    {
      title: 'User is the Boss (自己決定)',
      sigmaStrategy: '利用者が自分で決める（自己決定）を助けるのが正解です。「自立支援」という言葉を探してください。',
      trapAlert: '「安全のために拘束する」「家族の希望通りにする」「介護職が決める」はすべて×です。',
    },
  ],
  'コミュニケーション技術': [
    {
      title: 'Communication Techniques',
      sigmaStrategy: 'Focus on "Active Listening" and "Non-verbal Communication".',
      trapAlert: 'Avoid closed questions when open questions are more appropriate.',
    },
  ],
  '生活支援技術': [
    {
      title: 'Life Support Techniques',
      sigmaStrategy: 'Apply "Body Mechanics" to ensure safety for both user and caregiver.',
      trapAlert: 'Never ignore the user\'s remaining abilities (残存能力).',
    },
  ],
  '介護過程': [
    {
      title: 'Care Process',
      sigmaStrategy: 'Understand the PDCA cycle: Assessment -> Planning -> Implementation -> Evaluation.',
      trapAlert: 'Do not skip the assessment phase before planning.',
    },
  ],
  '発達と老化の理解': [
    {
      title: 'Development & Aging',
      sigmaStrategy: 'Distinguish between normal aging and pathological changes.',
      trapAlert: 'Avoid assuming all elderly people have dementia.',
    },
  ],
  '認知症の理解': [
    {
      title: 'Understanding Dementia',
      sigmaStrategy: 'Focus on "Person-Centered Care" and understanding BPSD causes.',
      trapAlert: 'Never correct or argue with a person experiencing delusions.',
    },
  ],
  '障害の理解': [
    {
      title: 'Understanding Disabilities',
      sigmaStrategy: 'Learn the "Social Model of Disability" and ICF classification.',
      trapAlert: 'Don\'t focus solely on the medical diagnosis or limitations.',
    },
  ],
  'こころとからだのしくみ': [
    {
      title: 'Mind & Body Mechanism',
      sigmaStrategy: 'Understand basic anatomy and physiological responses to aging.',
      trapAlert: 'Watch out for incorrect medical terminology or logic.',
    },
  ],
  '医療的ケア': [
    {
      title: 'Medical Care',
      sigmaStrategy: 'Strictly follow "Safety Protocols" for suctioning and tube feeding.',
      trapAlert: 'Never perform medical acts beyond the legal scope of a care worker.',
    },
  ],
  '総合問題': [
    {
      title: 'Comprehensive Problems',
      sigmaStrategy: 'Integrate all domains to solve complex case studies.',
      trapAlert: 'Don\'t miss the specific context provided in the case description.',
    },
  ],
};

export default function ExamHacks() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  return (
    <section id="examhacks" className="py-24 bg-matte-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Exam <span className="text-metallic-gold">Hacks</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sigma Coach Strategic Playbooks for the National Exam.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!selectedSubject ? (
            <motion.div 
              key="grid"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            >
              {SUBJECTS.map((subject, index) => (
                <motion.button
                  key={subject}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedSubject(subject)}
                  className="group relative h-32 sm:h-48 bg-black/40 border border-metallic-gold/20 rounded-xl p-4 sm:p-6 flex items-center justify-center text-center transition-all hover:border-metallic-gold hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] gold-glow-hover"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-metallic-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-sm sm:text-xl font-bold text-white group-hover:text-metallic-gold transition-colors leading-tight sm:leading-relaxed">
                    {subject}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-black/40 border border-metallic-gold/30 rounded-2xl p-8 lg:p-12"
            >
              <button 
                onClick={() => setSelectedSubject(null)}
                className="flex items-center gap-2 text-metallic-gold hover:text-white transition-colors mb-8 group gold-glow-hover"
              >
                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                Back to Subjects
              </button>

              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/3">
                  <h3 className="text-3xl font-bold text-white mb-4 leading-tight">
                    {selectedSubject}
                  </h3>
                  <div className="h-1 w-20 bg-metallic-gold rounded-full mb-6" />
                  <p className="text-gray-400">
                    Strategic Playbook by Sigma Coach. Focus on high-yield patterns and critical decision-making logic.
                  </p>
                </div>

                <div className="lg:w-2/3 space-y-8">
                  {STRATEGIES[selectedSubject] ? (
                    STRATEGIES[selectedSubject].map((hack, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-8 space-y-8"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <Zap className="text-metallic-gold" size={24} />
                          <h4 className="text-2xl font-bold text-white">{hack.title}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Sigma Strategy Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-metallic-gold">
                              <Target size={18} />
                              <span className="text-sm font-bold uppercase tracking-widest">Sigma Strategy</span>
                            </div>
                            <div className="p-4 bg-metallic-gold/10 border border-metallic-gold/20 rounded-lg">
                              <p className="text-gray-200 leading-relaxed">
                                {hack.sigmaStrategy}
                              </p>
                            </div>
                          </div>

                          {/* Trap Alert Section */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-red-500">
                              <Zap size={18} />
                              <span className="text-sm font-bold uppercase tracking-widest">Trap Alert</span>
                            </div>
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                              <p className="text-gray-200 leading-relaxed">
                                {hack.trapAlert}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Lightbulb className="text-metallic-gold/20 mb-4" size={48} />
                      <p className="text-gray-500 italic">
                        Strategic content for this subject is being finalized by Sigma Coach. Check back soon for high-yield hacks.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-metallic-gold/5 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-metallic-gold/5 blur-[120px] rounded-full -ml-48 -mb-48" />
    </section>
  );
}
