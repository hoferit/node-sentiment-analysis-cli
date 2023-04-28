const inputString = process.argv[2];
await fetch('http://text-processing.com/api/sentiment/', {
  method: 'POST',
  body: new URLSearchParams({
    text: inputString,
  }),
})
  .then((response) => response.json())
  .then((json) => {
    const sentimentData = JSON.stringify(json);
    const array = JSON.parse(sentimentData);

    console.log(array);
  });
