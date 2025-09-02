# Assinador Digital Web

Este projeto é uma plataforma de **Assinatura Digital** que permite a criação e verificação de assinaturas digitais com segurança e integridade, utilizando criptografia RSA e hash SHA-256. O sistema possibilita o registro de usuários, a criação de assinaturas para documentos e a verificação de sua autenticidade.

## Tecnologias Utilizadas

- **Frontend:** React.js, Chakra UI
- **Backend:** Node.js, Express, Prisma, bcrypt, JWT
- **Banco de Dados:** SQlite3
- **Criptografia:** RSA, SHA-256

---

## Como Rodar o Projeto

### 1. Clonando o Repositório

```bash
git clone https://github.com/seu-usuario/assinatura_digital.git
cd assinatura_digital
````

### 2. Configuração do Backend

No diretório `backend`, siga os passos abaixo:

#### Instalar dependências

```bash
cd backend
npm install
```
#### Rodar as Migrations

```bash
npx prisma migrate dev  # ou npx prisma migrate deploy
npx prisma generate
```

#### Iniciar o Backend

```bash
npm run dev
```

O backend ficará rodando na porta `4000` por padrão.

### 3. Configuração do Frontend

No diretório `frontend`, siga os passos abaixo:

#### Instalar dependências

```bash
cd frontend
npm install
```

#### Iniciar o Frontend

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:3000`.

---

## Fluxos e Endpoints

### Fluxos de Usuário

1. **Cadastro de Usuário:**

   * O usuário realiza o cadastro informando nome, e-mail e senha.
   * O sistema gera automaticamente um par de chaves RSA (privada e pública) para o usuário.

2. **Login de Usuário:**

   * O usuário faz login informando e-mail e senha.
   * Um token JWT é gerado e enviado ao frontend para persistir a sessão.

3. **Assinatura de Texto:**

   * O usuário autentica e pode assinar um texto usando a chave privada. O sistema gera a assinatura, armazena no banco de dados e retorna o ID da assinatura.

4. **Verificação de Assinatura:**

   * O usuário pode verificar uma assinatura, fornecendo o ID da assinatura ou o texto e a assinatura (em base64).
   * O sistema valida a assinatura utilizando a chave pública do signatário.

---

### Endpoints do Backend

* **POST /api/register**

  * Descrição: Realiza o cadastro de um novo usuário.
  * Corpo da requisição:

    ```json
    {
      "name": "Nome do Usuário",
      "email": "email@dominio.com",
      "password": "senha123"
    }
    ```
  * Resposta:

    ```json
    {
      "id": "1",
      "name": "Nome do Usuário",
      "email": "email@dominio.com"
    }
    ```

* **POST /api/login**

  * Descrição: Realiza o login de um usuário existente e retorna o token JWT.
  * Corpo da requisição:

    ```json
    {
      "email": "email@dominio.com",
      "password": "senha123"
    }
    ```
  * Resposta:

    ```json
    {
      "id": "1",
      "name": "Nome do Usuário",
      "email": "email@dominio.com",
      "token": "token_jwt_aqui"
    }
    ```

* **POST /api/sign**

  * Descrição: Realiza a assinatura de um texto usando a chave privada do usuário.
  * Corpo da requisição:

    ```json
    {
      "userId": 1,
      "text": "Texto a ser assinado"
    }
    ```
  * Resposta:

    ```json
    {
      "signatureId": "51531889-936b-473d-a3f4-dbc2384e4442"
    }
    ```

* **GET /api/verify/\:id**

  * Descrição: Verifica a assinatura associada ao ID fornecido.
  * Resposta:

    ```json
    {
      "status": "VÁLIDA",
      "signatario": "Nome do Usuário",
      "algoritmo": "RSA-SHA256",
      "dataHora": "2023-06-01T15:00:00.000Z"
    }
    ```

* **POST /api/verify-text**

  * Descrição: Verifica a assinatura baseada no texto e na assinatura fornecida.
  * Corpo da requisição:

    ```json
    {
      "text": "Texto a ser verificado",
      "signatureBase64": "assinatura_em_base64_aqui"
    }
    ```
  * Resposta:

    ```json
    {
      "status": "VÁLIDA",
      "signatario": "Nome do Usuário",
      "algoritmo": "RSA-SHA256",
      "dataHora": "2023-06-01T15:00:00.000Z"
    }
    ```

---

## Casos de Teste

1. **Teste de Validação Positiva:**

   * **Objetivo:** Verificar se a assinatura gerada e verificada é válida.
   * **Passos:**

     1. Registrar um novo usuário.
     2. Realizar login com o usuário registrado.
     3. Assinar um texto e obter o ID da assinatura.
     4. Verificar a assinatura usando o ID e confirmar que o status retornado é **"VÁLIDA"**.

2. **Teste de Validação Negativa:**

   * **Objetivo:** Verificar se o sistema retorna erro ao tentar verificar uma assinatura com dados inválidos.
   * **Passos:**

     1. Registrar um novo usuário.
     2. Realizar login com o usuário registrado.
     3. Tentar verificar uma assinatura com um ID inválido ou uma assinatura alterada.
     4. Confirmar que o status retornado é **"INVÁLIDA"**.
