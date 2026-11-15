INSERT IGNORE INTO `categories` (`id`, `name`, `slug`) VALUES
  (1, 'Communication', 'communication'),
  (2, 'Product', 'product'),
  (3, 'Systems', 'systems'),
  (4, 'Engineering', 'engineering');

INSERT IGNORE INTO `courses` (`id`, `categoryId`, `title`, `slug`, `description`, `instructorName`, `level`, `durationMinutes`, `lessonCount`, `accent`, `status`) VALUES
  (1, 1, 'Strategic Storytelling', 'strategic-storytelling', 'Turn complex thinking into stories people can remember, repeat, and act on.', 'Alex Morgan', 'Intermediate', 260, 8, 'coral', 'published'),
  (2, 2, 'Product Discovery Sprint', 'product-discovery-sprint', 'A practical field guide for moving from fuzzy questions to useful evidence.', 'Priya Nair', 'Beginner', 220, 4, 'lilac', 'published'),
  (3, 3, 'Research Ops Foundations', 'research-ops-foundations', 'Make customer learning easier to run, share, and repeat across your team.', 'Jules Park', 'Intermediate', 170, 2, 'sage', 'published'),
  (4, 4, 'TypeScript for Interface Builders', 'typescript-for-interface-builders', 'Write safer UI code without losing the speed that made you love prototyping.', 'Noah Williams', 'Advanced', 190, 2, 'blue', 'published');

INSERT IGNORE INTO `modules` (`id`, `courseId`, `title`, `description`, `orderIndex`) VALUES
  (1, 1, 'Find the signal', 'Start with what matters.', 1),
  (2, 1, 'Build the arc', 'Give the idea somewhere to go.', 2),
  (3, 1, 'Make it useful', 'End with a next step.', 3),
  (4, 2, 'Start with the unknown', 'Make space for better questions.', 1),
  (5, 2, 'Gather useful evidence', 'Go where the signal is.', 2),
  (6, 3, 'Make learning repeatable', 'A system is a kindness.', 1),
  (7, 4, 'A safer canvas', 'Types without ceremony.', 1);

INSERT IGNORE INTO `lessons` (`id`, `moduleId`, `title`, `summary`, `content`, `durationMinutes`, `orderIndex`, `status`) VALUES
  (1, 1, 'Why stories move decisions', 'A short history of narrative as a decision tool.', '<p>Stories help teams decide because they make change visible.</p>', 8, 1, 'published'),
  (2, 1, 'Name the tension', 'Find the human question inside the business question.', '<p>Name the tension before you write the answer.</p>', 12, 2, 'published'),
  (3, 1, 'Choose the audience', 'Make the listener part of the story architecture.', '<p>A useful story starts with a specific listener.</p>', 10, 3, 'published'),
  (4, 2, 'Build the narrative spine', 'Use a simple arc to make complex thinking memorable.', '<p>A narrative spine gives your idea a clear direction.</p>', 16, 1, 'published'),
  (5, 2, 'Make the turn', 'Create the moment when the audience sees the new possibility.', '<p>The turn is the moment a new possibility becomes believable.</p>', 14, 2, 'published'),
  (6, 2, 'Edit for momentum', 'Remove the details that keep a good idea from moving.', '<p>Edit every detail that does not help the listener cross the bridge.</p>', 11, 3, 'published'),
  (7, 3, 'From story to decision', 'Turn a compelling narrative into a useful ask.', '<p>End with the decision your story makes possible.</p>', 18, 1, 'published'),
  (8, 3, 'Practice: the 90-second brief', 'Apply the framework to your own work.', '<p>Practice the story in 90 seconds.</p>', 22, 2, 'published'),
  (9, 4, 'What are we trying to learn?', 'Separate assumptions from evidence.', '<p>Write down what you need to learn before choosing a solution.</p>', 11, 1, 'published'),
  (10, 4, 'Map the assumptions', 'See the risks hiding inside a confident roadmap.', '<p>Map assumptions by impact and uncertainty.</p>', 14, 2, 'published'),
  (11, 5, 'Write a learning brief', 'Give research a clear point of view.', '<p>A learning brief turns curiosity into a useful plan.</p>', 17, 1, 'published'),
  (12, 5, 'Run the first conversation', 'A simple guide to asking better questions.', '<p>Ask open questions and listen for the language people use.</p>', 20, 2, 'published'),
  (13, 6, 'The research operating model', 'Build the smallest system that makes learning easier.', '<p>Make research repeatable with lightweight rituals.</p>', 13, 1, 'published'),
  (14, 6, 'Create your research intake', 'Help teams ask for the right thing at the right time.', '<p>Use an intake form to clarify decisions and constraints.</p>', 15, 2, 'published'),
  (15, 7, 'The shape of a component', 'Use types to make your UI easier to change.', '<p>Types can make components easier to refactor.</p>', 16, 1, 'published'),
  (16, 7, 'Props that explain themselves', 'Let your interfaces document the design.', '<p>Good props make intent visible at the call site.</p>', 19, 2, 'published');
