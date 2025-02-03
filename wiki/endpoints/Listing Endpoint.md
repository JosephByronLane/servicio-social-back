# Listings Endpoint Documentation

## Overview

This Endpoint allows you to manage listings, which include information about the owner, the house, services, and associated images. Below you will find the available endpoints along with their expected inputs and outputs.

---

## Endpoints

### Create Listing

**Method**: `POST`  
**URL**: `/listing`

Creates a new listing along with its related data (owner, house, services, images).

#### Request Body

```json
{
  "tempId": "tempId from create upload session",
  "owner": {
    "firstName": "string",
    "lastName": "string",
    "email": "string (unique identifier for the owner)",
    "telephone": "string"
  },
  "house": {
    "type": "string (e.g., 'Casa', 'Departamento', 'Cuarto')",
    "isLookingForRoommate": "boolean",
    "isOnlyWomen": "boolean",
    "price": "number (decimal)",
    "street": "string",
    "postalCode": "string",
    "crossings": "string",
    "colony": "string"
  },
  "services": [
    "array of strings (service names, e.g., ["water", "electricity", "parking"])"
  ],
  "listing": {
    "title": "string",
    "description": "string"
  }
}
```

---

#### Return Body
**Status**: `201`  
```json

{
	"message": "Listing created successfully.",
	"data": {
		"id": 22,
		"houseId": 22,
		"title": "hijo de puta",
		"description": "brother ya estoy cansado",
		"createdAt": "2024-12-24T01:42:54.000Z",
		"updatedAt": "2024-12-24T01:42:54.000Z",
		"deletedAt": null,
		"house": {
			"id": 22,
			"ownerId": 11,
			"type": "Cuarto",
			"isLookingForRoommate": true,
			"isOnlyWomen": false,
			"price": 1100,
			"street": "123 Main St",
			"postalCode": "12345",
			"crossings": "53/32",
			"colony": "asdf",
			"createdAt": "2024-12-24T01:42:54.000Z",
			"updatedAt": "2024-12-24T01:42:54.000Z",
			"deletedAt": null,
			"owner": {
				"id": 11,
				"firstName": "don pollo",
				"lastName": "y su polla",
				"email": "24197141@modelo.edu.mx",
				"telephone": "123-456-7890",
				"createdAt": "2024-12-24T01:27:12.000Z",
				"updatedAt": "2024-12-24T01:27:12.000Z",
				"deletedAt": null
			},
			"services": [
				{
					"id": 1,
					"name": "water",
					"createdAt": "2024-12-22T03:22:54.000Z",
					"updatedAt": "2024-12-22T03:22:54.000Z",
					"deletedAt": null
				}
			]
		},
		"images": [
			{
				"id": 39,
				"listingId": 22,
				"tempId": null,
				"imageUrl": "assets/listings/22/images-1735004565207-614204374.jpg",
				"createdAt": "2024-12-24T01:42:45.000Z",
				"updatedAt": "2024-12-24T01:42:54.000Z",
				"deletedAt": null
			}
		]
	},
	"images": [
		{
			"id": 39,
			"imageUrl": "assets/listings/22/images-1735004565207-614204374.jpg"
		}
	]
}
```
---

### Get all listings

**Method**: `GET`  
**URL**: `/listing`

Retrieves all listings in the database.
**NOTE:** this returns an ownerId, you will need to query that separately.

#### Return Body
**Status**: `200`  

```json
{
	"data": [
		{
			"id": 13,
			"houseId": 13,
			"title": "Spacioaaaaus House for Rent",
			"description": "A beautiful house located in the heart of the city.",
			"createdAt": "2024-12-23T06:45:14.000Z",
			"updatedAt": "2024-12-23T06:45:14.000Z",
			"deletedAt": null,
			"house": {
				"id": 13,
				"ownerId": 9,
				"type": "Cuarto",
				"isLookingForRoommate": true,
				"isOnlyWomen": false,
				"price": 1100,
				"street": "123 Main St",
				"postalCode": "12345",
				"crossings": "53/32",
				"colony": "Cholul",
				"createdAt": "2024-12-23T06:45:14.000Z",
				"updatedAt": "2024-12-23T06:45:14.000Z",
				"deletedAt": null,
				"services": [
					{
						"id": 1,
						"name": "water"
					}
				]
			},
			"images": [
				{
					"id": 31,
					"imageUrl": "assets/listings/13/images-1734936309156-92653327.jpg"
				}
			]
		}
	]
}
```
---
### Get listing by ID

**Method**: `GET`  
**URL**: `/listing/:id`

Retrieves a single listing in the database based on the provided ID

#### Return Body
**Status**: `200`  

```json
{
	"id": 20,
	"houseId": 20,
	"title": "puto el que lo lea",
	"description": "me quiero suicidar.",
	"createdAt": "2024-12-24T01:27:12.000Z",
	"updatedAt": "2024-12-24T01:27:12.000Z",
	"deletedAt": null,
	"house": {
		"id": 20,
		"ownerId": 11,
		"type": "Cuarto",
		"isLookingForRoommate": true,
		"isOnlyWomen": false,
		"price": 1100,
		"street": "123 Main St",
		"postalCode": "12345",
		"crossings": "53/32",
		"colony": "Cholul",
		"createdAt": "2024-12-24T01:27:12.000Z",
		"updatedAt": "2024-12-24T01:27:12.000Z",
		"deletedAt": null,
		"owner": {
			"id": 11,
			"firstName": "don pollo",
			"lastName": "y su polla",
			"email": "24197141@modelo.edu.mx",
			"telephone": "123-456-7890"
		},
		"services": [
			{
				"id": 1,
				"name": "water",
				"createdAt": "2024-12-22T03:22:54.000Z",
				"updatedAt": "2024-12-22T03:22:54.000Z",
				"deletedAt": null
			}
		]
	},
	"images": [
		{
			"id": 35,
			"listingId": 20,
			"tempId": null,
			"imageUrl": "assets/listings/20/images-1735003624332-23706039.jpg",
			"createdAt": "2024-12-24T01:27:04.000Z",
			"updatedAt": "2024-12-24T01:27:12.000Z",
			"deletedAt": null
		},
		{
			"id": 36,
			"listingId": 20,
			"tempId": null,
			"imageUrl": "assets/listings/20/images-1735003626533-668491817.jpg",
			"createdAt": "2024-12-24T01:27:06.000Z",
			"updatedAt": "2024-12-24T01:27:12.000Z",
			"deletedAt": null
		},
		{
			"id": 37,
			"listingId": 20,
			"tempId": null,
			"imageUrl": "assets/listings/20/images-1735003628966-893522118.jpg",
			"createdAt": "2024-12-24T01:27:08.000Z",
			"updatedAt": "2024-12-24T01:27:12.000Z",
			"deletedAt": null
		}
	]
}
```

---
### Search listings

**Method**: `GET`  
**URL**: `/listing?queryparam1=value&queryparam2=value&...`

Searches the database for all parameters that meet the requirements

#### Query Parameters

- `services`: Array of service names.
- `type`: Type of the house (e.g., "Cuarto", "Casa", "Departamento").
- `isLookingForRoommate`: Boolean (true or false).
- `isOnlyWomen`: Boolean (true or false).
- `minPrice`: Minimum price (decimal).
- `maxPrice`: Maximum price (decimal).
- `title`: Keyword for the title.
- `sort`: Sorting order (newest, oldest, alphabetical, price_asc, price_desc).
- `paging`: Enable pagination (true or false).
- `page`: Page number (default: 1).
- `pageSize`: Number of items per page (default: 10).

For example, a query would look like `localhost:3000/listing?type=Cuarto&title=puto&sort=price_asc`

#### Return Body
**Status**: `200`  

```json
{
	"data": [
		{
			"id": 20,
			"houseId": 20,
			"title": "puto el que lo lea",
			"description": "me quiero suicidar.",
			"createdAt": "2024-12-24T01:27:12.000Z",
			"updatedAt": "2024-12-24T01:27:12.000Z",
			"deletedAt": null,
			"house": {
				"id": 20,
				"ownerId": 11,
				"type": "Cuarto",
				"isLookingForRoommate": true,
				"isOnlyWomen": false,
				"price": 1100,
				"street": "123 Main St",
				"postalCode": "12345",
				"crossings": "53/32",
				"colony": "Cholul",
				"createdAt": "2024-12-24T01:27:12.000Z",
				"updatedAt": "2024-12-24T01:27:12.000Z",
				"deletedAt": null,
				"services": [
					{
						"id": 1,
						"name": "water"
					}
				]
			},
			"images": [
				{
					"id": 35,
					"imageUrl": "assets/listings/20/images-1735003624332-23706039.jpg"
				},
				{
					"id": 36,
					"imageUrl": "assets/listings/20/images-1735003626533-668491817.jpg"
				},
				{
					"id": 37,
					"imageUrl": "assets/listings/20/images-1735003628966-893522118.jpg"
				}
			]
		}
	]
}
```


<!-- 
---

### Delete listing by ID

**Method**: `DELETE`  
**URL**: `/listing/:id`

Retrieves a single listing in the database based on the provided ID
**NOTE:** **<span style="color:red">YOU DO NOT NEED TO CALL THIS ENDPOINT IN PRODUCTION, LISTING DELETION IS HANDLED BY THE EMAIL HANDLER</span>**
This endpoint is only if you fuck up and want to delete the record.

#### Return Body
**Status**: `200`  

```json
{
	"message": "Listing deleted successfully"
}
``` -->


---

### Delete listing by token

**Method**: `DELETE`  
**URL**: `/listing/:token`

Deletes a listing on the database given by the provided token.

**NOTE:** This endpoint should only be called when the user manually wants to delete their listing (wether it be by email or manually accessing the site from the `pagina-de-inicio` at the bottom).
The token is given to the user so they can delete it, or its automatically inserted into the url when the user presses the button to delete the  listing (which is found on the sent emails).

#### Return Body
so it doesn't really return anything, it just redirects the user to a success or error page depending if the listing was succesfully deleted or not.
