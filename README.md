# BlobWar API
This Backend-Api is used by the browser-game [BlobWar.io](https://blobwar.io).

## Basics
* This project contains the API with REST-Endpoints to manage the game.
* The API manages the user accounts, the discord authorization, the shop, purchases, server stats and more.

## Database
* All user accounts, purchases and histories are saved in a database.
* LIVE-Database: **151.80.34.200**, DB: **blobwar**

You'll need user credentials to connect to the database.

## Logging
Logs of the API are coming soon.

## Endpoints

The basic-URL to all endpoints is the following:

**URL (Localhost):** http://localhost:8080/api/v1
**URL (Production):** https://api.blobwar.io:8080/v1

Most of the endpoints are secured with an API-Token

**Authorization:** Bearer {ApiToken}

(This is still not fully implemented, but I'll look into it as soon as all the importants endpoints are done).


**Response-Statuscodes:**
* 200: Success. The body contains the requested data.
* 201: Successfully created.
* 204: Success. The body is empty.
* 400: The request contained invalid parameters.
* 401: The user is not authorized to control this api.
* 409: There has been a conflict with the database.
* 500: Internal-Server-Error.
* 504: The server sent no response back.

There are more details in the response-body about the specific error codes.

## User

**(GET) /users**

Request to get all users from the database.

**(GET) /users/{userId}**

Request to get a specific user by his userId from the database.

**Example-Response:** 
```javascript
{
    "Id": 58,
    "Username": "Pake",
    "Discriminator": "0001",
    "DiscordUserId": "185053226641522690",
    "Email": "itzpakemobile@gmail.com",
    "SessionId": "BOGTO8fH8o8YuWxDv2Kmx1hhmhJ3bUfIK32ybbG3",
    "Coins": 50,
    "Xp": 0,
    "Color": null,
    "Role": "Player",
    "Muted": 0
}
```

## Login

*  **(POST) /users/session**

Returns the usero object of the user with the given sessionId

**Body:** 
```javascript
{
	"SessionId": "BOGTO8fH8o8YuWxDv2Kmx1hhmhJ3bUfIK32ybbG3"
}
```

* **(POST) /auth/discord**

Creates or find a user in the database and returns the user object.

**Body:** 
```javascript
{
	"code": "jIsmmk2yfD9B35gZ9HbKqsfi2FHNYc"
}
```

## Leaderboard

**(GET) /users/leaderboard**

Returns the top 100 players with the most experience.

**Example-Response:** 
```javascript
[
    {
        "Id": 4,
        "Username": "Test2",
        "Discriminator": "9999",
        "Xp": 3000
    },
    {
        "Id": 1,
        "Username": "TestUser",
        "Discriminator": "4306",
        "Xp": 250
    },
    {
        "Id": 2,
        "Username": "Test",
        "Discriminator": "4307",
        "Xp": 100
    }
]
```

## Shop

**(GET) /shop/skins/premium**

Returns all premium skins.

**(GET) /shop/skins/free**

Returns all free skins.

**(GET) /shop/skins/level**

Returns all level skins.

**(GET) /shop/skins/owned/{UserId}**

Returns all skins a user owns.

**Example-Response:** 
```javascript
[
    {
        "Id": 1,
        "Name": "Bat",
        "Price": 100
    },
    {
        "Id": 2,
        "Name": "Sabretooth",
        "Price": 0
    }
]
```

## Bad Words

**(GET) /badwords**

Returns all bad words.
