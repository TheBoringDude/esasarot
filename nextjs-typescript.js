// FOR CONFIGURING FILES ON A BARE TYPESCRIPT TEMPLATE

const fs = require("fs");

const FILES = [
  {
    file: "pages/index.js",
    replace: [],
    rename: "pages/index.tsx",
  },
  {
    file: "pages/_app.js",
    replace: [
      {
        old: "{ Component, pageProps }",
        new: "{ Component, pageProps }: AppProps",
      },
    ],
    add: ["import type { AppProps /*, AppContext */ } from 'next/app';"],
    rename: "pages/_app.tsx",
  },
  {
    file: "pages/api/hello.js",
    replace: [
      {
        old: "req, res",
        new: "req: NextApiRequest, res: NextApiResponse",
      },
    ],
    add: ["import { NextApiRequest, NextApiResponse } from 'next';"],
    rename: "pages/api/hello.ts",
  },
];

function main() {
  // create a new tsconfig.json
  fs.writeFile("tsconfig.json", "", (err) => {
    if (err) throw err;
  });

  // modify each files
  FILES.map((f) => {
    if (f.replace.length > 0) {
      fs.readFile(f.file, "utf-8", (err, data) => {
        if (err) console.error(err);

        var content = data;
        for (const value of f.add) {
          content = value + "\n" + content;
        }

        for (const r of f.replace) {
          content = content.replace(r.old, r.new);
        }

        fs.writeFile(f.rename, content, "utf-8", (err) => {
          if (err) console.error(err);
        });
      });
    }

    // rename
    fs.rename(f.file, f.rename, (err) => {
      if (err) console.error(err);
    });
  });
}

main();
