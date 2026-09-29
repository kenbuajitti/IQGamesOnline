/* Keep this catalogue tab separate from the player's running Unity game. */
(function () {
  'use strict';
  var browsingFromGame = new URLSearchParams(location.search).get('iqreturn') === '1';
  if (!browsingFromGame) return;

  var bar = document.createElement('aside');
  bar.className = 'game-return-bar';
  bar.setAttribute('aria-label', 'Return to your game');
  var button = document.createElement('button');
  button.type = 'button';
  button.textContent = '← RETURN TO YOUR GAME';
  var note = document.createElement('span');
  note.setAttribute('role', 'status');
  note.textContent = 'Your game is in the original tab.';
  button.addEventListener('click', function () {
    window.close();
    // Some browsers cannot close tabs created through their own UI.
    window.setTimeout(function () {
      note.textContent = 'Switch to your original game tab, or close this tab to return.';
      note.tabIndex = -1;
      note.focus();
    }, 150);
  });
  bar.appendChild(button);
  bar.appendChild(note);
  document.body.insertBefore(bar, document.body.firstChild);

  // Carry the return control through every catalogue page. Opening another
  // game keeps this catalogue and the original running game available.
  document.querySelectorAll('a[href]').forEach(function (link) {
    var raw = link.getAttribute('href');
    if (!raw || raw.charAt(0) === '#') return;
    var url = new URL(raw, location.href);
    if (url.origin === location.origin) {
      url.searchParams.set('iqreturn', '1');
      link.href = url.href;
    } else if (url.protocol === 'https:' || url.protocol === 'http:') {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  });
}());
