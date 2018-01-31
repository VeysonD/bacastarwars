window.Book = {
  init: function(frame, store) {
    var $frame = $('#test-frame');
    var $body = $('body');

    var html =  '<section class="container">' +
                  '<div id="characters" class="characters-container">Characters' +
                  '</div>' +
                  '<div class="character-info">Character info</div>' +
                '</section>';

    // retrieve characters
    console.log(this);
    $body.append(html);
    document.getElementById('characters').addEventListener('click', function(event) {
      console.log(event.target);
    });

    this.addCharacters(store);
  },
  addCharacters: function(store) {
    var $characters = $('#characters');

    // API call to store to retrieve characters
    store.getCharacters().then(function(characters) {
      // sort characters alphabetically
      characters.sort(function(a, b) {
        var charA = a.name.toUpperCase();
        var charB = b.name.toUpperCase();

        if (charA < charB) {
          return -1;
        } else if (charA > charB) {
          return 1;
        } else {
          return 0;
        }
      });
      // console.log('promise resolved:', characters);

      // Append each character to the characters column
      characters.forEach(function(character) {
        var charHtml =  '<div class="character" id=character-' + character.id+'>' +
                          '<div class="character-name">' + character.name +
                          '</div>' +
                          '<div class="character-species">Species: ' + character.species +
                          '</div>' +
                        '</div>';
        $characters.append(charHtml);
      });
    });
  }
}
