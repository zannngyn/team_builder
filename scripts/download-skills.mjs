import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skills = [
  {
    id: "ex-jadecloud-flute",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/e/e2/70-1.png/revision/latest",
  },
  {
    id: "gentle-blessing",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/c/cb/70-3.png/revision/latest",
  },
  {
    id: "rise-of-the-blade",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/7/70/70-5.png/revision/latest",
  },
  {
    id: "mist-sweeper",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/4/42/70-7.png/revision/latest",
  },
  {
    id: "melodic-blossom",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/5/59/70-9.png/revision/latest",
  },
  {
    id: "perfect-precision",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/2/24/70-11.png/revision/latest",
  },
  {
    id: "ex-carefree-petals",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/b/b7/70-13.png/revision/latest",
  },
  {
    id: "ex-drunken-world",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/2/29/70-15.png/revision/latest",
  },
  {
    id: "ex-unstoppable-barrage",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/3/36/70-17.png/revision/latest",
  },
  {
    id: "ex-snowlit-gleam",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/9/91/70-19.png/revision/latest",
  },
  {
    id: "reflective-insight",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/2/28/70-21.png/revision/latest",
  },
  {
    id: "featherlight-steps",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/1/1d/70-23.png/revision/latest",
  },
  {
    id: "ex-flowing-paint",
    icon: "https://static.wikia.nocookie.net/sword-of-justice/images/2/27/70-25.png/revision/latest",
  },
];

const OUTPUT_DIR = path.join(__dirname, "..", "public", "skills");

async function download(url, filePath) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  fs.writeFileSync(filePath, buffer);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const skill of skills) {
    const filePath = path.join(OUTPUT_DIR, `${skill.id}.png`);

    try {
      await download(skill.icon, filePath);

      console.log(`✓ ${skill.id}`);
    } catch (err) {
      console.error(`✗ ${skill.id}`, err.message);
    }
  }
  console.log("Done");
}

main();
