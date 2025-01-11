# API Documentation

## Authentication Endpoints

### Login
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```typescript
  {
    email: string;
    password: string;
  }
  ```
- **Success Response**: `200 OK`
  ```typescript
  {
    token: string;
    user: User;
  }
  ```

### Register
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```typescript
  {
    email: string;
    password: string;
    name: string;
  }
  ```
- **Success Response**: `201 Created`

### Logout
- **URL**: `/api/users/logout`
- **Method**: `POST`
- **Auth required**: No
- **Success Response**: `200 OK`

### Check Email
- **URL**: `/api/users/check-email`
- **Method**: `POST`
- **Auth required**: No
- **Body**:
  ```typescript
  {
    email: string;
  }
  ```
- **Success Response**: `200 OK`

## User Endpoints

### Get Current User
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    user: User;
  }
  ```

### Get All Users
- **URL**: `/api/users`
- **Method**: `GET`
- **Auth required**: Yes
- **Role required**: Any
- **Success Response**: `200 OK`
  ```typescript
  {
    users: User[];
  }
  ```

### Get User by ID
- **URL**: `/api/users/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    user: User;
  }
  ```

### Update User
- **URL**: `/api/users/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Body**: User fields to update
- **Success Response**: `200 OK`

### Delete User
- **URL**: `/api/users/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Success Response**: `200 OK`

## Predio Endpoints

### Create Predio
- **URL**: `/api/predios`
- **Method**: `POST`
- **Auth required**: Yes
- **Body**: Predio data
- **Success Response**: `201 Created`

### Get All Predios
- **URL**: `/api/predios`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```typescript
  {
    predios: Predio[];
  }
  ```

### Get Predio by ID
- **URL**: `/api/predios/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    predio: Predio;
  }
  ```

### Get Predios by User ID
- **URL**: `/api/predios/usuario/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    predios: Predio[];
  }
  ```

### Update Predio
- **URL**: `/api/predios/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Body**: Predio fields to update
- **Success Response**: `200 OK`

### Delete Predio
- **URL**: `/api/predios/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Success Response**: `200 OK`

## Cancha Endpoints

### Create Cancha
- **URL**: `/api/canchas`
- **Method**: `POST`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Body**: Cancha data
- **Success Response**: `201 Created`

### Get All Canchas
- **URL**: `/api/canchas`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    canchas: Cancha[];
  }
  ```

### Get Cancha by ID
- **URL**: `/api/canchas/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    cancha: Cancha;
  }
  ```

### Get Canchas by Predio ID
- **URL**: `/api/canchas/predio/:predioId`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```typescript
  {
    canchas: Cancha[];
  }
  ```

### Update Cancha
- **URL**: `/api/canchas/:id`
- **Method**: `PUT`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Body**: Cancha fields to update
- **Success Response**: `200 OK`

### Delete Cancha
- **URL**: `/api/canchas/:id`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Role required**: ADMIN or OWNER
- **Success Response**: `200 OK`

## Error Responses

All endpoints can return the following error responses:

- **401 Unauthorized**
  ```typescript
  {
    error: "No autorizado";
  }
  ```

- **403 Forbidden**
  ```typescript
  {
    error: "No tiene permisos suficientes";
  }
  ```

- **404 Not Found**
  ```typescript
  {
    error: "Recurso no encontrado";
  }
  ```

- **500 Internal Server Error**
  ```typescript
  {
    error: "Error interno del servidor";
  }
  ``` 