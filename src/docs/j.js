tags:
- name: pet
  description: Everything about your Pets
  externalDocs:
    description: Find out more
    url: http://swagger.io
- name: store
  description: Access to Petstore orders
- name: user
  description: Operations about user
  externalDocs:
    description: Find out more about our store
    url: http://swagger.io

paths:
  /pet:
    put:
      tags:
      - pet
      summary: Update an existing pet
      operationId: updatePet
      requestBody:
        $ref: '#/components/requestBodies/Pet'
      responses:
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
        "405":
          description: Validation exception
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
    post:
      tags:
      - pet
      summary: Add a new pet to the store
      operationId: addPet
      requestBody:
        $ref: '#/components/requestBodies/Pet'
      responses:
        "405":
          description: Invalid input
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
  /pet/findByStatus:
    get:
      tags:
      - pet
      summary: Finds Pets by status
      description: Multiple status values can be provided with comma separated strings
      operationId: findPetsByStatus
      parameters:
      - name: status
        in: query
        description: Status values that need to be considered for filter
        required: true
        style: form
        explode: true
        schema:
          type: array
          items:
            type: string
            default: available
            enum:
            - available
            - pending
            - sold
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
                x-content-type: application/json
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        "400":
          description: Invalid status value
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
  /pet/findByTags:
    get:
      tags:
      - pet
      summary: Finds Pets by tags
      description: Muliple tags can be provided with comma separated strings. Use\
        \ tag1, tag2, tag3 for testing.
      operationId: findPetsByTags
      parameters:
      - name: tags
        in: query
        description: Tags to filter by
        required: true
        style: form
        explode: true
        schema:
          type: array
          items:
            type: string
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
                x-content-type: application/json
            application/xml:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Pet'
        "400":
          description: Invalid tag value
      deprecated: true
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
  /pet/{petId}:
    get:
      tags:
      - pet
      summary: Find pet by ID
      description: Returns a single pet
      operationId: getPetById
      parameters:
      - name: petId
        in: path
        description: ID of pet to return
        required: true
        style: simple
        explode: false
        schema:
          type: integer
          format: int64
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
            application/xml:
              schema:
                $ref: '#/components/schemas/Pet'
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
      security:
      - api_key: []
      x-swagger-router-controller: Pet
    post:
      tags:
      - pet
      summary: Updates a pet in the store with form data
      operationId: updatePetWithForm
      parameters:
      - name: petId
        in: path
        description: ID of pet that needs to be updated
        required: true
        style: simple
        explode: false
        schema:
          type: integer
          format: int64
      requestBody:
        content:
          application/x-www-form-urlencoded:
            schema:
              $ref: '#/components/schemas/body'
      responses:
        "405":
          description: Invalid input
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
    delete:
      tags:
      - pet
      summary: Deletes a pet
      operationId: deletePet
      parameters:
      - name: api_key
        in: header
        required: false
        style: simple
        explode: false
        schema:
          type: string
      - name: petId
        in: path
        description: Pet id to delete
        required: true
        style: simple
        explode: false
        schema:
          type: integer
          format: int64
      responses:
        "400":
          description: Invalid ID supplied
        "404":
          description: Pet not found
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
  /pet/{petId}/uploadImage:
    post:
      tags:
      - pet
      summary: uploads an image
      operationId: uploadFile
      parameters:
      - name: petId
        in: path
        description: ID of pet to update
        required: true
        style: simple
        explode: false
        schema:
          type: integer
          format: int64
      requestBody:
        content:
          application/octet-stream:
            schema:
              type: string
              format: binary
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ApiResponse'
      security:
      - petstore_auth:
        - write:pets
        - read:pets
      x-swagger-router-controller: Pet
  /store/inventory:
    get:
      tags:
      - store
      summary: Returns pet inventories by status
      description: Returns a map of status codes to quantities
      operationId: getInventory
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                type: object
                additionalProperties:
                  type: integer
                  format: int32
                x-content-type: application/json
      security:
      - api_key: []
      x-swagger-router-controller: Store
  /store/order:
    post:
      tags:
      - store
      summary: Place an order for a pet
      operationId: placeOrder
      requestBody:
        description: order placed for purchasing the pet
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Order'
        required: true
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
            application/xml:
              schema:
                $ref: '#/components/schemas/Order'
        "400":
          description: Invalid Order
      x-swagger-router-controller: Store
  /store/order/{orderId}:
    get:
      tags:
      - store
      summary: Find purchase order by ID
      description: For valid response try integer IDs with value >= 1 and <= 10.\
        \ Other values will generated exceptions
      operationId: getOrderById
      parameters:
      - name: orderId
        in: path
        description: ID of pet that needs to be fetched
        required: true
        style: simple
        explode: false
        schema:
          maximum: 10
          minimum: 1
          type: integer
          format: int64
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Order'
            application/xml:
              schema:
                $ref: '#/components/schemas/Order'
        "400":
          description: Invalid ID supplied
        "404":
          description: Order not found
      x-swagger-router-controller: Store
    delete:
      tags:
      - store
      summary: Delete purchase order by ID
      description: For valid response try integer IDs with positive integer value.\
        \ Negative or non-integer values will generate API errors
      operationId: deleteOrder
      parameters:
      - name: orderId
        in: path
        description: ID of the order that needs to be deleted
        required: true
        style: simple
        explode: false
        schema:
          minimum: 1
          type: integer
          format: int64
      responses:
        "400":
          description: Invalid ID supplied
        "404":
          description: Order not found
      x-swagger-router-controller: Store
  /user:
    post:
      tags:
      - user
      summary: Create user
      description: This can only be done by the logged in user.
      operationId: createUser
      requestBody:
        description: Created user object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
        required: true
      responses:
        default:
          description: successful operation
      x-swagger-router-controller: User
  /user/createWithArray:
    post:
      tags:
      - user
      summary: Creates list of users with given input array
      operationId: createUsersWithArrayInput
      requestBody:
        $ref: '#/components/requestBodies/UserArray'
      responses:
        default:
          description: successful operation
      x-swagger-router-controller: User
  /user/createWithList:
    post:
      tags:
      - user
      summary: Creates list of users with given input array
      operationId: createUsersWithListInput
      requestBody:
        $ref: '#/components/requestBodies/UserArray'
      responses:
        default:
          description: successful operation
      x-swagger-router-controller: User
  /login:
    post:
      tags:
      - user
      summary: Logs user into the system
      operationId: loginUser
      parameters:
      - name: email
        in: query
        description: The email of the user
        required: true
        style: form
        explode: true
        schema:
          type: string
      - name: password
        in: query
        description: The password for login in clear text
        required: true
        style: form
        explode: true
        schema:
          type: string
      responses:
        "200":
          description: successful operation
          headers:
            X-Rate-Limit:
              description: calls per hour allowed by the user
              style: simple
              explode: false
              schema:
                type: integer
                format: int32
            X-Expires-After:
              description: date in UTC when token expires
              style: simple
              explode: false
              schema:
                type: string
                format: date-time
          content:
            application/json:
              schema:
                type: string
                x-content-type: application/json
            application/xml:
              schema:
                type: string
        "400":
          description: Invalid username/password supplied
      x-swagger-router-controller: User
  /user/logout:
    get:
      tags:
      - user
      summary: Logs out current logged in user session
      operationId: logoutUser
      responses:
        default:
          description: successful operation
      x-swagger-router-controller: User
  /user/{username}:
    get:
      tags:
      - user
      summary: Get user by user name
      operationId: getUserByName
      parameters:
      - name: username
        in: path
        description: The name that needs to be fetched. Use user1 for testing.
        required: true
        style: simple
        explode: false
        schema:
          type: string
      responses:
        "200":
          description: successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
            application/xml:
              schema:
                $ref: '#/components/schemas/User'
        "400":
          description: Invalid username supplied
        "404":
          description: User not found
      x-swagger-router-controller: User
    put:
      tags:
      - user
      summary: Updated user
      description: This can only be done by the logged in user.
      operationId: updateUser
      parameters:
      - name: username
        in: path
        description: name that need to be updated
        required: true
        style: simple
        explode: false
        schema:
          type: string
      requestBody:
        description: Updated user object
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
        required: true
      responses:
        "400":
          description: Invalid user supplied
        "404":
          description: User not found
      x-swagger-router-controller: User
    delete:
      tags:
      - user
      summary: Delete user
      description: This can only be done by the logged in user.
      operationId: deleteUser
      parameters:
      - name: username
        in: path
        description: The name that needs to be deleted
        required: true
        style: simple
        explode: false
        schema:
          type: string
      responses:
        "400":
          description: Invalid username supplied
        "404":
          description: User not found
      x-swagger-router-controller: User

components:
  schemas:

    Order:
      type: object
      properties:
        id:
          type: integer
          format: int64
        petId:
          type: integer
          format: int64
        quantity:
          type: integer
          format: int32
        shipDate:
          type: string
          format: date-time
        status:
          type: string
          description: Order Status
          enum:
          - placed
          - approved
          - delivered
        complete:
          type: boolean
          default: false
      example:
        petId: 6
        quantity: 1
        id: 0
        shipDate: 2000-01-23T04:56:07.000+00:00
        complete: false
        status: placed
      xml:
        name: Order

    Category:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      example:
        name: name
        id: 6
      xml:
        name: Category

    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
        username:
          type: string
        firstName:
          type: string
        lastName:
          type: string
        email:
          type: string
        password:
          type: string
        phone:
          type: string
        userStatus:
          type: integer
          description: User Status
          format: int32
      example:
        firstName: firstName
        lastName: lastName
        password: password
        userStatus: 6
        phone: phone
        id: 0
        email: email
        username: username
      xml:
        name: User

    Tag:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      example:
        name: name
        id: 1
      xml:
        name: Tag

    Pet:
      required:
      - name
      - photoUrls
      type: object
      properties:
        id:
          type: integer
          format: int64
        category:
          $ref: '#/components/schemas/Category'
        name:
          type: string
          example: doggie
        photoUrls:
          type: array
          xml:
            name: photoUrl
            wrapped: true
          items:
            type: string
        tags:
          type: array
          xml:
            name: tag
            wrapped: true
          items:
            $ref: '#/components/schemas/Tag'
        status:
          type: string
          description: pet status in the store
          enum:
          - available
          - pending
          - sold
      example:
        photoUrls:
        - photoUrls
        - photoUrls
        name: doggie
        id: 0
        category:
          name: name
          id: 6
        tags:
        - name: name
          id: 1
        - name: name
          id: 1
        status: available
      xml:
        name: Pet

    ApiResponse:
      type: object
      properties:
        code:
          type: integer
          format: int32
        type:
          type: string
        message:
          type: string
      example:
        code: 0
        type: type
        message: message
    body:
      type: object
      properties:
        name:
          type: string
          description: Updated name of the pet
        status:
          type: string
          description: Updated status of the pet
  requestBodies:
    Pet:
      description: Pet object that needs to be added to the store
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Pet'
        application/xml:
          schema:
            $ref: '#/components/schemas/Pet'
      required: true
    UserArray:
      description: List of user object
      content:
        application/json:
          schema:
            type: array
            items:
              $ref: '#/components/schemas/User'
      required: true
      
  securitySchemes:
    petstore_auth:
      type: oauth2
      flows:
        implicit:
          authorizationUrl: http://petstore.swagger.io/oauth/dialog
          scopes:
            write:pets: modify pets in your account
            read:pets: read your pets
    api_key:
      type: apiKey
      name: api_key
      in: header
