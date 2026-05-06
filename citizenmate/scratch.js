const { marked } = require('marked');

const content = `
## Hello World
This is **bold**.
<QuizCTA title="Test" text="Hello" />
`;
console.log(marked(content));
