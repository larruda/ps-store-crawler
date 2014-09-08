var LOGIN_URL, 
    LOGIN_USERNAME, 
    LOGIN_PASSWORD,
    FREE_TO_PLAY_URL,
    FREE_GAMES_URL,
    games;

var casper = require('casper').create({
    viewportSize: {
        width: 1024,
        height: 768
    },
    verbose: true,
    logLevel: 'debug'
});

if (!casper.cli.has('username') && !casper.cli.has('password')) {
     casper.echo('Usage: $ casperjs craw.js --username=USERNAME --password=PASSWORD').exit(-1);
}

LOGIN_USERNAME = casper.cli.get('username');
LOGIN_PASSWORD = casper.cli.get('password');
LOGIN_URL = 'https://auth.api.sonyentertainmentnetwork.com/login.jsp';
FREE_GAMES_URL = 'https://store.sonyentertainmentnetwork.com/#!/en-us/free-games/cid=STORE-MSF77008-PSPLUSFREEGAMES';
FREE_TO_PLAY_URL = 'https://store.sonyentertainmentnetwork.com/#!/en-us/free-to-play/cid=STORE-MSF77008-PS3F2PPS3';

var urls = [];
urls.push(FREE_TO_PLAY_URL);
if (casper.cli.has('psn-plus-member')) {
    urls.push(FREE_GAMES_URL);
}

casper.start(LOGIN_URL, function() {
    'use strict';
    this.echo('Logging in...');
    this.echo(this.getTitle());

    this.fill('#signInForm', {
        'j_username': LOGIN_USERNAME,
        'j_password': LOGIN_PASSWORD
    }, true);
});

casper.waitForUrl(/loginSuccess\.jsp$/, function() {
    this.echo('Login successful!');
}, function() {
    this.echo('Failed to login.', 'ERROR').exit(-1);
});

casper.eachThen(urls, function(response) {  
    this.thenOpen(response.data, function(response) {
        'use strict';  
        this.echo(this.getTitle());

        casper.waitUntilVisible(".addToCartBtn", function() {
            this.echo("I waited for 10 secs...");

            games = this.evaluate(function(){
                var elements = document.querySelectorAll(".cellGridGameStandard:not(.ownAlready)");
                games = [];
                [].forEach.call(elements, function(element, index) {
                    if (!element.classList.contains('ownAlready')) {
                        games.push({ 
                            'id': element.id, 
                            'title': element.querySelector(".cellTitle").innerHTML
                        });
                    }
                });

                return games;
            });

            if (games.length == 0) {
                this.echo("No free donuts for you today, brotha!");
            }

            this.echo("Found out " + games.length + " left FREE games!");

            games.forEach(function(game, index) {
                casper.echo("Title: " + game.title);
            });

            this.echo('Purchasing title "' + games[0].title + '".');

            
        }, function() {
            this.echo("Houston, we have a problem!", 'ERROR');
        }, 15000);
    });
});

casper.then(function() {
    if (!games.length) {
        this.exit();
    }

    if (!this.visible('#' + games[0].id + ' .addToCartBtn')) {
        this.echo('This title is already on cart. Please remove it so I can purchase it.').exit(-1);
    }

    this.click('#' + games[0].id + ' .addToCartBtn');

    this.waitForSelector("#_modal_content .showCartBtn", function(){
        casper.click('#_modal_content .showCartBtn');
    });
});

casper.waitForSelector('.familyCellGridCart', function() {
    this.click('a.proceedBtn');
});

casper.waitForSelector("a.actionBtn", function(){
    this.echo("On Cart: " + this.fetchText('.firstCell .title'));
    this.click('a.actionBtn');
});

casper.waitForSelector('.orderSummary .receiptMsg', function() {
    this.echo(this.fetchText('.orderSummary .receiptMsg'));
}, function(){

}, 15000);

casper.run();