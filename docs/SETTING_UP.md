# Setting up

## Set up database

### Install MySQL

Make sure that you have installed MySQL.

Here is [a guide](https://www.digitalocean.com/community/tutorials/how-to-install-mysql-on-ubuntu-18-04) to install MySQL on Ubuntu 18.04.

On Linux, verify by running the following command:

```
$ mysql --version

mysql  Ver 8.0.22-0ubuntu0.20.04.3 for Linux on x86_64 ((Ubuntu))
```

After that, you can open MySQL console:

```
$ sudo mysql

Welcome to the MySQL monitor.

mysql>
```

### Create an user and a database

The following commands create user `fc5y_user` with password `fc5y_password`, create database `fc5y_db`, and grant all privileges on the database to the user. Feel free to choose other values if needed.

```
mysql> CREATE USER 'fc5y_user'@'localhost' IDENTIFIED BY 'fc5y_password';
mysql> CREATE DATABASE fc5y_db;
mysql> GRANT ALL PRIVILEGES ON fc5y_db.* TO 'fc5y_user'@'localhost';
```

Verify by running the following command:

```
$ mysql --host=localhost --user=fc5y_user --password=fc5y_password fc5y_db
mysql> SHOW TABLES;

Empty set (0.00 sec)
```

## Create an .env file

Copy `.env.example` to `.env` and fill in the details from the previous step:

```
DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=fc5y_user
DB_PASSWORD=fc5y_password
DB_NAME=fc5y_db
```

`JWT_SECRET` should be set to a random string. For example:

```
JWT_SECRET=e15db06f-4c1a-49f9-9da2-b0b796f835d3
```

## Install dependencies

Make sure that you have install `npm` and `node`. Verify by running the following commands:

```
$ npm --version

6.14.4

$ node --version

v12.16.3
```

Install dependencies by running the following command:

```
$ npm install
```
