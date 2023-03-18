
# AeroDeliver

###  The Fast and Convenient Drone Delivery

AeroDeliver is a revolutionary new delivery service that utilizes drone technology to provide fast and convenient delivery services. With AeroDeliver, users can easily schedule and track deliveries right from their smartphone.

## Technology
- React 
- Firebase Realtime Database
- Material UI
- Google Map API

## Architecture

### Use case diagram
![class_diagram](https://user-images.githubusercontent.com/56500864/226110677-fa376e6f-99a8-432a-be66-0c3f46980064.jpg)

There are two different roles for users : Admin and customer. The responsibilities of admin is to handle all the requests raised by the customer, accept them, track all the deliveries, manage drones etc. The customer can raise a new order request by selecting locations from map. 
### Real time tracking Architecture
![Architecture](https://user-images.githubusercontent.com/56500864/226110684-955ec543-3ce7-4392-8559-e2596149a00d.jpg)

The tracking starts when admin accepts a request and the drone starts the delivery from pickup location. The drone location is constantly updated into the database which sends a snapshot to the concenred customer and admin. In this way whenever the position of drone is changed it gets updated into both the users. In this way the users can track the delivery and admin can track all the active deliveries.

### Admin 
#### Dashboard
The admin dashboard contains all the requests history. The requests are categorized into 3 types : Active, Pending, Finished. The active deliveries are the one's which are ongoing and the tracking is shown on the master map. The pending requests are the one's waiting to be accepted.
<img width="947" alt="image" src="https://user-images.githubusercontent.com/56500864/226111014-8f7667b2-b96b-4d64-a7d5-cbe328865d1d.png">

Admin can create new drones and view the status of all the present drones.
<img width="960" alt="image" src="https://user-images.githubusercontent.com/56500864/226111102-9a828232-852a-4338-be3e-72702164cf14.png">

### Customer
#### New Order
Users can create a new order request by selecting source and destination locations and other custom details.
<img width="960" alt="image" src="https://user-images.githubusercontent.com/56500864/226111272-721c8ace-f77f-4381-ab9a-366565d1ba30.png">

#### Home
Home contains all the data and analytics like total orders, and analysis by week and day (dummy data).
<img width="960" alt="image" src="https://user-images.githubusercontent.com/56500864/226111144-0277a862-7b25-4b89-9996-935e34e3afb0.png">

#### Order History
Users can view all the order history and can view the status of the orders. Whenever admin accepts a order it gets automatically updated in the user side by changing the status to active without any refresh.
<img width="960" alt="image" src="https://user-images.githubusercontent.com/56500864/226111341-6ad024ae-59cd-4c9c-8aaa-5d7bc4757ff9.png">

#### Track order
Users can track order and see the drone location if the order is active. Once the drone reaches destination the delivery is complete and the status of order is changed to finished and the drone becomes free to take up the next order.
<img width="959" alt="image" src="https://user-images.githubusercontent.com/56500864/226111418-4c0d5ae3-b5bf-4038-a6a6-8c5f62705fd1.png">

### Collaborators
1. P. KARTIKEYA
2. SANDAPARTHY SAI LAXMANA KARTHIK
3. NAGAMANTRY PAVAN KUMAR
4. VIVEK GUDE






