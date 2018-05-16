# Memo on setting up boilerplate solidity project

## Set up new node.js project

Create package.json interactively

    npm init

Resulting package.json

    {
      "name": "ethmoneybox",
      "version": "1.0.0",
      "description": "moneybox contract for ethereum network written in solidity",
      "main": "index.js",
      "scripts": {
        "test": "truffle test"
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/mxpaul/ethmoneybox.git"
      },
      "keywords": [
        "solidity",
        "ethereum",
        "example",
        "smart",
        "contract"
      ],
      "author": "mxpaul",
      "license": "MIT",
      "bugs": {
        "url": "https://github.com/mxpaul/ethmoneybox/issues"
      },
      "homepage": "https://github.com/mxpaul/ethmoneybox#readme"
    }

Install babel to use new syntax in truffle tests

    npm install --save-dev babel-register babel-polyfill babel-env babel-preset-es2015

Add node_modules directory to .gitignore

## Set up new truffle project

Install truffle locally for this project

    npm i -save-dev truffle

See local truffle version

    node_modules/.bin/truffle version

Result

    Truffle v4.1.8 (core: 4.1.8)
    Solidity v0.4.23 (solc-js)

Optional: Downgrade solc version for local truffle

    (cd node_modules/truffle/ && npm install solc@0.4.22)

truffle version still shows 0.4.23, but pragma solidity ^0.4.23; will work, showing that solc 0.4.22 is used.

Create boilerplate truffle project. truffle init creates some kind of shit structure for now, so do it by hands:

    mkdir {contracts,test,migrations}

Create truffle.js with command (or copypaste content):

    cat <<_EOF >truffle.js
    require('babel-register');
    require('babel-polyfill');
    module.exports = {
      // See <http://truffleframework.com/docs/advanced/configuration>
      // to customize your Truffle configuration!
      networks: {
        development: {
          host: "127.0.0.1",
          port: 9545,
          network_id: "*" // match any network
        },
      },
    };
    _EOF

Create truffl-config.js with command

    cat <<_EOF >truffle-config.js
    module.exports = {        
      // See <http://truffleframework.com/docs/advanced/configuration>
      // to customize your Truffle configuration!
    };                                           
    _EOF


Run local ethereum node with ganeche (built in truffle) in a separate console and keep it running while testing contracts.

    ./node_modules/.bin/truffle develop

Output (Port 9545 is what we used in truffle.js to configure developer network )

    Truffle Develop started at http://127.0.0.1:9545/
    
    Accounts:
    (0) 0x627306090abab3a6e1400e9345bc60c78a8bef57
    (1) 0xf17f52151ebef6c7334fad080c5704d77216b732
    (2) 0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef
    (3) 0x821aea9a577a9b44299b9c15c88cf3087f3b5544
    (4) 0x0d1d4e623d10f9fba5db95830f7d3839406c6af2
    (5) 0x2932b7a2355d6fecc4b5c0b6bd44cc31df247a2e
    (6) 0x2191ef87e392377ec08e7c08eb105ef5448eced5
    (7) 0x0f4f2ac550a1b4e2280d04c21cea7ebd822934b5
    (8) 0x6330a553fc93768f612722bb8c2ec78ac90b3bbc
    (9) 0x5aeda56215b167893e80b4fe645ba6d5bab767de
    
    Private Keys:
    (0) c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3
    (1) ae6ae8e5ccbfb04590405997ee2d52d2b330726137b875053c36d94e974d162f
    (2) 0dbbe8e4ae425a6d2687f1a7e3ba17bc98c673636790f1b8ad91193c05875ef1
    (3) c88b703fb08cbea894b6aeff5a544fb92e78a18e19814cd85da83b71f772aa6c
    (4) 388c684f0ba1ef5017716adb5d21a053ea8e90277d0868337519f97bede61418
    (5) 659cbb0e2411a44db63778987b1e22153c086a95eb6b18bdf89de078917abc63
    (6) 82d052c865f5763aad42add438569276c00d3d88a2d062d36b2bae914d58b8c8
    (7) aa3680d5d48a8283413f7a108367c7299ca73f553735860a87b08f39395618b7
    (8) 0f62d96d6675f32685bbdb8ac13cda7c23436f63efbb9d07700d8669ff12b7c4
    (9) 8d5366123cb560bb606379f90a0bfd4769eecc0557f1b362dcae9012b548b1e5
    
    Mnemonic: candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
    
    ⚠️  Important ⚠️  : This mnemonic was created for you by Truffle. It is not secure.
    Ensure you do not use it on production blockchains, or else you risk losing funds.

To exit truffle use command (not now)

    .exit

Now truffle test showld pass like this:

    ./node_modules/.bin/truffle test
    
    
     0 passing (1ms)

Use git submodule to add openzeppelin-solidity test helpers (we want expectThrow)

    mkdir submodules && cd submodules && git submodule add https://github.com/OpenZeppelin/openzeppelin-solidity

Create test file test/00-use_throw.js

    cat <<_EOF > test/00-use_throw.js
    'use strict';
    
    import expectThrow from '../submodules/openzeppelin-solidity/test/helpers/expectThrow';
    _EOF

Tests should still pass if you installed babel or using node.js 10.0.0 and later
