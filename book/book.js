window.Book = {
  init: function(frame, store) {
    var $frame = $('#test-frame');
    var $body = $('body');

    var html =  '<section class="container">' +
                  '<div class="list" id="list"><h1>Characters</h1>' +
                    '<div id="characters"></div>' +
                  '</div>' +
                  '<div class="character-info" id="info">Character info'  + '<div id="character-card" class="welcome">Welcome to Base Case Star Wars</div>' +
                  '</div>' +
                '</section>';


    $body.append(html);
    // $frame.append(html);

    // Add characters to page
    this.addCharacters(store);
    // Add API to cache for further use later
    this.useCache({
      method: 'INITIALIZE',
      store: store
    });
  },
  addCharacters: function(store) {
    var store = store;
    var initial = true;
    var $list = $('#list');
    var $characters;
    var cache = {
      method: 'STORE'
    };

    // Clean previous list
    Book.cleanPreviousList();
    $characters = $('#characters');

    // If the store has already been cached
    if (!store) {
      intial = false;
      characters = window.Cache.characters;

      // Append each character to the characters column
      characters.forEach(function(character) {
        var charHtml = `<div class="item" id="character-${character.id}">` +
                          '<div class="name">' +
                            character.name +
                          '</div>' +
                          '<div class="species">Species: ' + character.species +
                          '</div>' +
                        '</div>';
        $characters.append(charHtml);
      });

      // Add listeners to all the characters
      Book.addListListeners();
    } else {
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

        // Initialize cache if haven't already
          cache.data = characters;
          Book.useCache(cache);

        // Append each character to the characters column
        characters.forEach(function(character) {
          var charHtml = `<div class="item" id="character-${character.id}">` +
                            '<div class="name">' +
                              character.name +
                            '</div>' +
                            '<div class="species">Species: ' + character.species +
                            '</div>' +
                          '</div>';
          $characters.append(charHtml);
        });

        // Add listeners to all the characters
        Book.addListListeners();
      });
    }
  },
  addCancelListener: function() {
    var cancel = document.getElementsByClassName('cancel');

    cancel[0].addEventListener('click', function() {
      Book.handleCancelClick();
    });
  },
  addEditListener: function() {
    var edit = document.getElementsByClassName('edit');

    edit[0].addEventListener('click', function(event) {
      Book.handleEditClick((this.id.split('-')[1] - 0));
    });
  },
  addListListeners: function() {
    var characters = document.getElementsByClassName('item');

    for (var i = 0; i < characters.length; i++) {
      characters[i].addEventListener('click', function(event) {
        Book.handleListClick(this.id);
      });
    };

  },
  addSaveListener: function() {
    var save = document.getElementsByClassName('save');

    save[0].addEventListener('click', function(event) {
      Book.handleSaveClick((this.id.split('-')[1] - 0));
    })
  },
  cleanPreviousList: function() {
    var $list = $('#list');
    var characterList = document.getElementById('characters');

    $list.append('<div id="characters"></div>');

    // Clean up previous render
    if (characterList) {
      characterList.parentNode.removeChild(characterList);
    };
  },
  cleanPreviousInfo: function() {
    var characterCard = document.getElementById('character-card');

    // Clean up previous render
    if (characterCard) {
      characterCard.parentNode.removeChild(characterCard);
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
          resolve(character);
        })
      });
      // Initialize Cache
    } else if (cache.method === 'INITIALIZE') {
      window.Cache.store = cache.store;
    } else if (cache.method === 'UPDATE STORE') {
      // Update store characters
      window.Cache.store.updateCharacter(cache.updateCharacter).then(function() {
        // Update cache characters
        window.Cache.characters.forEach(function(character, index) {
          if (character.id === cache.updateCharacter.id) {
            window.Cache.characters[index] = cache.updateCharacter;
          }
        });
      });
    }
  },
  handleCancelClick: function() {
    Book.cleanPreviousInfo();
    Book.addCharacters();
  },
  handleEditClick: function(id) {
    var $info = $('#info');
    var character = Book.useCache({
      method: 'RETRIEVE',
    }, id)[0];
    var html =  '<form id="character-card" name="editor" class="editor">' +
                  '<div class="picture">' +
                    `<img src="./${character.picture}" class="editor-picture" alt="picture of ${character.name}">` +
                  '</div>' +
                  'Name: ' + `<input type="text" name="name" class="editor-name" placeholder="${character.name}" required>` + '<br>' +
                  'Species: ' + `<input type="text" name="species" class="editor-species" placeholder="${character.species}" required>` + '<br>' + 'Description: ' +
                  `<input type="text" name="description" class="editor-description" placeholder="${character.description}" required>` + '<br>' +
                 `<button class="save" id="save-${character.id}">Save</button>` +
                `<button class="cancel">Cancel</button>` +
              '</form>';

    Book.cleanPreviousInfo();
    $info.append(html);
    Book.addSaveListener();
    Book.addCancelListener();
  },
  handleListClick: function(id) {
    Book.cleanPreviousInfo();
    Book.renderInfo((id.split('-')[1] - 0));
  },
  handleSaveClick: function(id) {
    var updatedCharacter = {id: id};
    var character;

    updatedCharacter.name = document.getElementsByClassName('editor-name')[0].value;
    updatedCharacter.species = document.getElementsByClassName('editor-species')[0].value;
    updatedCharacter.description = document.getElementsByClassName('editor-description')[0].value;

    // Use Regex here for more dynamic photo loading
    character = Book.useCache({
      method: 'RETRIEVE'
    }, id)[0];
    updatedCharacter.picture = character.picture;

    Book.useCache({
      method: 'UPDATE STORE',
      updateCharacter: updatedCharacter
    });

    // Clear page and re-add updated characters
    Book.cleanPreviousInfo();
    Book.cleanPreviousList();
    Book.addCharacters();
  },
  renderCharacter: function(character) {
    var html;
    var $info = $('#info');
    html =  '<div id="character-card" class="details">' +
              '<div class="picture">' +
                `<img src="./${character.picture}">` +
              '</div>' +
              '<div class="name">' + character.name + '</div>' +
              '<div class="species">' + character.species + '</div>' +
              '<div class="description">' + character.description + '</div>' +
              `<button class="edit" id="edit-${character.id}">Edit</button>` +
            '</div>';
    $info.append(html);
    Book.addEditListener();
  },
  renderInfo: function(index) {
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
  }
}

window.Cache = {};
