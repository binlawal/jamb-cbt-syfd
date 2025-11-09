import dotenv from 'dotenv';
import { query } from '../config/database';
import { JAMB_SUBJECTS } from '@jamb-cbt/shared';

dotenv.config();

interface Subject {
  name: string;
  code: string;
}

const subjectTopics: Record<string, string[]> = {
  ENG: [
    'Comprehension',
    'Lexis and Structure',
    'Oral English',
    'Summary',
    'Register',
  ],
  MTH: [
    'Number and Numeration',
    'Algebra',
    'Geometry and Trigonometry',
    'Calculus',
    'Statistics and Probability',
  ],
  PHY: [
    'Mechanics',
    'Thermal Physics',
    'Waves and Optics',
    'Electricity and Magnetism',
    'Modern Physics',
  ],
  CHM: [
    'Physical Chemistry',
    'Inorganic Chemistry',
    'Organic Chemistry',
    'Analytical Chemistry',
    'Industrial Chemistry',
  ],
  BIO: [
    'Cell Biology',
    'Genetics',
    'Evolution',
    'Ecology',
    'Human Biology',
  ],
  ECO: [
    'Basic Economic Concepts',
    'Microeconomics',
    'Macroeconomics',
    'International Economics',
    'Development Economics',
  ],
  GOV: [
    'Political Theory',
    'Nigerian Government',
    'Comparative Government',
    'International Relations',
    'Public Administration',
  ],
};

async function seedSubjects() {
  console.log('Starting subjects seed...');

  try {
    // Insert subjects
    for (const subject of JAMB_SUBJECTS) {
      const existingSubject = await query(
        'SELECT id FROM subjects WHERE code = $1',
        [subject.code]
      );

      let subjectId: string;

      if (existingSubject.length === 0) {
        const result = await query(
          'INSERT INTO subjects (name, code) VALUES ($1, $2) RETURNING id',
          [subject.name, subject.code]
        );
        subjectId = result[0].id;
        console.log(`✓ Created subject: ${subject.name} (${subject.code})`);
      } else {
        subjectId = existingSubject[0].id;
        console.log(`- Subject already exists: ${subject.name} (${subject.code})`);
      }

      // Insert topics for this subject
      const topics = subjectTopics[subject.code] || [];
      for (const topicName of topics) {
        const existingTopic = await query(
          'SELECT id FROM topics WHERE subject_id = $1 AND name = $2',
          [subjectId, topicName]
        );

        if (existingTopic.length === 0) {
          await query(
            'INSERT INTO topics (subject_id, name) VALUES ($1, $2)',
            [subjectId, topicName]
          );
          console.log(`  ✓ Created topic: ${topicName}`);
        } else {
          console.log(`  - Topic already exists: ${topicName}`);
        }
      }
    }

    console.log('\n✅ Subjects seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding subjects:', error);
    process.exit(1);
  }
}

seedSubjects();
