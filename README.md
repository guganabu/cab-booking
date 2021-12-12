# Cab Booking Module

###### An experimental project of cab booking using node and sqlite

---

## Requirements

For development, you will only need Node.js and a node package manager.

-   #### Node & NPM installation on Linux

        $ sudo apt install nodejs
        $ sudo apt install npm

-   #### Node & NPM installation on Mac

        $ brew install node
        $ brew install npm

After successful instalation of node & npm, you can be able to exectue following commands

      $ node --version
        v14.17.0
      $ npm --version
        6.14.13

---

## Installation

Follow the steps below to configure app in your local system

      $ git@github.com:guganabu/cab-booking.git
      $ cd cab-booking
      $ npm install

After running above statements, the app should be able to run

## Run App

      $ npm run dev

After the server started successfully, you can see a message in the terminal with server host & port `Server started & running at at http://localhost:3000`

## Run Test

      $ npm run test

Unit test cases are written in `jest`. Running above command will execute all the test cases in verbose mode.

---

## Modules

1. ### Cab

    - #### Request Cab

    ```
    GET /api/cabs/request
    request payload {
      start_latitude: number,
      start_longitude: number,
      color_preference: string
    }

    response payload
    `success`
    {
        ride_id: number,
        cab_id: number,
        model:  string,
        range: number,
        color: string,
    }

    `error`
    `404` {
      message: 'Cab not available in range'
    }

    `500` {
      message: Error
    }
    ```

    1. API will request for all the cabs which is available in 10 KM `(/src/constants/index.CAB_SERVICE_RANGE_IN_KM)` of range with given color preference.
    2. All the available cabs will be sorted by range key (distance between start latitude,longitude to cab latitude,longitude) and first item from the sorted list will be send back to client (first item will be nearest cab)
    3. If there is no cab available within the given range, then API will return `404` error with a message of `Cab not available in range`.
    4. The nearest cab will be assigned to a ride without starting it so that the cab will not be available for future requests.

    - #### List Available Cabs

    ```
    GET /api/cabs/list
    request payload {

    }

    response payload
    `success`
    {
        cabs: array
    }

    `error`
    `404` {
      message: 'Cabs not available'
    }

    `500` {
      message: Error
    }
    ```

    1. This API will be used to list all the available cabs. A view engine (`hbs`) used to render the UI and show all the cabs in the browser.
    2. If there is no cab available, then API will return `404` with a message `Cabs not available`.

2. ### Ride

    - #### Start Ride

    ```
    PATCH /api/rides/start/:rideID
    request payload {
      passenger: string
    }

    response payload
    `success`
    {
        start_time: datetime
    }

    `500` {
      message: Error
    }
    ```

    1. Ride can be started, once the passenger onboarded into the cab and started time will be updated for respective ride.

    - #### Complete Ride

    ```
    PATCH /api/rides/complete/:rideID
    request payload {
      latitude: number,
      longitude: number
    }

    response payload
    `success`
    {
        total_cost: string
    }

    `500` {
      message: Error
    }
    ```

    1. Ride can be completed/finished by calling this api. This API will require ride id ans URI param and latitude, longitude of end location.
    2. The total fare will be calculated based on `(TravelTimeInMin * /src/constants/index.CAB_FARE.PER_MIN) + (TravelDistanceInKM * /src/constants/index.CAB_FARE.PER_KM)`.
    3. An additional cost of `/src/constants/index.CAB_FARE.COLOR_PREFERENCE` will be added with total cost, if the passenger have choosen any of the `/src/constants/index.CAB_HIPSTER_COLORS`.
    4. Finally, the cab will be open for any new rides and the cab's current location will be same as the last ride's end location.
