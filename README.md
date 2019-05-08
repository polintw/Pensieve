# project Pensieve *Dev*
__自由的思考、無限制得探索__

> _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

LTS :  __1.0__ on 2019/04/27

ver __"1.0"__ : the version officially opening to public usage, with only basic but complete experience.

ver __"Lite 2.1"__ : the version released after backend refactor, and opening for register.

ver __"Lite 2.0"__ : the version released to the public of this project.


## Initiation
Only at branch other than master.

Doc of [React for production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)

#### Env
- node 10.15.1
- npm  6.4.1
- MySQL 14.14 Distrib 5.7.25

#### Install

Establishing node modules and basic folders __at the first time__:
>please place it at a folder you have auth to write and edit

```
npm run install
```

or if on Windows:
```
npm run installWin
Rename-Item -Path .\\config\\.env.example.json -NewName .env.json
```

> /bcrypt: check [doc](https://www.npmjs.com/package/bcrypt) if face error come from this module, uninstall and install again if needed


`/config/.env.json` : modify neccessory info now
  - databse connection:

    modify beneath item to fit your database

    "host"<br>
    "user" *with all privilege*<br>
    "password"<br>

  - jwt secret:

    use default one or import yours

  - on Windows

    log file path to absolute path if needed

Then using ORM migrate database :

```
npm run migrate
```


#### Start

build app by browserify

```
NODE_ENV="development"
npm run build
```

final, start the server

```
NODE_ENV="development"
npm run start
```


please, only using account below:
```
usertest@mail.com
helloworld
```
otherwise, you have to add account to dabase manully.

Have a nice trip.

## Developing

#### Branches
- master: the current Lite version(stable) running on the server
- develope: the main trunk of the whole project(ahead to master quite long)
- release: a 'temp' branch emerge when we need to 'cut' and 'deploy' a new version. Merge to the master in the end, not to the develope.
- [feature]: a 'temp' branch emerge during development. Merge to the develope in the end, not to the master.




## Release

#### Steps
1. Cut and modify.
2. merge to release with "strategy=ours"
3. Upload seeds if any:
  - from Windows:

    Set-SCPFile -ComputerName /domainname -Credential $cred(username) -KeyFile .\.ssh\id_rsa -Port (port) -RemotePath '(path to dir)' -LocalFile '(path to local file)'
4. db: migrate if needed, set env=production
5. db: seed if needed
6. run build as production.
7. run start as production.

#### Difference Records
- app/               modified f()"refer"
- app/Self/Shared    delete thread
- app/Terrace        delete appearance f()"params"
- app/Component/Edit delete "ref"、credits
