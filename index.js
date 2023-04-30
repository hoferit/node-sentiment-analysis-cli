import fs from 'node:fs';

const input = process.argv[2];

if (!input) {
  console.error('Please provide a text string or file path.');
  process.exit(1);
}

let text;
if (input.endsWith('.txt')) {
  // If the input ends with .txt, assume it's a file path and read its contents
  text = fs.readFileSync(input, 'utf-8');
} else {
  // Otherwise, assume it's a word and use it directly
  text = input;
}
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

    const negativePercent =
      Math.round(array.probability.neg * 100) + '% negative';
    const neutralPercent =
      Math.round(array.probability.neutral * 100) + '% neutral';
    const positivePercent =
      Math.round(array.probability.pos * 100) + '% positive';

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
