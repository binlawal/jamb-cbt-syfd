import bcrypt from 'bcrypt';
import { query } from '../config/database';
import { closePool } from '../config/database';

const BCRYPT_ROUNDS = 12;

async function seedDemo() {
  console.log('🌱 Starting demo data seeding...\n');

  try {
    // 1. Create demo school
    console.log('📚 Creating demo school...');
    const schoolResult = await query(
      `INSERT INTO schools (name, state, lga, type, address)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      ['Lagos Model College', 'Lagos', 'Ikeja', 'public', '123 Ikeja Way, Lagos']
    );
    
    const schoolId = schoolResult.rows[0]?.id || (await query(
      'SELECT id FROM schools WHERE name = $1',
      ['Lagos Model College']
    )).rows[0].id;
    
    console.log(`✅ School created: ${schoolId}\n`);

    // 2. Create demo users
    console.log('👥 Creating demo users...');
    
    const users = [
      {
        name: 'Admin User',
        email: 'admin@jamb-cbt.com',
        password: 'admin123',
        role: 'admin',
        schoolId: null,
        cohort: null,
      },
      {
        name: 'Chidi Okafor',
        email: 'chidi@example.com',
        password: 'candidate123',
        role: 'candidate',
        schoolId,
        cohort: 'SS3',
      },
      {
        name: 'Amina Mohammed',
        email: 'amina@example.com',
        password: 'candidate123',
        role: 'candidate',
        schoolId,
        cohort: 'SS3',
      },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, BCRYPT_ROUNDS);
      
      await query(
        `INSERT INTO users (name, email, hashed_password, role, school_id, cohort, status)
         VALUES ($1, $2, $3, $4, $5, $6, 'active')
         ON CONFLICT (email) DO NOTHING`,
        [user.name, user.email, hashedPassword, user.role, user.schoolId, user.cohort]
      );
      
      console.log(`✅ User created: ${user.email} (${user.role})`);
    }
    
    console.log('\n📝 Creating demo questions...');
    
    // Get subject IDs
    const mathSubject = await query('SELECT id FROM subjects WHERE code = $1', ['MATH']);
    const engSubject = await query('SELECT id FROM subjects WHERE code = $1', ['ENG']);
    
    if (mathSubject.rows.length === 0 || engSubject.rows.length === 0) {
      console.log('⚠️  Subjects not found. Run seed-subjects.ts first!');
      return;
    }
    
    const mathId = mathSubject.rows[0].id;
    const engId = engSubject.rows[0].id;
    
    // Get topic IDs
    const mathTopics = await query('SELECT id FROM topics WHERE subject_id = $1 LIMIT 3', [mathId]);
    const engTopics = await query('SELECT id FROM topics WHERE subject_id = $1 LIMIT 3', [engId]);
    
    // Create 20 demo questions (10 Math, 10 English)
    const mathQuestions = [
      {
        stem: 'What is 15 + 27?',
        options: [
          { label: 'A', text: '40' },
          { label: 'B', text: '42' },
          { label: 'C', text: '43' },
          { label: 'D', text: '45' },
        ],
        correctAnswers: ['B'],
        difficulty: 1,
      },
      {
        stem: 'Solve for x: 2x + 5 = 15',
        options: [
          { label: 'A', text: 'x = 3' },
          { label: 'B', text: 'x = 5' },
          { label: 'C', text: 'x = 7' },
          { label: 'D', text: 'x = 10' },
        ],
        correctAnswers: ['B'],
        difficulty: 2,
      },
      {
        stem: 'What is the square root of 144?',
        options: [
          { label: 'A', text: '10' },
          { label: 'B', text: '11' },
          { label: 'C', text: '12' },
          { label: 'D', text: '13' },
        ],
        correctAnswers: ['C'],
        difficulty: 1,
      },
      {
        stem: 'If a triangle has angles 60°, 60°, and 60°, what type of triangle is it?',
        options: [
          { label: 'A', text: 'Scalene' },
          { label: 'B', text: 'Isosceles' },
          { label: 'C', text: 'Equilateral' },
          { label: 'D', text: 'Right-angled' },
        ],
        correctAnswers: ['C'],
        difficulty: 2,
      },
      {
        stem: 'What is 25% of 80?',
        options: [
          { label: 'A', text: '15' },
          { label: 'B', text: '20' },
          { label: 'C', text: '25' },
          { label: 'D', text: '30' },
        ],
        correctAnswers: ['B'],
        difficulty: 2,
      },
      {
        stem: 'Simplify: 3(x + 2) - 2(x - 1)',
        options: [
          { label: 'A', text: 'x + 4' },
          { label: 'B', text: 'x + 6' },
          { label: 'C', text: 'x + 8' },
          { label: 'D', text: 'x + 10' },
        ],
        correctAnswers: ['C'],
        difficulty: 3,
      },
      {
        stem: 'What is the area of a circle with radius 7cm? (Use π = 22/7)',
        options: [
          { label: 'A', text: '144 cm²' },
          { label: 'B', text: '154 cm²' },
          { label: 'C', text: '164 cm²' },
          { label: 'D', text: '174 cm²' },
        ],
        correctAnswers: ['B'],
        difficulty: 3,
      },
      {
        stem: 'If 3x - 7 = 2x + 5, what is x?',
        options: [
          { label: 'A', text: '10' },
          { label: 'B', text: '11' },
          { label: 'C', text: '12' },
          { label: 'D', text: '13' },
        ],
        correctAnswers: ['C'],
        difficulty: 2,
      },
      {
        stem: 'What is the value of 2³ + 3²?',
        options: [
          { label: 'A', text: '15' },
          { label: 'B', text: '16' },
          { label: 'C', text: '17' },
          { label: 'D', text: '18' },
        ],
        correctAnswers: ['C'],
        difficulty: 2,
      },
      {
        stem: 'Convert 0.75 to a fraction in its simplest form',
        options: [
          { label: 'A', text: '2/3' },
          { label: 'B', text: '3/4' },
          { label: 'C', text: '4/5' },
          { label: 'D', text: '5/6' },
        ],
        correctAnswers: ['B'],
        difficulty: 2,
      },
    ];

    const engQuestions = [
      {
        stem: 'Choose the correct spelling:',
        options: [
          { label: 'A', text: 'Accomodate' },
          { label: 'B', text: 'Accommodate' },
          { label: 'C', text: 'Acommodate' },
          { label: 'D', text: 'Acomodate' },
        ],
        correctAnswers: ['B'],
        difficulty: 2,
      },
      {
        stem: 'What is the plural of "child"?',
        options: [
          { label: 'A', text: 'Childs' },
          { label: 'B', text: 'Childes' },
          { label: 'C', text: 'Children' },
          { label: 'D', text: 'Childrens' },
        ],
        correctAnswers: ['C'],
        difficulty: 1,
      },
      {
        stem: 'Identify the verb in this sentence: "The cat sleeps on the mat."',
        options: [
          { label: 'A', text: 'cat' },
          { label: 'B', text: 'sleeps' },
          { label: 'C', text: 'mat' },
          { label: 'D', text: 'the' },
        ],
        correctAnswers: ['B'],
        difficulty: 1,
      },
      {
        stem: 'Which word is a synonym for "happy"?',
        options: [
          { label: 'A', text: 'Sad' },
          { label: 'B', text: 'Angry' },
          { label: 'C', text: 'Joyful' },
          { label: 'D', text: 'Tired' },
        ],
        correctAnswers: ['C'],
        difficulty: 1,
      },
      {
        stem: 'Choose the correct sentence:',
        options: [
          { label: 'A', text: 'She don\'t like apples' },
          { label: 'B', text: 'She doesn\'t likes apples' },
          { label: 'C', text: 'She doesn\'t like apples' },
          { label: 'D', text: 'She don\'t likes apples' },
        ],
        correctAnswers: ['C'],
        difficulty: 2,
      },
      {
        stem: 'What is the past tense of "run"?',
        options: [
          { label: 'A', text: 'Runned' },
          { label: 'B', text: 'Ran' },
          { label: 'C', text: 'Running' },
          { label: 'D', text: 'Runs' },
        ],
        correctAnswers: ['B'],
        difficulty: 1,
      },
      {
        stem: 'Identify the adjective: "The beautiful flower bloomed."',
        options: [
          { label: 'A', text: 'flower' },
          { label: 'B', text: 'beautiful' },
          { label: 'C', text: 'bloomed' },
          { label: 'D', text: 'the' },
        ],
        correctAnswers: ['B'],
        difficulty: 2,
      },
      {
        stem: 'Which is the correct use of "their"?',
        options: [
          { label: 'A', text: 'Their going to the store' },
          { label: 'B', text: 'They\'re books are here' },
          { label: 'C', text: 'Their books are here' },
          { label: 'D', text: 'There books are here' },
        ],
        correctAnswers: ['C'],
        difficulty: 2,
      },
      {
        stem: 'What type of sentence is this? "Stop!"',
        options: [
          { label: 'A', text: 'Declarative' },
          { label: 'B', text: 'Interrogative' },
          { label: 'C', text: 'Imperative' },
          { label: 'D', text: 'Exclamatory' },
        ],
        correctAnswers: ['C'],
        difficulty: 3,
      },
      {
        stem: 'Choose the antonym of "difficult":',
        options: [
          { label: 'A', text: 'Hard' },
          { label: 'B', text: 'Easy' },
          { label: 'C', text: 'Complex' },
          { label: 'D', text: 'Challenging' },
        ],
        correctAnswers: ['B'],
        difficulty: 1,
      },
    ];

    // Insert Math questions
    for (let i = 0; i < mathQuestions.length; i++) {
      const q = mathQuestions[i];
      const topicId = mathTopics.rows[i % mathTopics.rows.length].id;
      
      await query(
        `INSERT INTO questions (subject_id, topic_id, type, stem, options, correct_answers, difficulty, status)
         VALUES ($1, $2, 'single-mcq', $3, $4, $5, $6, 'active')
         ON CONFLICT DO NOTHING`,
        [mathId, topicId, q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswers), q.difficulty]
      );
    }
    
    console.log(`✅ Created ${mathQuestions.length} Math questions`);

    // Insert English questions
    for (let i = 0; i < engQuestions.length; i++) {
      const q = engQuestions[i];
      const topicId = engTopics.rows[i % engTopics.rows.length].id;
      
      await query(
        `INSERT INTO questions (subject_id, topic_id, type, stem, options, correct_answers, difficulty, status)
         VALUES ($1, $2, 'single-mcq', $3, $4, $5, $6, 'active')
         ON CONFLICT DO NOTHING`,
        [engId, topicId, q.stem, JSON.stringify(q.options), JSON.stringify(q.correctAnswers), q.difficulty]
      );
    }
    
    console.log(`✅ Created ${engQuestions.length} English questions\n`);

    // 4. Create demo exam template
    console.log('📋 Creating demo exam template...');
    
    const templateResult = await query(
      `INSERT INTO exam_templates (name, description, created_by)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id`,
      [
        'JAMB Practice Test',
        'A practice test covering Mathematics and English',
        (await query('SELECT id FROM users WHERE role = $1 LIMIT 1', ['admin'])).rows[0].id
      ]
    );
    
    if (templateResult.rows.length > 0) {
      const templateId = templateResult.rows[0].id;
      
      // Add sections
      await query(
        `INSERT INTO exam_sections (template_id, subject_id, time_limit_minutes, num_questions, negative_marking, shuffle_questions, shuffle_options)
         VALUES ($1, $2, 30, 10, false, true, true)`,
        [templateId, mathId]
      );
      
      await query(
        `INSERT INTO exam_sections (template_id, subject_id, time_limit_minutes, num_questions, negative_marking, shuffle_questions, shuffle_options)
         VALUES ($1, $2, 30, 10, false, true, true)`,
        [templateId, engId]
      );
      
      console.log(`✅ Exam template created: ${templateId}\n`);
    }

    console.log('✅ Demo data seeding completed successfully!\n');
    console.log('📝 Demo Credentials:');
    console.log('   Admin: admin@jamb-cbt.com / admin123');
    console.log('   Candidate 1: chidi@example.com / candidate123');
    console.log('   Candidate 2: amina@example.com / candidate123\n');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    await closePool();
  }
}

// Run if called directly
if (require.main === module) {
  seedDemo().catch(console.error);
}

export { seedDemo };
