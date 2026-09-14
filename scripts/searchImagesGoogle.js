const { chromium } = require("playwright");

const query = process.argv.slice(2).join(" ") || "Rodrigo Garro Corinthians";

(async () => {

    console.clear();

    console.log("====================================");
    console.log("TESTE GOOGLE IMAGENS");
    console.log("====================================");
    console.log("");

    const context = await chromium.launchPersistentContext(
        "C:\\ChromeAutomation",
        {
            channel: "chrome",
            headless: false,
            slowMo: 120,
            viewport: null,
            args: [
                "--start-maximized"
            ]
        }
    );

    const page = context.pages()[0] || await context.newPage();

    console.log("Abrindo Google...");

    await page.goto(
        "https://www.google.com",
        {
            waitUntil: "networkidle",
            timeout: 60000
        }
    );

    await page.waitForTimeout(3000);

    console.log("Google carregado.");

    // Aceita cookies caso apareça
    try {

        await page.getByRole("button").filter({
            hasText: /Aceitar|Accept|I agree|Aceitar tudo/i
        }).click({
            timeout: 3000
        });

        console.log("Cookies aceitos.");

        await page.waitForTimeout(2000);

    } catch {

        console.log("Nenhum aviso de cookies.");

    }

    console.log("Localizando campo de pesquisa...");

    const input = page.locator("textarea[name='q']");

    await input.waitFor({
        timeout: 10000
    });

    console.log("Digitando pesquisa...");

    await input.click();

    await input.type(query, {
        delay: 150
    });

    await page.waitForTimeout(1500);

    console.log("Pressionando ENTER...");

    await page.keyboard.press("Enter");

    console.log("Aguardando resposta...");

    await page.waitForTimeout(8000);

    console.log("");

    console.log("URL atual:");

    console.log(page.url());

    console.log("");

    console.log("====================================");
    console.log("NÃO FECHE O NAVEGADOR");
    console.log("Observe o que aconteceu.");
    console.log("====================================");

    await page.pause();

})();