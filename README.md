# Bamazon

Bamazon is a Node.js CLI web store that provides views for shoppers, managers, and admins. It uses MySQL to store data. 

## How it works

Shoppers can run `node bamazonCustomer.js` to see the full inventory. They can then select an item and enter the desired quantity. If there is sufficient quantity, the inventory will be decremented accordingly and the shopper will be notified of their order total. If there is insufficient quantity, the shopper will be notified and returned to the inventory to list. 

![GitHub Logo](/README_media/customer.gif)