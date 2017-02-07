Ticket Sales Distributed System
===============================

This a distributed system that will allow to buy tickets for travel from different point of sales to different 
airlines servers.

Required tools
============
* [Node] - Install Node.js
* [Npm] - Install the Node Package Manage

[Node]: https://nodejs.org
[Npm]: https://www.npmjs.com/

Installation
============
- Install the required packages:
	```
	cd pointofsale 
	npm install 
	```

	``` 
	cd enterprise 
	npm install 
	```

Running Point of Sales
=====================
- Go to the pointofsale directory:
	```
	cd pointofsale 
	```
	
- Run any of the point of sales applications:
	``` 
	node pointofsaleARG.js 
	node pointofsaleBRA.js
	```
	
Running the Enterprise Servers:
==============================
- Go to the enterprise directory:
	```
	cd enterprise 
	```
	
- Run any of the servers:
	``` 
	node serverARGAirline.js 
	node serverBRAARGAirline.js
	node serverUSAAirline.js
	```
