const { GatewayIntentBits } = require('discord.js');
const Dlist = new Map();
const activeServers = new Map;

const clrs = {
    default:    '\x1b[0m',
    red:        '\x1b[31m',
    green:      '\x1b[32m',
    yellow:     '\x1b[33m',
    blue:       '\x1b[34m',
    magenta:    '\x1b[35m',
    white:      '\x1b[37m',
    black:      '\x1b[30m'
};

const g_intents = [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildWebhooks
];


module.exports = {
    activeServers,
    clrs,
    g_intents,
    Dlist
};