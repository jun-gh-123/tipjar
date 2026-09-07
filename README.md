# Tip Jar (sui)
crypto tip jar for sui built using @mysten/sui and @mysten/dapp-kit-core

## How to use
1. clone repo
2. `npm install`
3. change `RECIPIENT` in `config.ts` to the address of sui wallet that you want to accept tip
4. change defaultNetwork in `createDAppKit` in `index.ts` to mainnet for prod
5. `npm start` to run esbuild watcher and server (probably at localhost:8000)
6. `npm build` to build `docs/app.js`
7. push to github and set branch and folder to `docs/` if you want to deploy on github page
