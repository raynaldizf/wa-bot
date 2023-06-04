const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const { getSystemErrorMap } = require('util');
const { Configuration, OpenAIApi } = require("openai");
const { url } = require('inspector');
const configuration = new Configuration({
    apiKey: 'YOUR-API-KEY',
});
const openai = new OpenAIApi(configuration);
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "client-one" //Un identificador(Sugiero que no lo modifiques)
        // test
    })
})

// Save session values to the file upon successful auth
client.on('authenticated', (session) => {
    console.log(session);
});

// Fungsi untuk mengonversi angka menjadi format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
}


client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, { small: true });
})

client.on('ready', () => {
    console.log("ready to message")
});


function man() {
  client.on('message_create', async (message) => {
    if (message.body.includes('!everyone')) {

    } else if (message.body.includes('!ping')) {

    } else if (message.body.startsWith('!hitung')) {
      // Handle the !calc command (calculator)
      const expression = message.body.split('!hitung')[1].trim();
      try {
        const result = eval(expression);
        const resultFormatted = formatRupiah(result);
        message.reply(`Hasil: ${resultFormatted}`);
      } catch (error) {
        message.reply('Terjadi kesalahan dalam perhitungan.');
      }
    }
  });
}

man();

