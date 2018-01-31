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

    this.addCharacters(store);
    // this.addListeners();
  },
  addCharacters: function(store) {
    var $characters = $('#characters');
    var cache = {
      method: 'STORE'
    };

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
      cache.data = characters;
      Book.useCache(cache);
      // console.log('promise resolved:', characters);
//  onClick="handleClick(' + 0 +')"
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

      // Add listeners to all the characters
      Book.addListeners();
    });
  },
  addListeners: function() {
    var characters = document.getElementsByClassName('character');

    for (var i = 0; i < characters.length; i++) {
      characters[i].addEventListener('click', function(event) {
        Book.handleClick(this.id);
      })
    };

  },
  useCache: function(cache, id) {
    console.log('WHAT IS DATA:', cache)
    if (cache.method === 'STORE') {
      window.Cache = cache.data;
      console.log('What is the cache:', window.Cache);
    } else if (method.method === 'RETRIEVE') {
      return window.Cache[id - 1];
    }
  },
  handleClick: function(id) {
    console.log(id);
  },
}

window.Cache = [];
