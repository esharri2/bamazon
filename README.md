# Bamazon

Bamazon is a Node.js CLI web store that provides views for shoppers, managers, and admins. It uses MySQL to store data. 

## How it works

### Shopper view

Shoppers can run `node bamazonCustomer.js` to see the full inventory. They can then select an item and enter the desired quantity. If there is sufficient quantity, the inventory will be decremented accordingly and the shopper will be notified of their order total. If there is insufficient quantity, the shopper will be notified and returned to the inventory to list. 

![Customer view](/README_media/customer.gif)

### Manager view

Managers can run `node bamazonManager.js` to see a list of manager options. Managers can see full invenotry, see a list of items with a quantity lower than five, update the quantity of an item, and add new items.

![Manager view](/README_media/manager.gif)
