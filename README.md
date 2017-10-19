Bojagi
======

Bojagi is a game of visual reasoning and basic mathematics. Young students can use the game to practice their multiplication facts, and they can create their own levels to challenge their friends. Older students and adults can exercise their creativity by creating fiendishly difficult puzzles.

A bojagi is a Korean traditional wrapping cloth. They were often made by sewing pieces together like a patchwork quilt. I picked this name because the completed designs sometimes resemble a patchwork.

Bojagi is very similar to the game Rectangles by Simon Tatham, but it
was developed independently.

This game has been used in elementary schools, and students have created
nearly 6000 levels. The website is currently offline, but it will be back soon.

Bojagi was the subject of a column by Kevin Knudson on
[Forbes.com](https://www.forbes.com/sites/kevinknudson/2015/08/02/a-simple-multiplication-game).

## Installation

This application requires Node.js, npm, and Mongo DB.
By default, the application connects to the database without a password.
In a production environment, you can set the environment variable
``MONGODB_DB_URL`` to specify a connection string, which can include
a password.

Once the required software has been installed, enter the following
commands in the project root directory:

    $ npm install
    $ npm start

Open your web browser and enter ``localhost:5000`` in the address bar.

## Docker installation

You can also install Bojagi using Docker. The commands are as follows:

    $ docker build -t bojagi-app .
    $ docker run -p 5000:5000 -d bojagi-app

## Database setup

The application requires a Mongo database named 'bojagi'. You can load
5852 user-created levels into the database as follows:

    $ gunzip dump.js.gz
    $ mongo bojagi dump.js

If you do not wish to load the user-created levels, then you must initialize
the 'counter' collection, which keeps track of the last assigned id number
for the levels. Enter the following commands:

    $ mongo bojagi
    > db.counters.insert({_id: "levels", seq: 0})
    > quit()

## Contribute to this project

I need your help to make this project better. Contact me if you
would like to contribute. Newbies are welcome!

    David Radcliffe
    dradcliffe@gmail.com
