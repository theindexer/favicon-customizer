const SETTINGS_KEY = 'mrl-favicon-customizer';
let faviconData = [];

function onError(error) {
  console.error(`Error: ${error}`);
}

function handleTabChange(tabId, changeInfo, tab) {
  // Inspect the tab when it's completely loaded and find out if we need
  // to make a favicon change.
  if (changeInfo && changeInfo.status && changeInfo.status === 'complete') {
    let loaded = false;
    faviconData.forEach((item) => {
      let tabMatched = false;
      if (item.origin) {
        if (tab.url.match(item.origin)) {
          tabMatched = true;
        }
      }

      if (tabMatched && (item.base64 || item.titlePrefix)) {
        const executing = loaded ? Promise.resolve(loaded) : browser.tabs.executeScript({
          file: '/change-favicon.js',
        });
        loaded = true;
        executing
          .then(() => {
            return browser.tabs.sendMessage(tab.id, { dataURI: item.base64, titlePrefix: item.titlePrefix });
          })
          .catch(onError);
      }
    });
  }
}

function handleStorageChange(changes) {
  if (changes[SETTINGS_KEY]) {
    faviconData = changes[SETTINGS_KEY].newValue;
  }
}

browser.tabs.onUpdated.addListener(handleTabChange);
browser.tabs.onCreated.addListener(handleTabChange);
browser.storage.onChanged.addListener(handleStorageChange);
browser.storage.local.get(SETTINGS_KEY)
  .then((results) => {
    faviconData = results[SETTINGS_KEY];
  })
  .catch(onError);
