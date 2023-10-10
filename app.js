import express from "express";
import { nanoid } from "nanoid";

import { validateUrl } from "./utils/index.js";
import { Database } from "./db/index.js";

const app = express();
const port = 80;
const env = { base: 'https://s.rdev.my.id' }
const db = new Database('db/db.json');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (req, res) => res.render('index.html'));

app.get('/:id', async (req, res) => {
  try {
    const url = await db.read({ id: req.params.id});
    if (url) {
      await db.update({ id: req.params.id }, { clicks: url.clicks + 1 } );
      return res.redirect(url.long_url);
    } else res.status(404).json('Not found');
  } catch (err) {
    console.log(err);
    res.status(500).json('Server Error');
  }
});

app.post('/rshort', async (req, res) => {
  const { long_url } = req.body;

  try {
    if (new URL(long_url)) {
      let url = await db.read({ long_url });

      if (url) {
        res.json(url).status(200);
      } else {
        const base = env.base;
        const id = nanoid(6);
        const short_url = `${base}/${id}`;

        res.json(await db.create({ id, long_url, short_url }));
      };
    };
  } catch (e) {
    res.json({ error: true,  message: "Invalid original URL!" });
    // res.json({ error: true, message: e.message, stack: e.stack });
  };
});

app.listen(port, () => console.log(`Server is running at port ${port}`));