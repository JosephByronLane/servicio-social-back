# Recommended Usage
## Overview

Realistically, there are only two endpoints you need to make the website work:
- **Listing**
- **Image**

Yup, thats it. 

If you want to make things nice and dynamic you could also consume the `service` endpoint for the services (to make things update dynamically when you add/remove a service) but thas here nor there.

---

## What you'll need from the Listing endpoint.

For the listing endpoint realistically you only need 3 things.


### Search listings

**Method**: `GET`  
**URL**: `/listing?queryparam1=value&queryparam2=value&...`

Searches the database for all parameters that meet the requirements
if left empty at only `/listing/` then it returns all listings.

#### Query Parameters

- `services`: Array of service names/IDs.
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

For example, a query would look like `api-url.org/listing?type=Cuarto&title=puto&sort=price_asc`

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
		},...
	]
}
```


---


### Get listing by Id
**Method**: `GET`  
**URL**: `/listing/:id`


Retrieves a single listing in the database based on the provided ID.
You'd use this endpoint for when the user clicks on a listing to see more details about it.


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




### Create a wListing

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


## What you'll need from the Image endpoint.

I literaly did a whole ass write-up at the [Image Endpoint](Image-Endpoint). Go read it.

