const d = document;
const h = document.getElementsByTagName('head')[0];

function editTitle(titlePrefix) {
  let title = d.title;
  if (!title) {
    title = d.location.host + d.location.pathname;
  }
  d.title = titlePrefix + title;
}

function createFavicon(dataURI) {
  const lnk = d.createElement('link');
  lnk.rel = 'shortcut icon';
  lnk.type = 'image/x-icon';
  lnk.href = dataURI;
  h.appendChild(lnk);
}

// Remove any existing favicons
function clearFavicons() {
  const links = h.getElementsByTagName('link');
  const listOfRemovals = [];
  for (let i = 0, j = links.length; i < j; i++) {
    const curLink = links[i];
    if (curLink && (curLink.rel === 'shortcut icon' || curLink.rel === 'icon')) {
      listOfRemovals.push(curLink);
    }
  }
  for (let i = 0, j = listOfRemovals.length; i < j; i++) {
    h.removeChild(listOfRemovals[i]);
  }
}

function handleMessage(request, sender) {
  if (sender.id === 'favicon-customizer@th3indexer') {
    if (request.dataURI && request.dataURI.startsWith('data:image/png')) {
      clearFavicons();
      createFavicon(request.dataURI);
    } else {
      console.error(`Content wasn't a png so this is a no-op`);
    }
    if (request.titlePrefix) {
      editTitle(request.titlePrefix);
    }
  }
}

browser.runtime.onMessage.addListener(handleMessage);
