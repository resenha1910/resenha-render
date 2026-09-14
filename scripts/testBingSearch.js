const { chromium } = require("playwright");

// Termos otimizados com expressões exatas bem agrupadas
const buscas = [
    '"Rodrigo Garro" "Corinthians"',
    '"Yuri Alberto" "Corinthians"',
    '"Torcida do Corinthians" "Neo Química Arena"',
    '"Memphis Depay" "Corinthians"',
    '"Escudo do Corinthians"'
];

// Mantém a ordem invertida das pesquisas
const buscasInvertidas = buscas.reverse();

(async () => {
    console.clear();
    console.log("====================================");
    console.log("BUSCA DIRETA VIA URL (ALTA PRECISÃO)");
    console.log("====================================\n");

    const browser = await chromium.launch({
        headless: false,
        slowMo: 100
    });

    const context = await browser.newContext({
        viewport: { width: 1600, height: 900 }
    });

    for (let i = 0; i < buscasInvertidas.length; i++) {
        const queryExact = buscasInvertidas[i];

        console.log(`\n--- [Aba ${i + 1}/${buscasInvertidas.length}] ---`);
        console.log(`Buscando por: ${queryExact}`);

        const page = await context.newPage();

        // Monta a URL direta com o parâmetro de fotos reais (photo-photo)
        const searchUrl = `https://www.bing.com/images/search?q=${encodeURIComponent(queryExact)}&form=HDRSC3&qft=+filterui:photo-photo`;

        await page.goto(searchUrl, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        // Aguarda a presença das miniaturas de imagem (.iusc)
        try {
            await page.waitForSelector(".iusc", { timeout: 15000 });

            const total = await page.locator(".iusc").count();
            console.log(`Resultados na tela: ${total}`);

            if (total > 0) {
                // Extrai o link direto da imagem em alta resolução (propriedade 'murl' do JSON)
                const primeiroElemento = page.locator(".iusc").first();
                const jsonAttr = await primeiroElemento.getAttribute("m");

                if (jsonAttr) {
                    const dados = JSON.parse(jsonAttr);
                    console.log(`URL da 1ª imagem: ${dados.murl}`);
                }
            } else {
                console.log("Nenhuma imagem encontrada para este termo.");
            }
        } catch (error) {
            console.log("Erro ou tempo limite excedido ao carregar os resultados.");
        }

        // Intervalo de 3 segundos antes de abrir a próxima aba
        if (i < buscasInvertidas.length - 1) {
            console.log("Aguardando 3 segundos para abrir a próxima aba...");
            await page.waitForTimeout(3000);
        }
    }

    console.log("\n====================================");
    console.log("TODAS AS 5 ABAS FORAM CARREGADAS!");
    console.log("====================================");

    await new Promise(resolve => setTimeout(resolve, 15000));
    await browser.close();
})();