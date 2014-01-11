// Focus input
Mousetrap.bind(['command+n', 'ctrl+n'], function(e) {
  $('.input-trckr-add input').focus();
  return false;
});

// List
Mousetrap.bind(['command+l', 'ctrl+l'], function(e) {
  window.location = "#/";
  return false;
});

// Overview
Mousetrap.bind(['command+o', 'ctrl+o'], function(e) {
  window.location = "#/overview";
  return false;
});

