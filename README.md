# brickflow-api

Get parameter accessToken is required.

- GET ``/feed/trending``
- GET ``/feed//your``
- GET ``/feed/search/:tag``
- GET ``/feed/blog``
- POST ``/blog/:tumblrUsername/share/:brickId`` with post data ``tag``, 
``type`` and ``brickID``
- POST ``/user/follow/:blogName``
- POST ``/user/update`` updates a user with the posted 
(and whitelisted) fields.
- POST ``/user/login`` updates or create a user 

## ``src`` directory layout

- ``src/init``
- ``src/actions`` is where to put stuff to yield for in ``src/index.js``
- ``src/middleware`` is for middlewares
- ``src/controller``
- ``src/model``
- ``src/service``
- ``src/scoreRules``
