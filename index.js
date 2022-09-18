
require('dotenv').config()
const appId = process.env.APPLICATION_ID;
const token = process.env.TOKEN;
const publicKey = process.env.PUBLIC_KEY;
const guildId = process.env.GUILD_ID;


const axios = require('axios')
const express = require('express');
const { InteractionType, InteractionResponseType, verifyKeyMiddleware } = require('discord-interactions');


const app = express();

const discord = axios.create({
  baseURL: 'https://discord.com/api/',
  timeout: 3000,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Authorization",
    "Authorization": `Bot ${token}`
  }
});




app.post('/interactions', verifyKeyMiddleware(publicKey), async (req, res) => {
  const interaction = req.body;

  if (interaction.type === InteractionType.APPLICATION_COMMAND) {
    if (interaction.data.name == 'yo') {
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `Yo ${interaction.member.user.username}!`,
        },
      });
    }

    if (interaction.data.name == 'dm') {
      let c = (await discord.post(`/users/@me/channels`, {
        recipient_id: interaction.member.user.id
      })).data
      try {
        let res = await discord.post(`/channels/${c.id}/messages`, {
          content: 'Hi!',
        })
      } catch (e) {
        console.log(e)
      }

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: 'Sent a dm!'
        }
      });
    }
  }

});



app.get('/register_commands', async (req, res) => {
  const registerCommands = [
    {
      "name": "yo",
      "description": "replies with Yo!",
      "options": []
    },
    {
      "name": "dm",
      "description": "sends user a DM",
      "options": []
    }
  ]
  try {
    let response = await discord.put(
      `/applications/${appId}/guilds/${guildId}/commands`,
      registerCommands
    )
    return res.send('commands have been registered')
  } catch (e) {
    console.log(e)
    return res.send(`${e.code} error from discord`)
  }
})


app.get('/', async (req, res) => {
  return res.send('Follow documentation ')
})


app.listen(8999, () => {

})

