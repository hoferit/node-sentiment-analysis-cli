import fs from 'node:fs';
import readline from 'node:readline';

const input = process.argv[2];
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

if (!input) {
  rl.question('Please provide a text string or file path: ', (answer) => {
    let text;
    if (answer.endsWith('.txt')) {
      // If the input ends with .txt, assume it's a file path and read its contents
      text = fs.readFileSync(answer, 'utf-8');
    } else {
      // Otherwise, assume it's a word and use it directly
      text = answer;
    }
    analyzeSentiment(text);
    rl.close();
  });
} else {
  let text;
  if (input.endsWith('.txt')) {
    // If the input ends with .txt, assume it's a file path and read its contents
    text = fs.readFileSync(input, 'utf-8');
  } else {
    // Otherwise, assume it's a word and use it directly
    text = input;
  }
  analyzeSentiment(text);
}

async function analyzeSentiment(text) {
  await fetch('http://text-processing.com/api/sentiment/', {
    method: 'POST',
    body: new URLSearchParams({
      text,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      const sentimentData = JSON.stringify(json);
      const array = JSON.parse(sentimentData);

      const negativePercent = Math.round(array.probability.neg * 100) + '%';
      const neutralPercent = Math.round(array.probability.neutral * 100) + '%';
      const positivePercent = Math.round(array.probability.pos * 100) + '%';

      const mood =
        positivePercent > negativePercent
          ? 'positive'
          : positivePercent < negativePercent
          ? 'negative'
          : 'neutral';

      console.log(`The mood of your text is ${mood}.`);
      console.log(`Positive: ${positivePercent}`);
      console.log(`Neutral: ${neutralPercent}`);
      console.log(`Negative: ${negativePercent}`);
    });
}
