/**
 * Add a link to Wikipedia search above Google search results.
 *
 * This project is licensed under the terms of the MIT license.
 *
 * @author      Jack Kingsman <jack.kingsman@gmail.com>
 *
 */
"use strict";

let parentElem;

function elementReady(selector) {
  // Function author: jwilson8767; https://gist.github.com/jwilson8767/db379026efcbd932f64382db4b02853e
  // MIT Licensed

  return new Promise((resolve, reject) => {
    let el = document.querySelector(selector);
    if (el) {
      resolve(el);
      return;
    }

    new MutationObserver((mutationRecords, observer) => {
        // Query for elements matching the specified selector
        Array.from(document.querySelectorAll(selector)).forEach((element) => {
          resolve(element);
          //Once we have resolved we don't need the observer anymore.
          observer.disconnect();
        });
      })
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });
  });
}

function createWikiLinkElement(query) {
  const a = document.createElement('a');
  a.href = `https://en.wikipedia.org/w/index.php?search=${query}`;
  a.target = '_blank';
  a.rel = 'noreferrer noopener';
  a.referrerpolicy = 'no-referrer';
  return a;
}

function parseAndInjectAtTopOfElem(elem) {

  const query = (new URLSearchParams(window.location.search.slice(1))).get("q");
  if (query) {
    const mainLink = createWikiLinkElement(query)
    mainLink.innerHTML = `🔗 '${query}' on Wikipedia`
    elem.prepend(mainLink);

    const suggestion = document.querySelector('b > i');
    if (suggestion) {
      const suggestedLink = createWikiLinkElement(suggestion.textContent)
      suggestedLink.innerHTML = `'${suggestion.textContent}'`
      console.log(suggestedLink.outerHTML)
      const joinerText = document.createElement('span');
      joinerText.innerHTML = ` (or suggested ${suggestedLink.outerHTML})`;

      mainLink.after(joinerText);
    }
  }
}

elementReady('#search').then((elem)=>{parseAndInjectAtTopOfElem(elem)});
