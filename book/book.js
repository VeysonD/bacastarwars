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
    // Store character data
    if (cache.method === 'STORE') {
      window.Cache.characters = cache.data;
    // Retrieve character data
    } else if (cache.method === 'RETRIEVE') {
      return window.Cache.characters.filter(function(character) {
        return character.id === id;
      })
    // Update cache
    } else if (cache.method === 'UPDATE CACHE') {
      return new Promise(function(resolve, reject) {
        window.Cache.store.getCharacterDetails(id).then(function(character) {
          window.Cache.characters.forEach(function(ch) {
            if (ch.id === id) {
              ch.description = character.description;
              ch.picture = character.picture;
            }
          });
          console.log('Updating cache:', window.Cache);
          resolve(character);
        })
      });
    } else if (cache.method === 'INITIALIZE') {
      window.Cache.store = cache.store;
    }
  },
  handleClick: function(id) {
    Book.renderInfo((id.split('-')[1] - 0));
  },
  renderCharacter: function(character) {
    var html;
    var $info = $('#info');
    html = '<div id="character-card" class="character-details">' + '<div class=picture>' + `<img src="./${character.picture}">` + '</div>'+ '</div>' +
    '</div>';
    $info.append(html);
  },
  renderInfo: function(index) {
    var characterCard = document.getElementById('character-card');

    // Retrieve character by index
    var character = Book.useCache({
      method: 'RETRIEVE'
    }, index)[0];


    // Render and Check if character is cached, if it isn't then cache it
    if (!character.description) {
      character = Book.useCache({
        method: 'UPDATE CACHE'
      }, index).then(function(character) {
        Book.renderCharacter(character);
      });
    } else {
      Book.renderCharacter(character);
    };

    // Clean up previous render
    if (characterCard) {
      characterCard.parentNode.removeChild(characterCard);
    };
  }
}

window.Cache = {};
