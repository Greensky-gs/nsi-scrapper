import axios from "axios";
import { config } from "dotenv";

config();

const letters = "abcdefghijklmnopqrstuvwxyz0123456789";

const col = (color = "0") => `\x1b[${color}m`;
const fetchTag = (tag: string) => {
  axios
    .get(`http://api.greensky.ovh/players?playerTag=${tag}`)
    .then((r) => {
      if (!r.data || !r.data.ok) {
        return console.log(`Tag ${tag} ${col("31")}failed${col()}`);
      }
      axios
        .post(process.env.webhook, {
          body: JSON.stringify({
            content: `Tag **${tag}** succeeded`,
          }),
        })
        .catch(() => {});
      console.log(`Tag ${tag} ${col("32")}succeeded${col()}`);
    })
    .catch((r) => {
      console.log(`Tag ${tag} ${col("31")}failed${col()}`);
    });
};

const selection = new Array(8).fill(0);
const increaseSel = (sel: number[]) => {
  const arr = sel.slice();

  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] < letters.length) {
      arr[i]++;
      break;
    } else {
      arr[i] = 0;
    }
  }
  return arr;
};

const fetcher = (sel: number[]) => {
  const tag = sel.map((x) => letters[x]).join("");
  if (
    !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].some((x) =>
      tag.includes(x)
    )
  ) {
    return setTimeout(() => {
      fetcher(increaseSel(sel));
    }, 100);
  }
  const entries = tag.split("").reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {}) as Record<string, number>;
  if (Object.keys(entries).length < 5)
    return setTimeout(() => {
      fetcher(increaseSel(sel));
    }, 100);
  fetchTag(tag);

  setTimeout(() => {
    fetcher(increaseSel(sel));
  }, 2000);
};

fetcher(selection);
