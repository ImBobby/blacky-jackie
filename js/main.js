;(function ( window, document, undefined ) {

  function log( msg ) {
    return console.log( msg );
  }

  function query( selector ) {
    return document.querySelector( selector );
  }

  function queryAll( selectors ) {
    return document.querySelectorAll( selectors );
  }

  function Card() {

  }

  Card.prototype.getCard = function () {
    var value = Math.floor( Math.random() * 9 + 2 );
    return value;
  };

  function Player( name ) {
    this.name   = name;
    this.money  = 2000;
    this.card   = new Card();
    this.decks  = [];
  }

  /*------------------*
   * Setter Functions *
   *------------------*/

  Player.prototype.setMoney = function ( amount ) {
    this.money = Math.floor(amount);
  };

  Player.prototype.addMoney = function ( amount ) {
    this.setMoney( this.getMoney() + Math.floor(amount) );
  };

  Player.prototype.firstDraw = function ( isDealer ) {
    var ngehe = isDealer || false;

    var cards = [];

    cards.push( this.card.getCard() );
    cards.push( this.card.getCard() );

    this.decks.push( cards[0] );

    if ( cards[0] === 11 && cards[1] === 11 ) {
      log('AHA!');
      this.decks.push( 1 );
    } else {
      this.decks.push( cards[1] );
    }

    if ( ngehe ) {

      if ( this.calculateValue() <= 16 ) {
        while ( this.calculateValue() <= 16 && this.cardsInHand().length < 5 ) {
          this.hitCard();
        }
      } else {
        this.getInfoCardsInHand();
        this.getInfoTotal();
      }

    } else {
      this.getInfoCardsInHand();
      this.getInfoTotal();
    }
  };

  Player.prototype.hitCard = function () {
    var newCard = this.card.getCard();

    if ( newCard === 11 && (this.calculateValue() + newCard) > 21 ) {
      this.decks.push( 1 );
    } else {
      this.decks.push( newCard );
    }

    this.getInfoCardsInHand();
    this.getInfoTotal();
  };

  Player.prototype.resetDecks = function () {
    while( this.decks.length ) {
      this.decks.pop();
    }
  };

  /*------------------*
   * Getter Functions *
   *------------------*/

  Player.prototype.getName = function () {
    return this.name;
  };

  Player.prototype.getMoney = function () {
    return this.money;
  };

  Player.prototype.getInfoTotal = function () {
    var total = this.calculateValue();

    if ( total > 21 ) {
      return log('Total:' + total + '. You are busted.');
    }

    if ( total === 21 ) {
      return log('Total:' + total + '. Black Jack!!!.');
    }

    return log('Total:' + total);
  };

  Player.prototype.getInfoCardsInHand = function () {
    console.clear();
    log('Cards in ' + this.name + '\'s hand:');
    return log( this.cardsInHand() );
  };

  Player.prototype.calculateValue = function () {
    if ( this.decks.length ) {
      var total = this.decks.reduce( function ( a, b ) {
        return a + b;
      });

      return total;
    }

    return 0;
  };

  Player.prototype.cardsInHand = function () {
    return this.decks;
  };

  var App = {

    init: function () {
      var bobby = new Player('Bobby');
      var dealer = new Player('Dealer');

      var info = {
        dealer: query('.info-dealer'),
        player: query('.info-player')
      };

      var btnHit = query('#btnHit');
      var btnReset = query('#btnReset');
      var btnStand = query('#btnStand');

      var scores = {
        player: 0,
        dealer: 0
      };

      var dealerCardsContainer = query('#dealerCards'),
          playerCardsContainer = query('#playerCards'),
          cardTemplate = query('#cardTemplate');

      function clearBoards( container ) {
        while( container.firstChild ) {
          container.removeChild( container.firstChild );
        }
      }

      function renderCards( playerCards, container ) {
        clearBoards( container );

        for (var i = 0; i < playerCards.length; i++) {
          var playerCard = cardTemplate.content,
              value = playerCard.querySelector('span');

          value.textContent = playerCards[i];

          container.appendChild( document.importNode(playerCard, true) );
        }
      }

      function renderScore() {
        var msg = '';

        if ( dealer.calculateValue() ) {
          msg += '<p>Dealer: ';
          msg += dealer.calculateValue();
          msg += '</p>';
        }

        msg += '<p>Player: ';
        msg += bobby.calculateValue();
        msg += '</p>';

        return msg;
      }

      btnHit.addEventListener('click', function () {
        bobby.hitCard();

        info.player.textContent = bobby.calculateValue();

        renderCards( bobby.cardsInHand(), playerCardsContainer );

        if ( bobby.calculateValue() > 21 ) {
          this.setAttribute('disabled', 'disabled');
          btnStand.setAttribute('disabled', 'disabled');
          btnReset.removeAttribute('disabled');

          alertify.alert('You Lose!!!', renderScore());
        } else if ( bobby.calculateValue() === 21 ) {
          btnStand.click();
        }

        if ( bobby.cardsInHand().length === 5 ) {
          btnStand.click();
        }
      }, false);

      btnReset.addEventListener('click', function () {
        bobby.resetDecks();
        dealer.resetDecks();

        clearBoards( playerCardsContainer );
        clearBoards( dealerCardsContainer );

        bobby.firstDraw();

        info.dealer.textContent = '?';
        info.player.textContent = bobby.calculateValue();

        renderCards( bobby.cardsInHand(), playerCardsContainer );
        this.setAttribute('disabled', 'disabled');
        btnHit.removeAttribute('disabled');
        btnStand.removeAttribute('disabled');
      }, false);

      btnStand.addEventListener('click', function () {
        scores.player = bobby.calculateValue();

        dealer.firstDraw(true);
        scores.dealer = dealer.calculateValue();
        log(bobby.cardsInHand());
        log(dealer.cardsInHand());

        info.dealer.textContent = scores.dealer;

        renderCards( dealer.cardsInHand(), dealerCardsContainer );

        console.log( scores );

        if ( scores.dealer > 21 ) {
          alertify.alert('You Win', renderScore());
        } else if ( scores.dealer === scores.player ) {
          alertify.alert('You Lose', renderScore());
        } else if ( scores.dealer > scores.player ) {
          alertify.alert('You Lose', renderScore());
        } else if ( scores.dealer < scores.player ) {
          alertify.alert('You Win', renderScore());
        }

        this.setAttribute('disabled', 'disabled');
        btnHit.setAttribute('disabled', 'disabled');
        btnReset.removeAttribute('disabled');
        // clearBoards( playerCardsContainer );
        // clearBoards( dealerCardsContainer );
      }, false);
    }

  };

  App.init();

})( window, document );