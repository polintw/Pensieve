# project Pensieve
__自由的思考、無限制得探索__

 _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

- master: the current Lite version(stable) running on the server
- develope: the main trunk of the whole project(ahead to master quite long)
- others: 'temp' branch emerge when developing.

version __"1.0"__ : the version officially opening to public usage, with only basic but complete experience.

version __"Lite 2.1"__ : the version released after backend refactor, and opening for register.

version __"Lite 2.0"__ : the version released to the public of this project.

#### Prepare
env:
- node 10.15.1
- npm  6.4.1
- /bcrypt: check doc, uninstall and install again if needed

.env.json:
- production img serve
- production databse connection
- production jwt secret
- production log path
- production services require

database
- sequelize set --env production


## Initiation:
1. bundle as production. if fail, bundle from master else where directly
2. start as production.

#### Production
- [React for production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)環境建議標準
