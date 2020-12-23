|            |                      URL                       |                                                  Status                                                  |
| :--------: | :--------------------------------------------: | :------------------------------------------------------------------------------------------------------: |
|     CI     |                    Private                     |       [![Build Status](https://dev.azure.com/fc5y/fc5y/_apis/build/status/main/fc5y.user-be?branchName=master)](https://dev.azure.com/fc5y/fc5y/_build/latest?definitionId=7&branchName=master)        |
|  Staging   |                    Private                     | ![](https://vsrm.dev.azure.com/fc5y/_apis/public/Release/badge/5733aefa-7440-4173-9990-437724df1c84/7/13) |
| Production |                    Private                     | ![](https://vsrm.dev.azure.com/fc5y/_apis/public/Release/badge/5733aefa-7440-4173-9990-437724df1c84/7/24) |


# Description

User Backend for fc5y project

# DB Set up

**This section is deprecated. Please check [/docs/SETTING_UP.md](docs/SETTING_UP.md) and [/docs/RUNNING.md](docs/RUNNING.md) for more updated version.**

DB information: ./config/config.json

To run db migration:

```
npx sequelize-cli db:migrate # run migration
npx sequelize-cli db:migrate:undo # undo the last migration
npx sequelize-cli db:migrate:status # migration log
```

# Email certification:
[Details](https://docs.google.com/document/d/1XGxTuUXc9CaU1Pljkc7kRp_ZuaLniHSi0iVI82Kx2eY/edit?usp=sharing)

# How to run

Development:

```sh
npm install
npm run dev
```

Test:

```sh
npm run test
```

# Notice

Developers can modify everything but please provide the scripts to run dev, start and test.

For example:

- Developers can change the place of test files, developers can add test config
- Developers can change the folder structure to store routes, controllers or anything else
- Developers can change the content of starting script like "ENV_ABC=xyz node abc/index.js" but please remains the script command.

# REST example

- Open your browser in `localhost:4000` and try the example REST endpoints:
  - `localhost:4000/api/users` (GET)
  - `localhost:4000/api/users/1` (GET)
  - `localhost:4000/api/users` (POST)
    - Body format: `{ username: 'john' }`
  - `localhost:4000/api/users/1` (PUT)
    - Body format: `{ username: 'john' }`
  - `localhost:4000/api/users/1` (DELETE)
