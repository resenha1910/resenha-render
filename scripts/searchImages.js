const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

// ===============================
// CONFIGURAÇÕES
// ===============================

const RENDER_FILE = path.join(__dirname, "..", "public", "render.json");
const OUTPUT_DIR = path.join(__dirname, "..", "public", "images");

const BING_URL = "https://www.bing.com/images/search?q=";

// ===============================
// UTILITÁRIOS
// ===============================

function ensureDirectoryExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadRender() {
  if (!fs.existsSync(RENDER_FILE)) {
    throw new Error(`render.json não encontrado em:\n${RENDER_FILE}`);
  }

  return JSON.parse(
    fs.readFileSync(RENDER_FILE, "utf8")
  );
}

async function downloadImage(url, destination) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
    timeout: 30000,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138 Safari/537.36",
    },
  });

  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(destination);

    response.data.pipe(writer);

    writer.on("finish", resolve);

    writer.on("error", reject);
  });
}

// ===============================
// BUSCA NO BING
// ===============================

async function searchBing(page, query) {
  console.log("");
  console.log("====================================");
  console.log("Pesquisando:");
  console.log(query);
  console.log("====================================");

  await page.goto(
    `${BING_URL}${encodeURIComponent(query)}`,
    {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    }
  );

  await page.waitForSelector(".iusc", {
    timeout: 30000,
  });

  const results = await page.$$eval(".iusc", (elements) => {
    return elements
      .map((element) => {
        const json = element.getAttribute("m");

        if (!json) return null;

        try {
          return JSON.parse(json);
        } catch {
          return null;
        }
      })
      .filter(Boolean);
  });

  if (!results.length) {
    throw new Error("Nenhuma imagem encontrada.");
  }

  return results;
}
// ===============================
// PROCESSAMENTO DAS CENAS
// ===============================

async function processScene(page, scene, index) {
  console.log("");
  console.log("====================================");
  console.log(`Cena ${index + 1}`);
  console.log(scene.text);
  console.log("====================================");

  try {
    const results = await searchBing(page, scene.text);

    // Por enquanto pega o primeiro resultado.
    // Na V2 faremos ranking dos sites.
    const image = results[0];

    if (!image || !image.murl) {
      console.log("Nenhuma imagem válida encontrada.");
      return;
    }

    const fileName = `scene${String(index + 1).padStart(2, "0")}.jpg`;

    const output = path.join(OUTPUT_DIR, fileName);

    console.log("Título:");
    console.log(image.t);

    console.log("");

    console.log("Site:");
    console.log(image.purl);

    console.log("");

    console.log("Download:");

    await downloadImage(image.murl, output);

    console.log(`✔ ${fileName} salvo com sucesso.`);

  } catch (error) {
    console.log("");

    console.log("Erro nesta cena:");

    console.log(error.message);
  }
}

// ===============================
// MAIN
// ===============================

async function main() {

  ensureDirectoryExists(OUTPUT_DIR);

  const render = loadRender();

  if (!render.scenes || render.scenes.length === 0) {
    throw new Error("Nenhuma cena encontrada no render.json");
  }

  console.log("");

  console.log("====================================");

  console.log("RESENHA 1910 - IMAGE DOWNLOADER");

  console.log("====================================");

  console.log("");

  console.log(`Total de cenas: ${render.scenes.length}`);

  console.log("");

  const browser = await chromium.launch({
    headless: false
  });

  const page = await browser.newPage({
    viewport: {
      width: 1600,
      height: 900,
    },
  });

  for (let i = 0; i < render.scenes.length; i++) {

    const scene = render.scenes[i];

    await processScene(
      page,
      scene,
      i
    );

  }

  await browser.close();

  console.log("");

  console.log("====================================");

  console.log("TODAS AS CENAS PROCESSADAS");

  console.log("====================================");

}
// ===============================
// EXECUÇÃO
// ===============================

main()
  .then(() => {
    console.log("");
    console.log("====================================");
    console.log("PROCESSO FINALIZADO COM SUCESSO");
    console.log("====================================");
    process.exit(0);
  })
  .catch((error) => {
    console.error("");
    console.error("====================================");
    console.error("ERRO GERAL");
    console.error("====================================");
    console.error(error);

    process.exit(1);
  });