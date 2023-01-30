// Get the save button element
var saveBtn = document.getElementById("saveBtn");

// Add an event listener to the button to save the API key to chrome.storage
saveBtn.addEventListener("click", function () {
  var apiKey = document.getElementById("apiKey").value;
  chrome.storage.sync.set({ apiKey: apiKey }, function () {
    // console.log(`api key saved as: ${chrome.storage.sync.get("apiKey")}`);
    alert("API key saved.");
  });
});

// On page load, get the current API key from chrome.storage and set it in the input field
chrome.storage.sync.get("apiKey", function (data) {
  document.getElementById("apiKey").value = data.apiKey;
});
