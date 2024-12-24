# Houses Endpoint Documentation

## Overview

This Endpoint allows you to manage the houses inside the database.

---

## Endpoints

### Create house

**Method**: `POST`  
**URL**: `/house`

Creates a new hoyse.

#### Request Body

```json
{
		"owner": {
			"firstName": "Jose",
			"lastName":"Pescador",
			"email":"aaac@gmail.com",
			"telephone":"123456789"
		},
		"type": "Casa",
    "isLookingForRoommate": true,
    "isOnlyWomen": false,
    "price": 1500.00,
    "street": "123 Main St",
    "postalCode": "12345",
    "crossings": "53/32",
    "colony": "Cholul",
	"services": ["water", "internet"]
}
```
#### Return Body
**Status**: `201`  

```json
{
	"id": 13,
	"ownerId": 10,
	"type": "casa",
	"isLookingForRoommate": true,
	"isOnlyWomen": false,
	"price": 1500,
	"street": "123 Main St",
	"postalCode": "12345",
	"crossings": "53/32",
	"colony": "Cholul",
	"updatedAt": "2024-12-20T08:33:56.983Z",
	"createdAt": "2024-12-20T08:33:56.983Z"
}
```
---
### Get All Houses

**Method**: `GET`  
**URL**: `/house`

Gets all houses.


#### Return Body
**Status**: `200`  

```json
[
	{
		"id": 11,
		"ownerId": 9,
		"type": "Cuarto",
		"isLookingForRoommate": true,
		"isOnlyWomen": false,
		"price": 1100,
		"street": "123 Main St",
		"postalCode": "12345",
		"crossings": "53/32",
		"colony": "Cholul",
		"createdAt": "2024-12-23T06:28:59.000Z",
		"updatedAt": "2024-12-23T06:28:59.000Z",
		"deletedAt": null,
		"owner": {
			"id": 9,
			"firstName": "John",
			"lastName": "Doe",
			"email": "pedro@pascalero.com",
			"telephone": "123-456-7890",
			"createdAt": "2024-12-22T04:12:47.000Z",
			"updatedAt": "2024-12-22T04:12:47.000Z",
			"deletedAt": null
		},
		"services": [
			{
				"id": 1,
				"name": "water",
				"createdAt": "2024-12-22T03:22:54.000Z",
				"updatedAt": "2024-12-22T03:22:54.000Z",
				"deletedAt": null,
				"HouseService": {
					"houseId": 11,
					"serviceId": 1,
					"createdAt": "2024-12-23T06:28:59.000Z",
					"updatedAt": "2024-12-23T06:28:59.000Z",
					"deletedAt": null
				}
			}
		]
	},...
]
```
---
### Get House by ID

**Method**: `GET`  
**URL**: `/house/:id`

Gets a house based on an ID.

#### Return Body
**Status**: `200`  

```json
{
	"id": 11,
	"ownerId": 9,
	"type": "Cuarto",
	"isLookingForRoommate": true,
	"isOnlyWomen": false,
	"price": 1100,
	"street": "123 Main St",
	"postalCode": "12345",
	"crossings": "53/32",
	"colony": "Cholul",
	"createdAt": "2024-12-23T06:28:59.000Z",
	"updatedAt": "2024-12-23T06:28:59.000Z",
	"deletedAt": null
}
```
---
### Get House by owner ID

**Method**: `GET`  
**URL**: `/house/owner/:id`

Gets all house based on an owner's ID.

#### Return Body
**Status**: `200`  

```json
[
	{
		"id": 11,
		"ownerId": 9,
		"type": "Cuarto",
		"isLookingForRoommate": true,
		"isOnlyWomen": false,
		"price": 1100,
		"street": "123 Main St",
		"postalCode": "12345",
		"crossings": "53/32",
		"colony": "Cholul",
		"createdAt": "2024-12-23T06:28:59.000Z",
		"updatedAt": "2024-12-23T06:28:59.000Z",
		"deletedAt": null,
		"owner": {
			"id": 9,
			"firstName": "John",
			"lastName": "Doe",
			"email": "donpolla@hotmail.com",
			"telephone": "123-456-7890",
			"createdAt": "2024-12-22T04:12:47.000Z",
			"updatedAt": "2024-12-22T04:12:47.000Z",
			"deletedAt": null
		}
	},...
]
```
---
### Get House by owner Email

**Method**: `GET`  
**URL**: `/house/email/:email`

Gets all house based on an owner's Email.

#### Return Body
**Status**: `200`  

```json
[
	{
		"id": 11,
		"ownerId": 9,
		"type": "Cuarto",
		"isLookingForRoommate": true,
		"isOnlyWomen": false,
		"price": 1100,
		"street": "123 Main St",
		"postalCode": "12345",
		"crossings": "53/32",
		"colony": "Cholul",
		"createdAt": "2024-12-23T06:28:59.000Z",
		"updatedAt": "2024-12-23T06:28:59.000Z",
		"deletedAt": null,
		"owner": {
			"id": 9,
			"firstName": "John",
			"lastName": "Doe",
			"email": "donpolla@hotmail.com",
			"telephone": "123-456-7890",
			"createdAt": "2024-12-22T04:12:47.000Z",
			"updatedAt": "2024-12-22T04:12:47.000Z",
			"deletedAt": null
		}
	},...
]
```

---
### Delete House by Id

**Method**: `DELETE`  
**URL**: `/house/:id`

Deletes an owners record from the database. 

**NOTE:** **<span style="color:red">YOU DO NOT NEED TO CALL THIS ENDPOINT IN PRODUCTION</span>**
I dont think things will explode if you do, but still.

#### Return Body
**Status**: `200`  

```json
{
	"message": "House deleted"
}
```

