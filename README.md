# sambudgettracker
# SplitQuest - Budget Tracking Dashboard

SplitQuest is a simple and interactive personal budget tracking dashboard built using HTML, CSS, and JavaScript.

It helps users track money spent with friends, record repayments, and automatically calculate the remaining balance for each friend.

## Features

* Add multiple friends
* Assign avatars to friends
* Select transaction dates
* Record money spent for a friend
* Record money received from a friend
* Automatically calculate outstanding balances
* Track multiple transactions with the same friend
* Show whether:

  * A friend owes you money
  * You owe a friend money
  * Everything is settled
* View recent transactions
* View complete transaction history
* Filter transactions by friend
* Filter transactions by transaction type
* Delete transactions
* Delete friends
* Personal profile with customizable avatar
* Dashboard statistics
* Wallet level and XP system
* Data persistence using browser localStorage
* Responsive design for desktop and mobile screens

## Example

Suppose you add a friend named Rahul.

You record:

### Transaction 1

Date: 23 September 2026
Type: I Spent
Amount: Rs. 100

Rahul's balance becomes:

**Rs. 100 - Rahul owes you**

### Transaction 2

Date: 23 September 2026
Type: I Received
Amount: Rs. 50

The balance becomes:

**Rs. 50 - Rahul owes you**

### Transaction 3

Date: 23 September 2026
Type: I Received
Amount: Rs. 50

The balance becomes:

**Rs. 0 - Settled**

The application calculates this automatically from the transaction history.

## Project Structure

```text
SplitQuest/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## Technologies Used

### HTML

Used to create the structure of the dashboard, forms, modals, navigation, cards, and transaction sections.

### CSS

Used for:

* Dashboard layout
* Dark theme
* Responsive design
* Cards and panels
* Animations and hover effects
* Friend cards
* Transaction displays
* Modal windows
* Profile section

### JavaScript

Used for:

* Adding and deleting friends
* Adding and deleting transactions
* Calculating balances
* Filtering transactions
* Updating dashboard statistics
* Managing the profile
* Managing avatars
* Updating the level and XP
* Storing data in localStorage

## Running the Project

No backend or database is required.

Simply keep all three project files in the same folder and open:

```text
index.html
```

in a web browser.

Alternatively, the project can be run using VS Code Live Server.

## Data Storage

SplitQuest uses the browser's `localStorage` to store data.

The following information is stored locally:

* Friend information
* Transaction information
* Profile information
* Avatar selection

This means the data remains available after refreshing or reopening the browser on the same device and browser.

## Balance Calculation

The application uses the following logic:

```text
Money spent for friend = Friend owes you

Money received from friend = Reduces friend's balance

Final Balance =
Total Money Spent - Total Money Received
```

For example:

```text
Spent:       Rs. 500
Received:    Rs. 300
---------------------
Balance:     Rs. 200
```

Therefore, the friend still owes you Rs. 200.

If the received amount becomes greater than the amount spent:

```text
Spent:       Rs. 500
Received:    Rs. 600
---------------------
Balance:    -Rs. 100
```

The application then shows that you owe the friend Rs. 100.

## Dashboard

The dashboard provides an overview of:

* Total amount friends owe you
* Total amount you owe friends
* Total recorded spending
* Number of friends
* Friend balances
* Recent transactions
* Wallet level and XP

## Friend Management

Users can create a friend profile by entering:

* Friend name
* Friend avatar

Each friend receives an individual balance based on their transaction history.

Deleting a friend also removes the transactions associated with that friend.

## Transaction Management

Each transaction contains:

* Friend
* Amount
* Transaction type
* Date
* Optional note

Transaction types are:

```text
I Spent
I Received
```

Users can add as many transactions as required.

## Profile

The profile section allows users to:

* Set their name
* Select an avatar
* Save their profile

The selected avatar is displayed throughout the dashboard.

## Responsive Design

The interface is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile

The sidebar and dashboard layout automatically adjust for smaller screens.

## Future Improvements

Possible future additions include:

* Monthly spending analytics
* Expense categories
* Budget limits
* Charts and graphs
* Search functionality
* Export transactions to CSV
* PDF reports
* Recurring expenses
* Group expense splitting
* Settlement history
* Cloud database
* User authentication
* Multi-device synchronization

## License

This project is created for educational and personal use.
