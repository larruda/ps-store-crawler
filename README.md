ps-store-crawler
================

A simple script based on CasperJS which craws and purchases FREE games from the PlayStation Store(R) to your account.

### Usage
```bash
casperjs craw.js --username={username} --password={password} [--psn-plus-member]
```

By defaut it craws only [Free To Play](https://store.sonyentertainmentnetwork.com/#!/en-us/free-to-play/cid=STORE-MSF77008-PS3F2PPS3) games.

Use `--psn-plus-member` option in order to buy also from the [PS Plus Free Games page](https://store.sonyentertainmentnetwork.com/#!/en-us/free-games/cid=STORE-MSF77008-PSPLUSFREEGAMES).

### Dependencies
* [CasperJS](http://casperjs.org/)
