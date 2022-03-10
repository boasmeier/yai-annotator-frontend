# YAI-Annotator Forntend
- Run the app on port 4200 with `npm run start`
- The URL for the backend is hardcoded in each [service](./src/app/services/) to `http://localhost:3000/api/v0/...`
- There is no possibility to register in the UI but you can send the following request to `http://localhost:3000/api/v0/register` 

```
{
    "firstname": "Web",
    "lastname": "Lab",
    "email": "web@lab.ch",
    "authenticationString": "a186b686be95453a1a0bfe1ddae858a2c029cd8ca3e1bd9c4366efd56c3491f3"
}
```

then you can login using the following credentials username=`web@lab.ch`, pw=`hahatest`.




