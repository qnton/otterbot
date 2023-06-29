const Discord = require("discord.js");
const GoogleImages = require("google-images");
require("dotenv").config();

const googleImages = new GoogleImages(
  process.env.GOOGLE_CSE_ID,
  process.env.GOOGLE_API_KEY
);

const client = new Discord.Client({
  presence: {
    status: "dnd",
    activity: {
      name: "otters!",
      type: "WATCHING",
    },
  },
});

client.on("ready", async () => {
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "otter",
      description: "Show a random picture of an otter",
    },
  });
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "invite",
      description: "Send the invition link",
    },
  });
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "help",
      description: "List all commands",
    },
  });
  client.api.applications(client.user.id).commands.post({
    data: {
      name: "search",
      description: "Show a random picture with a word of your choice",
      options: [
        {
          name: "word",
          description: "Enter a word to generate an image of",
          required: true,
          type: 3,
        },
      ],
    },
  });

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    const { name, options } = interaction.data;
    const slash = name.toLowerCase();
    const args = {};

    const createAPIMessage = async (interaction, content) => {
      const { data, files } = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
      )
        .resolveData()
        .resolveFiles();
      return { ...data, files };
    };

    const reply = async (interaction, response) => {
      let data = { content: response };
      if (typeof response === "object") {
        data = await createAPIMessage(interaction, response);
      }
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: { type: 4, data },
      });
    };

    if (options) {
      for (const { name, value } of options) {
        args[name] = value;
      }
    }

    if (slash === "otter") {
      const number = 983;
      const imageNumber = Math.floor(Math.random() * number) + 1;
      const embed = new Discord.MessageEmbed()
        .setAuthor("OtterBot")
        .setColor("#bfbeee")
        .setFooter("by qnton", client.user.avatarURL())
        .setImage(`https://cdn.qnt.one/otter/${imageNumber}.jpg`)
        .setTimestamp();
      reply(interaction, embed);
    } else if (slash === "invite") {
      const embed = new Discord.MessageEmbed()
        .setAuthor("OtterBot")
        .setTitle("Invite Code")
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=834759448152244265&permissions=8&scope=applications.commands%20bot"
        )
        .setColor("#bfbeee")
        .setFooter("by qnton", client.user.avatarURL())
        .setTimestamp();
      reply(interaction, embed);
    } else if (slash === "help") {
      const embed = new Discord.MessageEmbed()
        .setAuthor("OtterBot")
        .setThumbnail(client.user.avatarURL())
        .addFields({
          name: "/search [term]",
          value: "Show a random picture with a word of your choice",
        })
        .addFields({
          name: "/otter",
          value: "Show a random picture of an otter",
        })
        .addFields({
          name: "/invite",
          value: "Send the invitation link",
        })
        .setColor("#bfbeee")
        .setFooter("by qnton", client.user.avatarURL())
        .setTimestamp();
      reply(interaction, embed);
    } else if (slash === "search") {
      const images = await googleImages.search(args.word);
      const length = images.length;
      const imageNumber = Math.floor(Math.random() * length);
      const embed = new Discord.MessageEmbed()
        .setAuthor("OtterBot")
        .setColor("#bfbeee")
        .setFooter("by qnton", client.user.avatarURL())
        .setImage(images[imageNumber].url)
        .setTimestamp();
      reply(interaction, embed);
    }
  });

  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
