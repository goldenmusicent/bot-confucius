// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the XX.json file  
const config = require("./config.json"); //contains our token and our prefix values.
const message = require("./message.json"); //contains the different server message

// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  client.user.setGame('I am your host');


});


/* Message de bienvenue En privé ainsi que dans le général */
client.on("guildMemberAdd",function (member) {
  member.createDM().then(function (channel) {
    return channel.send(message.bienvenue);
  }).catch(console.error);
})

client.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.find(ch => ch.name === 'général');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Salut ${member}, bienvenue dans la **VIII Familly** :tada::hugging: !`);
});


/* Définit le nouveau membre en recrue */
client.on("guildMemberAdd", function(member) {
    let role = member.guild.roles.find(role => role.name === "Recrue - ⭐");
    member.addRole(role).catch(console.error);
});



/* Ajout - Effacement du Boat sur un guild */
client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});



/* Ignore les auters bots et lui même lors de message sur le serveur */
client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  



  // Here we separate our "command" name, and our "arguments" for the command. 
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

/*
    Controle de permission
*/
  let allowedRole = message.guild.roles.find("name", "Leader - ⭐⭐⭐⭐⭐");
  if (message.member.roles.has(allowedRole.id)) {

/*
    Commande
*/
  
  if(command === "ping") {
    // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
    // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
    const m = await message.channel.send("Ping?");
    message.delete()
    m.edit(`Le Ping est de ${m.createdTimestamp - message.createdTimestamp}ms. Le Ping API est de ${Math.round(client.ping)}ms`);
  }


  /* Promouvois le joeur */
  if(command === "promo") {
      // Promouvois un joueur
      /*let member = message.mentions.members.first();
      let role= member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
      member.addRole(role).catch(console.error);*/

      // Détermine les rôles possible:
      let recrue  = message.guild.roles.find("name", "Recrue - ⭐");
      let membre  = message.guild.roles.find("name", "Membre - ⭐⭐");
      let elite   = message.guild.roles.find("name", "Elite - ⭐⭐⭐");
      let manager = message.guild.roles.find("name", "Manager - ⭐⭐⭐⭐");
      let leader  = message.guild.roles.find("name", "Leader - ⭐⭐⭐⭐⭐");
      let pu      = message.guild.roles.find("name", "PU - Inactif");

      // reprend le membre cité
      let member = message.mentions.members.first();
      let mention = message.mentions.users.first();

      //Détermine son role actuel

      // Détermine son rôle futur
      if (member.roles.has(recrue.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Membre - ⭐⭐**! Soit en digne!");$
        message.member.creatDM().then(channel => {
          channel.send("test privé");
        });

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Recrue - ⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(membre.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Elite - ⭐⭐⭐**! Soit en digne");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(elite.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Manager - ⭐⭐⭐⭐**! Soit en digne!");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(manager.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Leader - ⭐⭐⭐⭐⭐**! Soit en digne!");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(pu.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Membre - ⭐⭐**! Soit en digne!");
        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "PU - Inactif");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(leader.id)){
        await message.channel.send(member + "  Le statut de Leader est le statut suprème, seul dieu est au dessus!");

      }
      //effacement de la commande
      message.delete();
}

/* Rétrogradation joueurs le joeur */
  if(command === "retro") {
      // Promouvois un joueur
      /*let member = message.mentions.members.first();
      let role= member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
      member.addRole(role).catch(console.error);*/

      // Détermine les rôles possible:
      let recrue  = message.guild.roles.find("name", "Recrue - ⭐");
      let membre  = message.guild.roles.find("name", "Membre - ⭐⭐");
      let elite   = message.guild.roles.find("name", "Elite - ⭐⭐⭐");
      let manager = message.guild.roles.find("name", "Manager - ⭐⭐⭐⭐");
      let leader  = message.guild.roles.find("name", "Leader - ⭐⭐⭐⭐⭐");
      let pu      = message.guild.roles.find("name", "PU - Inactif");

      // reprend le membre cité
      let member = message.mentions.members.first();

      //Détermine son role actuel

      // Détermine son rôle futur

      if (member.roles.has(elite.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Membre - ⭐⭐**");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(manager.id)){
        await message.channel.send(member + "#  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Elite - ⭐⭐⭐**");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(leader.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Manager - ⭐⭐⭐⭐**");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(recrue.id)){
        await message.channel.send("Ne te méprend pas jeune padawan! Les recrues sont les pilliers de notre comunautée!");

      }
      //effacement de la commande
      message.delete();
}



   /* Efface les x dernières lignes */
  if(command === "purge") {
    // This command removes all messages from all users in the channel, up to 100.

      // get the delete count, as an actual number.
      const deleteCount = parseInt(args[0], 10);
        
      // Ooooh nice, combined conditions. <3
      if(!deleteCount || deleteCount < 2 || deleteCount > 100)
        return message.reply("Entre un nombre entre 2 et 100, suppression des x derniers messages");
        
      // So we get our messages, and delete them. Simple enough, right?
      const fetched = await message.channel.fetchMessages({limit: deleteCount});
      message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Impossible d'effecer les messages à cause de l'erreur: ${error}`));

  }

  /* Faire dire quelque chose au bot*/
  if(command === "say") {
    let allowedRole = message.guild.roles.find("name", "Leader - ⭐⭐⭐⭐⭐");
    if (message.member.roles.has(allowedRole.id)) {
      // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
      // To get the "message" itself we join the `args` back into a string with spaces: 
      const sayMessage = args.join(" ");
      // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
      message.delete().catch(O_o=>{}); 
      // And we get the bot to say the thing: 
      message.channel.send(sayMessage);
    }
  }
}else {
       // not allowed access
       m = await message.channel.send("Permissions insuffisantes!");
       message.delete();


}});

client.login(config.token);


