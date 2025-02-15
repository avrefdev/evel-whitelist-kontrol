const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const OWNER_ID = "";
const COLLEGE_GUILD_ID = "";
const ROLEPLAY_GUILD_ID = "";
const COLLEGE_WHITELIST_ROLE_ID = "";
const ROLEPLAY_WHITELIST_ROLE_ID = "";

client.once("ready", () => {
    console.log(`${client.user.tag} is online!`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content === "!kontrol-form") {
        if (message.author.id !== OWNER_ID) {
            return message.reply("❌ Bu komutu sadece sahibim kullanabilir!");
        }

        const embed = new EmbedBuilder()
            .setTitle("Whitelist Kontrol")
            .setDescription("Aşağıdaki butona basarak whitelist durumunuzu kontrol edebilirsiniz.")
            .setColor("Purple");

        const button = new ButtonBuilder()
            .setCustomId("check_whitelist")
            .setLabel("Kontrol et")
            .setStyle(ButtonStyle.Success);

        const row = new ActionRowBuilder().addComponents(button);

        await message.channel.send({ embeds: [embed], components: [row] });
    }
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId !== "check_whitelist") return;

    const userId = interaction.user.id;

    try {
        const collegeGuild = client.guilds.cache.get(COLLEGE_GUILD_ID);
        const roleplayGuild = client.guilds.cache.get(ROLEPLAY_GUILD_ID);
        
        if (!collegeGuild || !roleplayGuild) {
            return interaction.reply({ content: "❌ Sunucular bulunamadı!", ephemeral: true });
        }

        const collegeMember = await collegeGuild.members.fetch(userId).catch(() => null);
        if (!collegeMember) {
            return interaction.reply({ content: "❌ Evel College sunucusunda bulunamadınız!", ephemeral: true });
        }

        if (!collegeMember.roles.cache.has(COLLEGE_WHITELIST_ROLE_ID)) {
            return interaction.reply({ content: "❌ Evel College whitelist rolüne sahip değilsiniz!", ephemeral: true });
        }

        const roleplayMember = await roleplayGuild.members.fetch(userId).catch(() => null);
        if (!roleplayMember) {
            return interaction.reply({ content: "❌ Evel Roleplay sunucusunda bulunamadınız!", ephemeral: true });
        }

        await roleplayMember.roles.add(ROLEPLAY_WHITELIST_ROLE_ID);
        return interaction.reply({ content: "✅ Whitelist başarıyla eklendi!", ephemeral: true });

    } catch (error) {
        console.error(error);
        return interaction.reply({ content: "❌ Bir hata oluştu!", ephemeral: true });
    }
});

client.login(process.env.TOKEN);
