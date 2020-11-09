# Insurance API Middleware

REST API with Swagger web client.

## Setup

```
npm install
```

copy .env.sample into .env file in the root of the project and fill the required credentials

## Test

```
npm run test
```

## Development

```
npm run dev
```

Check the server will be running http://localhost:3000/api/v1/openapi

Go to "Auth" Post endpoint. Click on [Try it out] button. And complete into username with any existent email in clients. Then click on execute

- So far you can login with any password. (TODO)

![login with email into username in json payload](https://raw.githubusercontent.com/sselvaggi/insurance-api-middleware/main/docs/login.png)

I'll retrive a token. Now we have to copy it.
![copy the value inside token in json response](https://raw.githubusercontent.com/sselvaggi/insurance-api-middleware/main/docs/login2.png)

Now scroll to the top, click on "Authorize" button.
![copy the value inside token in json response](https://raw.githubusercontent.com/sselvaggi/insurance-api-middleware/main/docs/login3.png)

Paste the token insude "value" textfield and click on "Autorize".
![paste the token in value text field](https://raw.githubusercontent.com/sselvaggi/insurance-api-middleware/main/docs/login4.png)

Now we can use the rest of endpoints.

It was crated with [Express API Starter](https://github.com/w3cj/express-api-starter)
