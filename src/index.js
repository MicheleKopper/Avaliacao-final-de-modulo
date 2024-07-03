import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

let users = []
let nextUser = 1

let messages = []
let nextMassage = 1

// ---------- CRIAR MENSAGENS ----------
// http://localhost:3333/massage
app.post('/massage', (request, response) => {
    const { title, description, email } = request.body

    // VALIDAR SE FOI INSERIDO TITLE E DESCRIPTION
    if (!title) {
        response.status(400).json({ mensagem: 'Por favor, verifique se passou o título.' })
    }

    if (!description) {
        response.status(400).json({ mensagem: 'Por favor, verifique se passou a descrição da mensagem.' })
    }


    // VALIDAR SE O EMAIL ESTÁ CADASTRADO
    const verificarEmail = users.find(user => user.email === email)

    if (!verificarEmail) {
        response.status(404).json({ mensagem: 'Email não encontrado, verifique ou crie uma conta.' })
    }

    // CADASTRAR NOVA MENSAGEM
    let newMassage = {
        id: nextMassage,
        title: title,
        description: description,
        email: email
    }

    messages.push(newMassage)
    nextMassage++

    response.status(201).send(`Mensagem criada com sucesso!
        Id: ${newMassage.id}
        Título: ${title}
        Descrição: ${description}`)
})

// ---------- LER MENSAGENS ----------
// http://localhost:3333/massage/:email
app.get('/massage/:email', (request, response) => {
    const { email } = request.params

    // VALIDAR SE O EMAIL ESTÁ CADASTRADO
    const verificarEmail = users.find(user => user.email === email)

    if (!verificarEmail) {
        response.status(404).json({ mensagem: 'Email não encontrado, verifique ou crie uma conta.' })
    }

    // FILTRAR AS MENSAGENS CADASTRADAS
    const userMessages = messages.filter(message => message.email === email)

    // MAPEAR OS RECADOS CADASTRADOS
    const listMessage = userMessages.map((message) => `
    id: ${message.id}
    title: ${message.title}
    description: ${message.description}`)

    response.status(200).send(`Seja bem-vindo! ${verificarEmail.user_name} ${listMessage}`)
})

// ---------- ATUALIZAR MENSAGENS ----------
// http://localhost:3333/massage/:id
app.put('/massage/:id', (request, response) => {
    const { title, description } = request.body

    // DEFINIR UM PARÂMETRO
    const id = Number(request.params.id)

    // VALIDAR SE FOI INSERIDO ID, TITLE, PASSWORD
    if (!id) {
        response.status(400).json({ mensagem: 'Por favor, informe um id válido da mensagem' })
    }

    if (!title) {
        response.status(400).json({ mensagem: 'Por favor, informe o título da mensagem' })
    }

    if (!description) {
        response.status(400).json({ mensagem: 'Por favor, informe a descrição da mensagem' })
    }

    // VALIDAR SE O ID EXISTE
    const messageIndex = messages.findIndex(message => message.id === id)

    if (messageIndex === -1) {
        response.status(404).json({ mensagem: 'Id da mensagem não encontrado' })
    }

    // ID ENCONTRADO - ATUALIZAR A MENSAGEM
    messages[messageIndex].title = title
    messages[messageIndex].description = description

    response.status(200).json(`Mensagem atualizada com sucesso! Id: ${messages[messageIndex].id}, Título: ${messages[messageIndex].title}, Descrição: ${messages[messageIndex].description}`)

})

// ---------- DELETAR MENSAGENS ----------
// http://localhost:3333/massage/:id
app.delete('/massage/:id', (request, response) => {
    const id = Number(request.params.id)

    // VALIDAR SE FOI INSERIDO UM ID
    if (!id) {
        response.status(400).json({ mensagem: 'Por favor, informe um id válido da mensagem' })
    }

    // VALIDAR SE O ID EXISTE
    const messageIndex = messages.findIndex(message => message.id === id)

    if (messageIndex === -1) {
        response.status(404).json({ mensagem: 'Id da mensagem não encontrado' })
    } else {
        messages.splice(messageIndex, 1)
        response.status(200).json({ mensagem: 'Mensagem apagada com sucesso' })
    }
})

// ---------- SIGN UP: CRIAR USUÁRIO ----------
app.post('/signup', (request, response) => {
    const { user_name, email, password } = request.body

    // VALIDAR SE FOI INSERIDO NAME, EMAIL, PASSWORD
    if (!user_name) {
        response.status(400).json({ mensagem: 'Por favor, verifique se passou o nome.' })
    }

    if (!email) {
        response.status(400).json({ mensagem: 'Por favor, verifique se passou o email.' })
    }

    if (!password) {
        response.status(400).json({ mensagem: 'Por favor, verifique se passou a senha.' })
    }

    // VALIDAR SE O EMAIL JÁ ESTÁ CADASTRADO
    const verificarEmail = users.find(user => user.email === email)

    if (verificarEmail) {
        response.status(400).json({ mensagem: 'Email já cadastrado, insira outro.' })
    }


    // CRIAR NOVO USUÁRIO
    const newUser = {
        id: nextUser,
        user_name: user_name,
        email: email,
        password: password
    }

    users.push(newUser)
    nextUser++

    response.status(201).json({ mensagem: `Seja bem - vindo ${user_name}! Pessoa usuária registrada com sucesso.` })
})

// ---------- LOGIN ----------
app.post('/login', (request, response) => {
    const { email, password } = request.body

    // VALIDAR SE FOI INSERIDO EMAIL E PASSWORD
    if (!email) {
        response.status(400).json({ mensagem: 'Insira um email válido' })
    }

    if (!password) {
        response.status(400).json({ mensagem: 'Insira uma senha válida' })
    }

    // VALIDAR SE O EMAIL ESTÁ CADASTRADO
    const verificarEmail = users.find(user => user.email === email)

    if (!verificarEmail) {
        response.status(400).json({ mensagem: 'Email não encontrado no sistema, verifique ou crie uma conta.' })
    }

    // EMAIL APROVADO
    response.status(200).json({ mensagem: `Seja bem - vindo ${verificarEmail.user_name}! Pessoa usuária logada com sucesso.` })
})

//------- DEFAULT PATH ----

app.get('/', (request, response) => {
    response.status(200).send('Bem vindo à aplicação 🚀');
})

app.listen(3333, () => console.log('Bem vindo à aplicação'))