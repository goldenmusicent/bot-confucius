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
  //console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
  client.user.setGame('I am your host');
});

/****************
Variable globale
*****************/

var flag_auto_bj = 1;



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


/* Affiche le nouveau membre dans les logs */
client.on('guildMemberAdd', member => {
  // Affichage dans les logs
   member.guild.channels.find("name","logs").send({embed: {
      color: 0x00fb00,
      description: "Le joueur **" + member.user.username + "** a rejoint la team VIII"
   }});
});

/* Affichage de notification lorsqu'un joueurs quitte la team */
client.on('guildMemberRemove', member => {
   // Affichage dans les logs
   member.guild.channels.find("name","logs").send({embed: {
      color: 0xff0000,
      description: "Le joueur **" + member.user.username + "** a quitté la team VIII"
   }});
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
      //let mention = message.mentions.users.first();

      //Détermine son role actuel

      // Détermine son rôle futur
      if (member.roles.has(recrue.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Membre - ⭐⭐**! Soit en digne!");
        member.send("Soit fier de porter le blason de Membre - ⭐⭐ \n\n https://www.dropbox.com/s/ap0vj6kgoht74q8/RED%20-%202Stars.png?dl=0");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Recrue - ⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait promouvoir au niveau de Membre - ⭐⭐"
    	}});

      }else if (member.roles.has(membre.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Elite - ⭐⭐⭐**! Soit en digne!");
        member.send("Soit fier de porter le blason d'Elite - ⭐⭐⭐ \n\n https://www.dropbox.com/s/2twgs18ed650lqd/RED%20-%203Stars.png?dl=0");

        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait promouvoir au niveau de Elite - ⭐⭐⭐"
    	}});

      }else if (member.roles.has(elite.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Manager - ⭐⭐⭐⭐**! Soit en digne!");
        member.send("Soit fier de porter le blason de Manager - ⭐⭐⭐⭐ \n\n https://www.dropbox.com/s/zjdlmuqn474o9en/RED%20-%204Stars.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait promouvoir au niveau de Manager - ⭐⭐⭐⭐"
    	}});

      }else if (member.roles.has(manager.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Leader - ⭐⭐⭐⭐⭐**! Soit en digne!");
        member.send("Soit fier de porter le blason de Leader - ⭐⭐⭐⭐⭐ \n\n https://www.dropbox.com/s/tnsvqrpcllm8bt6/RED%20-%205Stars.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait promouvoir au niveau de Leader - ⭐⭐⭐⭐⭐"
    	}});

      }else if (member.roles.has(pu.id)){
        await message.channel.send(member + "  Bravo pour ta promotion en tant que **Membre - ⭐⭐**! Soit en digne!");
        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "PU - Inactif");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

      }else if (member.roles.has(leader.id)){
        await message.channel.send(member + "  Le statut de Leader est le statut suprème, seul dieu est au-dessus!");
      }
      //effacement de la commande
      message.delete();
}

/* Rétrogradation joueurs le joeur */
  if(command === "retro") {

      // Détermine les rôles possible:
      let recrue  = message.guild.roles.find("name", "Recrue - ⭐");
      let membre  = message.guild.roles.find("name", "Membre - ⭐⭐");
      let elite   = message.guild.roles.find("name", "Elite - ⭐⭐⭐");
      let manager = message.guild.roles.find("name", "Manager - ⭐⭐⭐⭐");
      let leader  = message.guild.roles.find("name", "Leader - ⭐⭐⭐⭐⭐");
      let pu      = message.guild.roles.find("name", "PU - Inactif");

      // reprend le membre cité
      let member = message.mentions.members.first();

      // Détermine son rôle futur

      if (member.roles.has(membre.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Recrue - ⭐**");
        member.send("Soit fier de porter le blason de Recrue - ⭐ \n\n https://www.dropbox.com/s/32a9tyd9akj0ohl/RED%20-%201Star.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Recrue - ⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait rétrograder au niveau de Recrue - ⭐"
    	}});


      }else if (member.roles.has(elite.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Membre - ⭐⭐**");
        member.send("Soit fier de porter le blason de Membre - ⭐⭐ \n\n https://www.dropbox.com/s/ap0vj6kgoht74q8/RED%20-%202Stars.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Membre - ⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait rétrograder au niveau de Membre - ⭐⭐"
    	}});

      }else if (member.roles.has(manager.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Elite - ⭐⭐⭐**");
        member.send("Soit fier de porter le blason d'Elite - ⭐⭐⭐ \n\n https://www.dropbox.com/s/2twgs18ed650lqd/RED%20-%203Stars.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Elite - ⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

		// Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait rétrograder au niveau d'Elite - ⭐⭐⭐"
    	}});


      }else if (member.roles.has(leader.id)){
        await message.channel.send(member + "  Exige beaucoup de toi-même et attends peu des autres. Ainsi beaucoup d'ennuis te seront épargnés. Tu as été rétrogradé au grade de **Manager - ⭐⭐⭐⭐**");
        member.send("Soit fier de porter le blason de Manager - ⭐⭐⭐⭐ \n\n https://www.dropbox.com/s/zjdlmuqn474o9en/RED%20-%204Stars.png?dl=0");


        // Supression de l'ancien statuts
        let role_old = member.guild.roles.find(role => role.name === "Leader - ⭐⭐⭐⭐⭐");
        member.removeRole(role_old).catch(console.error);

        // Ajout du nouveaus statuts
        let role_new = member.guild.roles.find(role => role.name === "Manager - ⭐⭐⭐⭐");
        member.addRole(role_new).catch(console.error);

        // Affichage dans les logs
    	message.guild.channels.find("name","logs").send({embed: {
      		color: 0x00ffe9,
      		description: "Le joueur" + member + " c'est fait rétrograder au niveau de Manager - ⭐⭐⭐⭐"
    	}});

      }else if (member.roles.has(recrue.id)){
        await message.channel.send("Ne te méprend pas jeune padawan! Les recrues sont les piliers de notre comunauté!");
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
      .catch(error => message.reply(`Impossible d'effacer les messages à cause de l'erreur: ${error}`));

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


  //Envoie de message programmées en date et en heures
  if (command === 'tm'){

    //Flag d'activation de message à implémenter
    message.channel.send("Messages automatiques activés");
	automessage = setTimeout(automessage_tm, 1 * 1000 * 60); //Call every minutes
    //effacement de la commande
    message.delete();
  }


  //Désactivation des messages programmées
  if (command === 'tm-stop'){

    //Flag d'activation de message à implémenter
    message.channel.send("Messages automatiques désactivés");
    
    // Arrête le scheduler
    clearInterval(Automessage);

    //effacement de la commande
    message.delete();
  }



  /* Exclusion d'un membre */
  if (command === 'kick'){

    // Easy way to get member object though mentions.
    var member= message.mentions.members.first();
    // Kick
    member.kick().then((member) => {
      // Successmessage
      message.channel.send(":wave: ** " + member.displayName + "** Ne correspond plus aux attentes de la team :point_right:  Bonne route à toi!");
    }).catch(() => {
      // Failmessage
      message.channel.send("Access Denied");
    });

    let allowedRole = message.guild.roles.find("name", "Recrue - ⭐");
    if (member.roles.has(allowedRole.id)) {
      member.send("Malgré toutes les qualités dont tu disposes, tu ne corresponds pas à ce que le team recherche. Merci pour ton intérêt, ta présence et ta volonté. Bonne route!");
    }else{
      member.send("Malheureusement nous devons nous séparer de toi. Bonne route!");
    }

    // Affichage dans les logs
    message.guild.channels.find("name","logs").send({embed: {
      color: 0xff0000,
      description: "Le joueur" + member + " c'est fait kick de la team VIII"
    }});

    //effacement de la commande
    message.delete();
  }



  /* Blame d'un membre */
  if (command === 'blame'){

    var member= message.mentions.members.first();

    // get the delete count, as an actual number.
    const reglnb = parseInt(args[0], 10);
        
    // Ooooh nice, combined conditions. <3
    if(!reglnb || reglnb < 1 || reglnb > 14)
      return message.reply("Le règlement comprend 13 points!");

  	// Affichage du blame sur le général
  	message.channel.send(member + "  a hérité d'un blâme  :sweat_smile: ");

    // Affichage dans els logs
    message.guild.channels.find("name","logs").send({embed: {
      color: 0xfffc00,
      description: "Le joueur" + member + " a hérité d'un blâme!"
    }});

  	// Envoie d'un message privé selon le règlements:
  	member.send("Malheureusement, ton comportement a entraîné un blâme. \n\nRaison:\n\n");

  	switch (reglnb){
  		case 1: member.send("1 – Tous les membres sont égaux au sein de la team, et ce, quel que soit leur âge, leur nationalité, leur orientation sexuelle ou encore leur niveau de jeu.");
  			break;
		case 2: member.send("2 – Le respect est fondamental pour préserver un état d’esprit communautaire et jovial au sein de la team. Exemple : Diffamation, racisme, sexisme, harcèlement, propos ayant pour but d’humilier ou de rabaisser un autre membre, possible futur membre ou adversaire ne sera toléré et cela impliquera une radiation immédiate (témoignage de deux personnes nécessaire). \n \n2.1 – Le T-bag (ou toutes autres actes similaire) est interdit, même par inadvertance. L’abus des pratiques susmentionnées entrainera un blâme voire un renvoie. \n\n2.2 - Le TK (team kill) est à proscrire. En cas de TK (random vs TEAM) volontaire, l’exclusion est nécessaire. Le TK est toléré dans le cas ou l’exclusion n’est plus possible et que moins de 3 personnes de la team soient dans la partie. L’effet boule de neige est à éviter (Multi TK).");
  			break;
  		case 3: member.send("3 – La politesse est également de rigueur. Que ce soit en jeu, sur le tchat de groupe (Xbox live & Discord) ou sur le site G4G, un « bonjour », « s’il vous plait », et « merci » n’ont jamais fait de mal à quiconque et rendent les échanges plus agréables.");
  			break;
  		case 4: member.send("4 – La présence aux entrainements et matchs d’équipe (amicale – TS ou compétition - G4G – ESL) est obligatoire pour les membres désignés. Toute indisponibilité devra être signaler une semaine à l’avance sur le discord rubrique « absence » ou directement au manager du roaster (celui-ci en réfèrera sur le discord). En cas d’imprévu important de dernière minute, merci de prévenir en détaillant les raisons.");
  			break;
  		case 5: member.send("5 – Chaque fin de mois, une réunion de team a lieu (dernier vendredi du mois, sauf fêtes). Votre présence est grandement souhaitée. Vous serez mis au courant des objectifs accomplis durant ce mois, des prochains objectifs et vous pourrez faire part de vos souhaits, attentes et remarques.");
  			break;
  		case 6: member.send("6 – Le fair-play est une règle essentielle dans la pratique des jeux. N’insultez pas vos coéquipiers, n’ayez pas des coups de sang impromptus, félicitez vos adversaires dans la victoire comme dans la défaite. Perdre fait également partie des règles du jeu. Partez du principe que même Hercule s’est fait avoir.");
  			break;
  		case 7: member.send("7 – Chaque membre peut apporter sa pierre à l’édifice à condition que le projet présenté soit parfaitement étudié et clair. Les projets devront être présentés en respectant la chaine hiérarchique cf. Statut. Des arguments fondés et des exemples concis mettront davantage en avant votre projet. L’investissement est un devoir important au sein de la team, à condition que celui-ci soit destiné à l’ensemble des membres et réfléchi.");
  			break;
  		case 8: member.send("8 – Toute tentative de triche, quelle qu’elle soit, est prohibée et sera sanctionnée. Sachez qu’un bon joueur acquiert une expérience solide avec le temps et non par la duperie.");
  			break;
  		case 9: member.send("9 – Vous représentez une communauté. Les comportements égoïstes sont également à proscrire.");
  			break;
  		case 10: member.send("10 – Pour intégrer notre team, vous devez obligatoirement passer par une candidature et un entretien vocal avec un responsable (VIII Skyller ou VIII Cooper). Si votre candidature est validée, vous serez, durant deux semaines, en « Test ». Toute recrue devra montrer une totale transparence aux membres confirmés de la team. À la fin de ce délai, si le résultat est positif, vous serez Membre de la team « VENI VIDI VICI ».");
  			break;
  		case 11: member.send("11 – La team « VIII » ne tolérera pas le multi-team/Asso/structure, il est de votre seul ressort d’assurer vos engagements envers la team. Faire partie de deux teams à la fois ne sera pas possible chez nous.");
  			break;
  		case 12: member.send("12 – Tout membres de la team « VIII » devra obligatoirement avoir un gamertag commençant par « VIII » et arborer le logo officiel de la team « VIII » (figure 1, page 1).");
  			break;
  		case 13: member.send("13 – En cas de manquement au règlement, un blâme serra prononcé. Le deuxième manquement impliquera l’expulsion définitive.");
  			break;
  		case 14: member.send("14 – Le règlements est susceptible d’évoluer, tous les membres devront se tenir informer de l’évolution de ce dernier ainsi que l’évolution de tous les documents référencés dans le règlement.");
  			break;
  	}

    //effacement de la commande
    message.delete();
  }



  /* Envoie la liste de commandes de Confucius[BOT] */
  if (command === "help") { 
    message.channel.send({embed: {
    color: 3447003,
    author: {
      name: client.user.username,
      icon_url: client.user.avatarURL
    },
    title: "HELP - Confucius",
    description: "Les commande ci-dessous précédé d'un \"+\" permettent d'effectuer différentes actions",
    fields: [{
        name: "**help**",
        value: "Affiche l'interface d'aide au commandes confucius"
      },
      {
        name: "**purge [nombre]**",
        value: "Nombre de message a supprimer, entre 2 et 100"
      },
      {
        name: "**ping**",
        value: "Renvoie un message avec le ping, et le Ping API de liaison du Bot"
      },
      {
        name: "**say [message]**",
        value: "Envoie le message dans le générale"
      },
      {
        name: "**tm**",
        value: "Active les messages automatiques"
      },
      {
        name: "**tm-stop**",
        value: "désactive les messages automatiques"
      },
      {
        name: "**promo @[nom]**",
        value: "Promotion d’un joueur un grade au-dessus, envoie message privé avec le logo"
      },
      {
        name: "**retro @[nom]**",
        value: "Rétrogradation d’un joueur un grade en dessous, envoie message privé avec le logo"
      },
      {
        name: "**kick @[nom]**",
        value: "Exclusion d'un membre, envoie d'un message privé selon grade"
      },
      {
        name: "**blame [num] @[nom]**",
        value: "Mentionne le blâme dans le général & envoie un message privé à la personne concernée comprenant le point du règlement transgressé\n Prend en argument [num] le point du règlement concerné et le joueur"
      },
      {
        name: "**LOGs**",
        value: "Tout changement lié aux joueurs est enregistré sous la rubrique **\"LOGs\" **"
      },
      
    ],
    timestamp: new Date(),
    footer: {
      icon_url: client.user.avatarURL,
      text: "© Confucius"
	    }
	  }
	});

    //effacement de la commande
    message.delete();
    }


}else {
       // not allowed access
       m = await message.channel.send("Permissions insuffisantes!");
       message.delete();
}});

function automessage_tm() {
    // Détection des informatione temps jours et mois!!!
        var date    = new Date(); 
        var jour    = date.getDate();
        var joursem = date.getDay(); //Dimanche = 0
        var heure   = (date.getHours() +1); //GMT + 1
        var minutes = date.getMinutes(); 

        if (heure === 1){
        	flag_auto_bj = 1;
        }

        // Message Bonjour: 
        if(heure === 8 && minutes > 25 && flag_auto_bj === 1) {
            switch (joursem){
            case 0: {message.channel.send("Bonjour à tous, je vous souhaite un bon Dimanche!");
                    break;}
            case 1: {message.channel.send("Bonjour à tous, je vous souhaite un bon début de semaine");
                    break;}
            case 2: {message.channel.send("Yo les BOY's, Mardi, bientôt le weekend!!!!");
                    break;}
            case 3: {message.channel.send("Hello la populace, c'est Mercredi, un peu de courage!!");
                    break;}
            case 4: {message.channel.send("Bonjour à tous, je vous souhaite une excellente journée");
                    break;}
            case 5: {message.channel.send("Salut la team! Vendredi, encore un petit effort. On y est!!");
                    break;}
            case 6: {message.channel.send("Bonjour à tous! Bon weekend!!");
                    break;}
          }
          flag_auto_bj = 0;
        }

        // Message Rappel réunion:
        if(jour > 18 && heure ===19 && minutes === 30) {
              switch (joursem){
              case 2: {message.channel.send("N’oubliez pas que la réunion mensuelle a lieu ce vendredi \nVotre présence n’est pas obligatoire mais fortement souhaitée!");
                      break;}
              case 4: {message.channel.send("N’oubliez pas que la réunion mensuelle a lieu demain à 21h sur le Discord rubrique vocal \nVotre présence n’est pas obligatoire mais fortement souhaitée!");
                      break;}
              case 5: {message.channel.send("N’oubliez pas que la réunion mensuelle a ce soir à 21h sur le Discord rubrique vocal \nVotre présence n’est pas obligatoire mais fortement souhaitée!");    //Envoie le message dans le chanel "général"
                      break;}
              }
        }

        // Message rappel entrainement rooster Attilius
        if(joursem === 4 && heure === 18 && minutes === 30){
            //Envoie le message dans le chanel "Roster Attilius"
            //message.guild.channels.find("name","roster-attilius").send("Rappel de l'entrainement pour le rooster Attilius ce soir à 21h!");
            //Envoie le message dans le chanel "Roster Attilius"
            message.channel.send("Rappel de l'entrainement pour le rooster Attilius ce soir à 21h!");
        }

        //message.channel.send("jour: " + jour + "  joursem: " + joursem + "  heure: " + heure + "  Minutes: " + minutes);
}

client.login(config.token);
