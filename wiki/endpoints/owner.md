# (House) Owners Endpoint Documentation

## Overview

This Endpoint allows you to manage the (house) owners that are in the database. 

---

## Endpoints

### Create owner

**Method**: `POST`  
**URL**: `/owner`

Creates a new owner.

#### Request Body

```json
{
	"firstName": "Aquise",
	"lastName":"Lameto",
	"email":"Aquise@Lameto.com",
	"telephone":"123456789"
}
```
#### Return Body
**Status**: `201`  

```json
{
	"id": 12,
	"firstName": "Aquise",
	"lastName": "Lameto",
	"email": "Aquise@Lameto.com",
	"telephone": "123456789",
	"updatedAt": "2024-12-24T01:51:56.383Z",
	"createdAt": "2024-12-24T01:51:56.383Z"
}
```

### Get all owners

**Method**: `GET`  
**URL**: `/owner`

Retrieves all owners in the database.

#### Return Body
**Status**: `200`  

```json
[
	{
		"id": 11,
		"firstName": "don pollo",
		"lastName": "y su polla",
		"email": "24197141@modelo.edu.mx",
		"telephone": "123-456-7890",
		"createdAt": "2024-12-24T01:27:12.000Z",
		"updatedAt": "2024-12-24T01:27:12.000Z",
		"deletedAt": null
	},
	{
		"id": 12,
		"firstName": "Pedro",
		"lastName": "Pascal",
		"email": "aaac@gmail.com",
		"telephone": "123456789",
		"createdAt": "2024-12-24T01:51:56.000Z",
		"updatedAt": "2024-12-24T01:51:56.000Z",
		"deletedAt": null
	}
]
```

### Get owner by Id

**Method**: `GET`  
**URL**: `/owner/:id`

Retrieves an owner based on the ID.

#### Return Body
**Status**: `200`  

```json
{
	"id": 11,
	"firstName": "don pollo",
	"lastName": "y su polla",
	"email": "24197141@modelo.edu.mx",
	"telephone": "123-456-7890",
	"createdAt": "2024-12-24T01:27:12.000Z",
	"updatedAt": "2024-12-24T01:27:12.000Z",
	"deletedAt": null
}
```

### Get owner by email

**Method**: `GET`  
**URL**: `/owner/email/:email`

Retrieves an owner based on the enail.

**NOTE:** You might need to encode the email's `@` as `%40` due to things that go over my head.

#### Return Body
**Status**: `200`  

```json
{
	"id": 11,
	"firstName": "don pollo",
	"lastName": "y su polla",
	"email": "24197141@modelo.edu.mx",
	"telephone": "123-456-7890",
	"createdAt": "2024-12-24T01:27:12.000Z",
	"updatedAt": "2024-12-24T01:27:12.000Z",
	"deletedAt": null
}
```


### Delete owner by id

**Method**: `DELETE`  
**URL**: `/owner/:id`

Deletes an owners record from the database. 

**NOTE:** **<span style="color:red">YOU DO NOT NEED TO CALL THIS ENDPOINT IN PRODUCTION</span>**
Things wont explode if you do, but still.

#### Return Body
**Status**: `200`  

```json
{
	"message": "Owner deleted"
}
```
