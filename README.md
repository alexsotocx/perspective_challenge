# Challenge

This project is a challenge provided for an interview

## How to run

Be sure to you have all dependencies and follow the next instructions

1. Install package dep `yarn`
2. Modify or create `.env` file, follow the example provided (PORT, MONGO_DB_URL)
3. Run the project `yarn dev:start`

## Dependencies

* Nodejs v18
* docker (for MongoDB)

## Scripts 

* `yarn dev:start` starts the server in development mode
* `yarn build` builds the project
* `yarn start` starts the projects, requires `yarn build` first
* `yarn test:unit` executes the unit test
* `yarn test:e2e` executes the e2e test

## Endpoints

* `GET /v1/users` return all users, is paginated by default, accept query params `limit`, `page`, `created`, `order` ('asc', 'desc')
* `POST /v1/users` creates a user, accepts json body
```json
{
    "firstName": "S",
    "lastName": "B",
    "email": "c@gmail.com"
}
```

## Goal
1. Adjust one endpoint so it accepts a user and stores it in a database.
2. Adjust one endpoint so it returns (all) users from the database.
   * This endpoint should be able to receive a query parameter `created` which sorts users by creation date ascending or descending.


