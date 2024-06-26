const readline = require('readline')
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai')
require("dotenv/config")

const client = new OpenAIClient(
    process.env.GPT_ENDPOINT, 
    new AzureKeyCredential(process.env.API_CREDENTIAL),
)

const getAPIMessage = async (message) => {
    try {
        response = await client.getCompletions(
            process.env.DEV_ID,
            message,
            {
                temperature: 0,
                maxTokens: 55,
            }
        )

        return response.choices[0].text.trim()
    } catch (err) {
        console.error(err)
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const askQuestion = (question) => {
    return new Promise((resolve) => {
        rl.question(question, (answer) => resolve(answer))
    })
}


const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';
const SUCESSO = 0;


welcome =  () => {
    console.clear()
    console.log(green + 'Bem vind@ ao ' + red + 'IABerta!' + green + '\nFaça sua pergunta: ' + reset)
}


(async () => {
    welcome()

    try{
        while (true) {
            const userInput = await askQuestion('\n' + green + '> ' + reset)
            
            if(userInput.toLowerCase() === 'sair' || userInput.toLowerCase() === 'exit')
            {
                rl.close()
                console.log('\n' + red + 'Até mais!')
                process.exit(SUCESSO)
            } 
            else if (userInput === 'clear' || userInput === 'clr' || userInput === 'cls') welcome()
            else console.log('\n' + red + '> ' + reset + (await getAPIMessage(userInput)))
        }
    } catch (err) {
        rl.close()
        console.error(err)
        process.exit(1)
    }
})()
