// function to get the selected text from the current active tab
function translateToIPA() {
  let selectedText = window.getSelection().toString();
  return selectedText;
}

// add click event listener to the "transcribe" button
document.getElementById("transcribe").addEventListener("click", () => {
  // get the currently active tab in the current window
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    // execute the translateToIPA function in the active tab
    chrome.scripting
      .executeScript({
        target: { tabId: tabs[0].id },
        func: translateToIPA,
      })
      .then((selectedText) => {
        // log the selected text
        console.log(`original text: ${selectedText[0].result}`);

        // display the selected text in the "original" span
        document.getElementById("original").innerHTML = selectedText[0].result;

        // get the stored OpenAI API key
        chrome.storage.sync.get("apiKey", (data) => {
          // get the selected language from the dropdown
          var language = document.getElementById("language").value;

          // check if the API key is stored
          if (data.apiKey) {
            // create an XMLHttpRequest object to send a POST request to the OpenAI API
            const http = new XMLHttpRequest();
            http.open("POST", "https://api.openai.com/v1/completions", true);
            http.setRequestHeader("Content-Type", "application/json");
            http.setRequestHeader("Authorization", `Bearer ${data.apiKey}`);
            http.onreadystatechange = () => {
              // check if the response is ready and the status code is 200 (OK)
              if (http.readyState === 4 && http.status === 200) {
                // parse the response as JSON
                const response = JSON.parse(http.responseText);
                // log the response
                console.log(`response: ${response}`);
                // get the first choice of the response and extract the text
                const IPA = response.choices[0].text;
                // log the IPA transcription
                console.log(`IPA: ${IPA}`);
                // display the IPA transcription in the "ipa" span
                document.getElementById("ipa").innerHTML = IPA;
              }
            };
            // send the request with the specified prompt
            http.send(
              JSON.stringify({
                model: "text-davinci-003",
                prompt: `Translate input to ${language}.
                Input: ${selectedText[0].result}
                Output:
                `,
                max_tokens: 100,
                temperature: 0,
              })
            );
          } else {
            // show an error message if the API key is not stored
            alert(
              "Please add your OpenAI API key to the chrome extension options."
            );
          }
        });
      });
  });
});
