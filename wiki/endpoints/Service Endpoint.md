# Services Endpoint Documentation

## Overview

This Endpoint allows you to manage the services a house can have. 
By default there are:
- water
- electricity
- internet
- furnishings
- parking
- garbage collection
- pet friendly
- cleaning service
- washing service
- communal areas
- food
---

## Endpoints

### Create service

**Method**: `POST`  
**URL**: `/service`

Creates a new service.

#### Request Body

```json
{
	"name":"free glory hole"
}
```
#### Return Body
**Status**: `201`  

```json
{
	"id": 12,
	"name": "free glory hole",
	"updatedAt": "2024-12-22T08:07:36.588Z",
	"createdAt": "2024-12-22T08:07:36.588Z"
}
```

### Get all services

**Method**: `GET`  
**URL**: `/service`

Returns all services in the database.

#### Return Body
**Status**: `200`  

```json
[
	{
		"id": 1,
		"name": "water",
		"createdAt": "2024-12-23T22:22:55.000Z",
		"updatedAt": "2024-12-23T22:22:55.000Z",
		"deletedAt": null
	},
	{
		"id": 2,
		"name": "electricity",
		"createdAt": "2024-12-23T22:22:55.000Z",
		"updatedAt": "2024-12-23T22:22:55.000Z",
		"deletedAt": null
	},...
]
```
### Get service by ID

**Method**: `GET`  
**URL**: `/service/:id`

Returns the service with the specified ID
#### Return Body
**Status**: `200`  

```json
{
	"id": 1,
	"name": "water",
	"createdAt": "2024-12-22T03:22:54.000Z",
	"updatedAt": "2024-12-22T03:22:54.000Z",
	"deletedAt": null
}
```
### Get service by name

**Method**: `GET`  
**URL**: `/service/name/:name`

Returns the service found with the same name (Two services  can't have the same name)
#### Return Body
**Status**: `200`  

```json
{
	"id": 1,
	"name": "water",
	"createdAt": "2024-12-22T03:22:54.000Z",
	"updatedAt": "2024-12-22T03:22:54.000Z",
	"deletedAt": null
}
```

### Delete service by name

Currently there is no way to delete services, if you ***really*** need one deleted contact the admin and let them know.
