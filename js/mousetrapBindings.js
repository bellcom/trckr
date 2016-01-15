/**
 * Mousetrap stuff
 */
Mousetrap.bind(['command+n', 'ctrl+n'], function(e) {
  $('#js-add-task').click();
  return false;
});

Mousetrap.bind(['command+f', 'ctrl+f'], function(e) {
  $('#js-add-faciendo').click();
  $('#js-faciendo-task').focus();
  return false;
});
