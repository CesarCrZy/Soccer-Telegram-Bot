const { Telegraf } = require("telegraf");
const requireDir = require("require-dir");
const sqlite3 = require("sqlite3");
const moment = require("moment-timezone");

//Set default timezone
process.env.TZ = "America/Mexico_City";

//Create and connect to DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.log(err);
  }
});

//Import all models
requireDir("./src/models");

//Import controllers
const GameControler = require("./src/controllers/Game");
const Game = require("./src/controllers/Game");

//Bot token
//Put your telegram bot token here
const token = "6942478886:AAHblcTD0oy0Wj-L4szUT7TqG4rsUSntwdI";

//Bot instance
const bot = new Telegraf(token);

//Command /start
bot.command("start", (ctx) => {
  try {
    console.log(
      `${ctx.message.from.username} (${ctx.message.from.first_name}) -> Comando utilizado: /start`
    );
  } catch (error) {
    console.log(error);
  }
  return ctx.reply(`👋 Hola ${
    ctx.message.from.first_name
  }, A continuación verás todos mis comandos.:


👉 /comandos ➖ Mostraré todos los comandos con ejemplos de cómo usarlos.

👉 /today ➖ Mostraré todos los juegos. (${moment()
    .format("DD/MM/YYYY")}).

👉 /game ID ➖ Proporcionaré una identificación (ID) con cada juego, que es un número que te permitirá buscar las estadísticas de ese juego usando este comando. En lugar de ID, coloque el ID del juego, por ejemplo: (10) Flamengo x Fluminense, el ID del juego es 10, así que usaré /game 10 para ver las estadísticas del juego.`);
});

//Command /comandos
bot.command("comandos", (ctx) => {
  try {
    console.log(
      `${ctx.message.from.username} (${ctx.message.from.first_name}) -> Comando utilizado: /comandos`
    );
  } catch (error) {
    console.log(error);
  }
  return ctx.reply(`👋 Hola ${
    ctx.message.from.first_name
  }, A continuación verás todos mis comandos.:


👉 /comandos ➖ Mostraré todos los comandos con ejemplos de cómo usarlos.

👉 /today ➖ Mostraré todos los juegos. (${moment()
    .format("DD/MM/YYYY")}).

👉 /game ID ➖ Proporcionaré una identificación (ID) con cada juego, que es un número que te permitirá buscar las estadísticas de ese juego usando este comando. En lugar de ID, coloque el ID del juego, por ejemplo: (10) Flamengo x Fluminense, el ID del juego es 10, así que usaré /game 10 para ver las estadísticas del juego.`);
});

//Command /today
/*bot.command("today", (ctx) => {
  try {
    console.log(
      `${ctx.message.from.username} (${ctx.message.from.first_name}) -> Comando utilizado: /today`
    );
  } catch (error) {
    console.log(error);
  }
  const todayDate = moment().format("YYYY-MM-DD");
  GameControler.show(todayDate).then((rows) => {
    if (rows.length === 0) {
      return ctx.reply("😔 Lamentablemente no tengo los juegos de hoy.");
    }
    for (
      let index = 0;
      index <= Math.ceil(rows.length / 10) * 10;
      index += 10
    ) {
      let newRows = rows.slice(index, index + 10);
      let message = ``;
      for (let index in newRows) {
        let game = newRows[index];
        message += `⚽️ Juego ${game.id}\n🏠 ${game.homeName} x 🏃 ${
          game.awayName
        }\n🗓 ${moment(game.gameDate).format("DD/MM/YYYY HH:mm")}\n\n`;
      }
      if (newRows.length !== 0) {
        ctx.reply(message);
      }
    }
  });
  return;
});*/

//Command /today
bot.command("today", (ctx) => {
  try {
    console.log(
      `${ctx.message.from.username} (${ctx.message.from.first_name}) -> Comando utilizado: /today`
    );
  } catch (error) {
    console.log(error);
  }
  const tomorrowDate = moment().add(1, "d").format("YYYY-MM-DD");
  GameControler.show(tomorrowDate).then((rows) => {
    if (rows.length === 0) {
      return ctx.reply("😔 Lamentablemente no tengo los juegos.");
    }
    for (
      let index = 0;
      index <= Math.ceil(rows.length / 10) * 10;
      index += 10
    ) {
      let newRows = rows.slice(index, index + 10);
      let message = ``;
      for (let index in newRows) {
        let game = newRows[index];
        message += `⚽️ game ${game.id}\n🏠 ${game.homeName} x 🏃 ${
          game.awayName
        }\n\n`;
      }
      if (newRows.length !== 0) {
        ctx.reply(message);
      }
    }
  });
  return;
});

//Command /game ID
bot.command("game", (ctx) => {
  try {
    console.log(
      `${ctx.message.from.username} (${ctx.message.from.first_name}) -> Comando utilizado: /game`
    );
  } catch (error) {
    console.log(error);
  }
  try {
    const gameId = parseInt(
      ctx.message.text.replace("/game ", "").split(" ")[0].trim()
    );
    if (Number.isInteger(gameId)) {
      GameControler.index(gameId).then((row) => {
        if (row === undefined) {
          return ctx.reply(`🙄 El juego ${gameId} No se ha encontrado.`);
        }
        let message = `⚽️ ${row.id} - 🏠 ${row.homeName} x 🏃 ${
          row.awayName
        }


🏠 Información del equipo local (${row.homeName}):

📊 Partidas analizadas: ${row.homeAnalyzedGames}
🥅 Goles HT: ${row.homeGoalsHt}
🥅 Goles FT: ${row.homeGoalsFt}
⛳️ Esquinas HT: ${row.homeCornersHt}
⛳️ Esquinas FT: ${row.homeCornersFt}

🥅 Promedio de goles HT: ${(row.homeGoalsHt / row.homeAnalyzedGames || 0).toFixed(
          2
        )}
🥅 Promedio de goles FT: ${(row.homeGoalsFt / row.homeAnalyzedGames || 0).toFixed(
          2
        )}
⛳️ Esquinas promedio HT: ${(
          row.homeCornersHt / row.homeAnalyzedGames || 0
        ).toFixed(2)}
⛳️ Esquinas promedio FT: ${(
          row.homeCornersFt / row.homeAnalyzedGames || 0
        ).toFixed(2)}

=====================================

🏃 Información del equipo visitante (${row.awayName}):

📊 Partidas analizadas: ${row.awayAnalyzedGames}
🥅 Goles HT: ${row.awayGoalsHt}
🥅 Goles FT: ${row.awayGoalsFt}
⛳️ Esquinas HT: ${row.awayCornersHt}
⛳️ Esquinas FT: ${row.awayCornersFt}

🥅 Promedio de goles HT: ${(row.awayGoalsHt / row.awayAnalyzedGames || 0).toFixed(
          2
        )}
🥅 Promedio de goles FT: ${(row.awayGoalsFt / row.awayAnalyzedGames || 0).toFixed(
          2
        )}
⛳️ Esquinas promedio HT: ${(
          row.awayCornersHt / row.awayAnalyzedGames || 0
        ).toFixed(2)}
⛳️ Esquinas promedio FT: ${(
          row.awayCornersFt / row.awayAnalyzedGames || 0
        ).toFixed(2)}

=====================================

⚠️ Información de ambos equipos.:
🥅 Promedio de goles HT: ${(
          parseFloat(
            (row.homeGoalsHt / row.homeAnalyzedGames || 0).toFixed(2)
          ) +
          parseFloat((row.awayGoalsHt / row.awayAnalyzedGames || 0).toFixed(2))
        ).toFixed(2)}
🥅 Promedio de goles FT: ${(
          parseFloat(
            (row.homeGoalsFt / row.homeAnalyzedGames || 0).toFixed(2)
          ) +
          parseFloat((row.awayGoalsFt / row.awayAnalyzedGames || 0).toFixed(2))
        ).toFixed(2)}
⛳️ Esquinas promedio HT: ${(
          parseFloat(
            (row.homeCornersHt / row.homeAnalyzedGames || 0).toFixed(2)
          ) +
          parseFloat(
            (row.awayCornersHt / row.awayAnalyzedGames || 0).toFixed(2)
          )
        ).toFixed(2)}
⛳️ Esquinas promedio FT: ${(
          parseFloat(
            (row.homeCornersFt / row.homeAnalyzedGames || 0).toFixed(2)
          ) +
          parseFloat(
            (row.awayCornersFt / row.awayAnalyzedGames || 0).toFixed(2)
          )
        ).toFixed(2)}

=====================================

📖 Resumen Analisis: 
${row.analysis}       
        `;
        return ctx.reply(message);
      });
    } else {
      return ctx.reply("😑 Escribiste algo mal, ¿no?");
    }
  } catch (error) {
    console.log(error);
    return ctx.reply("🥴 Ups, ocurrió un error en mi chip.");
  }
});

bot.catch(err => {
	// handle error
});
//Initialize bot
bot.launch().catch(err => {
	// "handle" error
});

//Close DB
db.close((err) => {
  if (err) {
    console.log(err);
  }
});
