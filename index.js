import fs from 'node:fs';
import readline from 'node:readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getTextFromPrompt = () =>
  new Promise((resolve) => {
    rl.question('Please provide a text string or file path: ', (answer) => {
      resolve(
        answer.endsWith('.txt') ? fs.readFileSync(answer, 'utf-8') : answer,
      );
    });
  });

const getTextFromArgs = (input) =>
  input.endsWith('.txt') ? fs.readFileSync(input, 'utf-8') : input;

async function analyzeSentiment(text) {
  try {
    const response = await fetch('http://text-processing.com/api/sentiment/', {
      method: 'POST',
      body: new URLSearchParams({ text }),
    });

    const json = await response.json();

    const negativePercent = Math.round(json.probability.neg * 100) + '%';
    const neutralPercent = Math.round(json.probability.neutral * 100) + '%';
    const positivePercent = Math.round(json.probability.pos * 100) + '%';

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
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  const input = process.argv[2];
  const text = input ? getTextFromArgs(input) : await getTextFromPrompt();
  await analyzeSentiment(text);
  rl.close();
}

main().catch(console.error);
