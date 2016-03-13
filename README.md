# OpenLoops

# Tests

OpenLoops is set-up to work with the test functionality in Meteor 1.3 but
right now - as of 1.3-beta-16 - it's not up to scratch so I'm just mocking
stub tests for now.  I will come back and focus on the tests as soon as 1.3
is out.  

For now I have some notes on Meteor testing below.

It looks as though 1.3 will allow OLS to run in a special test mode with its
own dedicated database so I can just create and remove collections at will
for each test and not worry about it affecting the real app.  This is cool :-)

I'm not really sure what the factory stuff is for then?  It says
(here)[https://github.com/meteor/guide/blob/testing-modules-content/content/testing.md]
that Factory is used to make it easier to get random test data.  I'll have to
take a closer look at this when I do it properly.

 

# Tasks

[ ] Decide on a name (even if it's just a codename for the repo) - maybe just OLS?
[ ]  
