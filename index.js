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
  let shoppingList = [];
  let harga = [];
  
  client.on('message_create', async (message) => {
    if (message.body.includes('!everyone')) {
      message.reply('OpenAI Limit GAN!');
    } else if (message.body.includes('!ping')) {
      message.reply('Ping!');
    } 
    // else if (message.body.startsWith('!hitung')) {
    //   // Handle !hitung command
    //   const expression = message.body.split('!hitung')[1].trim();
    //   try {
    //     const result = eval(expression);
    //     const resultFormatted = formatRupiah(result);
    //     message.reply(`Hasil: ${resultFormatted}`);
    //   } catch (error) {
    //     message.reply('Terjadi kesalahan dalam perhitungan.');
    //   }
    // } 
    else if (message.body.startsWith('!list')) {
      // Handle !list command
      const input = message.body.split('!list')[1].trim();
      const items = input.split(',');
      items.forEach((item) => {
        const [name, price] = item.split(':');
        shoppingList.push(name.trim());
        harga.push(parseFloat(price.trim()));
      });
      message.reply(`Berhasil ditambahkan ke dalam list.`);
    } else if (message.body === '!hitung') {
      // Handle !hitung command
      if (shoppingList.length === 0) {
        message.reply('List masih kosong.');
      } else {
        const formattedList = shoppingList.map((item, index) => `${index + 1}. ${item} - ${formatRupiah(harga[index])}`);
        const listMessage = `List:\n\n${formattedList.join('\n')}`;
        const totalPrice = harga.reduce((total, price) => total + price, 0);
        const totalPriceFormatted = formatRupiah(totalPrice);
        const messageWithTotalPrice = `${listMessage}\n\nTotal : ${totalPriceFormatted}`;
        message.reply(messageWithTotalPrice);
      }
    }else if (message.body === '!clear') {
      // Handle !clear command to clear all arrays
      shoppingList = [];
      harga = [];
      message.reply(`Semua data dihapus dari list.`);
    } 
  });
}

man();