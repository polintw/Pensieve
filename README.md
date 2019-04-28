# project Pensieve *Dev*
__自由的思考、無限制得探索__

> _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

LTS :  __1.0__ on 2019/04/27

ver __"1.0"__ : the version officially opening to public usage, with only basic but complete experience.

ver __"Lite 2.1"__ : the version released after backend refactor, and opening for register.

ver __"Lite 2.0"__ : the version released to the public of this project.

- master: the current Lite version(stable) running on the server
- develope: the main trunk of the whole project(ahead to master quite long)
- release: a 'temp' branch emerge when we need to 'cut' and 'deploy' a new version. Merge to the master in the end, not to the develope.
- [feature]: a 'temp' branch emerge during development. Merge to the develope in the end, not to the master.


## Initiation:
Doc of [React for production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)

#### Env
- node 10.15.1
- npm  6.4.1
    - /bcrypt: check doc, uninstall and install again if needed
- MySQL 14.14 Distrib 5.7.25

#### Install

Establishing node modules and basic folders first

`npm run install`

if on windows:
`npm run installWin`

- config: modify neccessory info now:
  - databse connection info: needed privilege to Create and Delete tables.
  - jwt secret: use default one or import yours
  - log file path to absolute path if needed (i.e on Windows)

Than using ORM migrate database at first installation

`npm run migrate`


#### Start

bundle app by browserify

`npm run build`

final, start the server

`npm run start`


using usertest@mail.com/helloworld to log in

## Release

#### Steps
1. db: migrate if needed, set env=production
2. db: seed if needed
3. bundle as production. if fail, bundle from master else where directly
4. start as production.

#### Difference Records
- app/               modified f()"refer"
- app/Self/Shared    delete thread
- app/Terrace        delete appearance f()"params"
- app/Component/Edit delete "ref"、credits
