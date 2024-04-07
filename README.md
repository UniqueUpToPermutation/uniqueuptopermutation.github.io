# My Website

This site is made with [next.js](https://nextjs.org/). To begin modifying the site, install [node.js](https://nodejs.org/en) with npm and install all the node modules required for this project in the main directory:

```
npm install
```

Afterwards, you can start editing and serve the site locally via:

```
npm run dev
```

This site builds to a static HTML website via GitHub actions when it is pushed to main. To replicate this process locally, you can use

```
npm run build
```

This will spit out the site to the local **out** folder, where you can then verify the result works with a Python HTTP server.

```
cd ./out
python3 -m http.server
```