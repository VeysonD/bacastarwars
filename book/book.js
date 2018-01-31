window.Book = {
  init: function(frame, store) {
    var $frame = $('#test-frame');
    var $body = $('body');

    var html =  '<section class="container">' +
                  '<div id="characters" class="characters-container">Characters' +
                  '</div>' +
                  '<div class="character-info" id="info">Character info'  + '<div id="character-card" class="welcome">Welcome to Base Case Star Wars</div>' +
                  '</div>' +
                '</section>';

    // retrieve characters
    console.log(store);
    $body.append(html);

    // Add characters to page
    this.addCharacters(store);
    // Add API to cache for further use later
    this.useCache({
      method: 'INITIALIZE',
      store: store
    });
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
    console.log('WHAT IS CACHE DATA:', cache);
    if (cache.method === 'STORE') {
      window.Cache.characters = cache.data;
      console.log('What is the cache:', window.Cache);
    } else if (cache.method === 'RETRIEVE') {
      return window.Cache.characters.filter(function(character) {
        return character.id === id;
      })
    } else if (cache.method === 'UPDATE CACHE') {
      window.Cache.store.getCharacterDetails(id).then(function(character) {
        window.Cache.characters.forEach(function(ch) {
          if (ch.id === id) {
            ch.description = character.description;
            ch.picture = character.picture;
          }
        });
        console.log('Updating cache:', window.Cache);
        return character;
      })
    } else if (cache.method === 'INITIALIZE') {
      window.Cache.store = cache.store;
    }
  },
  handleClick: function(id) {
    Book.renderInfo((id.split('-')[1] - 0));
  },
  renderInfo: function(index) {
    var html;
    var info = document.getElementById('info');
    var characterCard = document.getElementById('character-card');

    // Retrieve character by index
    var character = Book.useCache({
      method: 'RETRIEVE'
    }, index)[0];


    // console.log('What is the character info:', character);
    // console.log('What is character description:', character.description);
    // console.log('What is the info:', window.Cache);
    // Check if character is cached, if it isn't then cache it
    if (!character.description) {
      Book.useCache({
        method: 'UPDATE CACHE'
      }, index);
    }

    // Clean up previous Info
    if (characterCard) {
      characterCard.parentNode.removeChild(characterCard);
    }
    // Render new info

  }
}

window.Cache = {};
