module.exports = {
    en: {
        translation: {
            WELCOME_MSG: 'Welcome to Currency Converter. Let\'s know more about money in the world !',
            HELP_MSG: 'You can say currency converter to me ! How can I help ?',
            REFLECTOR_MSG: 'You just triggered {{intent}}',
            GOODBYE_MSG: 'Goodbye !',
            FALLBACK_MSG: 'Sorry, I don\t know about that. Please try again',
            ERROR_MSG: 'Sorry, there was an error. Please try again'
        }
    },
    fr: {
        translation: {
            DOUBT_SPEECHCON: "<say-as interpret-as='interjection'>Hmmm</say-as>",
            WELCOME_MSG: "Bienvenue sur la skill de conversion de devise !",
            REPROMPT_MSG: "Pour obtenir plus d'informations sur ce que je peux faire pour vous, demandez moi de l'aide. Si vous voulez quitter la skill, dites simplement 'stop'. ",
            GOODBYE_MSG: ['Au revoir {{name}}!', 'A bientôt {{name}}', 'A la prochaine fois {{name}}'],
            REFLECTOR_MSG: "Vous avez invoqué l'intention {{intent}}",
            FALLBACK_MSG: 'Désolé, je ne sais pas. Pouvez vous reformuler ?',
            ERROR_MSG: "Désolé, je n'ai pas compris. Pouvez vous reformuler ?",
            NO_TIMEZONE_MSG: "Je n'ai pas réussi à déterminer votre fuseau horaire. Veuillez vérifier les paramètres de votre appareil et réessayez. ",
            REMINDER_ERROR_MSG: "Il y a eu un problème lors de la création du rappel.",
            UNSUPPORTED_DEVICE_MSG: "Votre appareil ne supporte pas la création de rappels. ",
            CANCEL_MSG: "OK, j'ai annulé la demande de rappel. ",
            MISSING_PERMISSION_MSG: "Je n'ai pas accès à la création de rappels. Veuillez accéder à votre application Alexa et suivez les instructions depuis la card que je vous ai envoyé. ",
            POST_REMINDER_HELP_MSG: "Pour connaître quand votre rappel se déclenchera, il suffit de me dire 'combien de jours reste-t-il avant mon anniversaire'. Que voulez-vous faire ?",
            PROGRESSIVE_MSG: "Je recherche des célébrités nées aujourd'hui. ",
            API_ERROR_MSG: "Désolé, je n'arrive pas à me connecter à l'API externe pour obtenir des résultats. Veuillez réessayer plus tard. ",
            CONJUNCTION_MSG: ' et ',
            TURNING_YO_MSG: [" qui vient d'avoir {{count}} an", " avec {{count}} an"],
            TURNING_YO_MSG_plural: [" qui vient d'avoir {{count}} ans", " avec {{count}} ans"],
            CELEBRITY_BIRTHDAYS_MSG: "Aujourd'hui, les célébrités suivantes fêtent leur anniversaire: ",
            ALSO_TODAY_MSG: "C'est aussi l'anniversaire de : ",
            POST_CELEBRITIES_HELP_MSG: "Voulez-vous connaitre le nombre de jours avant votre anniversaire ou bien enregistrer un rappel: quel est votre choix ? "
        }
    },
}