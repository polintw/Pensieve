# project Pensieve *Dev*
__自由的思考、無限制得探索__
> _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

### series
__LTS__ on 2021/02/02, ver __Theme__


## Initiation
Only at branch other than master.

Ref doc: [React for production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)

#### Env
>please place it at a folder you have auth to write and edit

- node 12.x.x
- npm  6.14.6
- MySQL 14.14 Distrib 5.7.31


#### Install



Only at the first time: establishing basic folders needed

```bash
npm run setup
#or if on Windows:
npm run setupWin
```

```bash
npm install
npm install --dev
```

> /bcrypt: check [doc](https://www.npmjs.com/package/bcrypt) if face error come from this module, uninstall and install again if needed


`/config/.env.json`

modify necessary info:
  - database connection:
    *modify beneath item to fit your database*
    1. "host"<br>
    2. "user" *with all privilege*<br>
    3. "password"<br>


  - rootPath: *path to your project(absolute path was better)*

  - jwt secret:
      *use default one or import yours*

  - others:
    *token to your services & path fit your choice*

    >on Windows: log file path to absolute path if needed.

Then using ORM migrate database :

```
npm run migrate
```


#### Start

build app by browserify

```bash
NODE_ENV="development" npm run build
```

build server(dev) by webpack
```bash
NODE_ENV="development" npm run build:dev-server
```


final, start the server

```bash
NODE_ENV="development" npm run start
```


there ia a default account as below:
```
usertest@mail.com
helloworld
```
or add account you prefer to database manually.

Welcome to the project. Give any feedback in community.

## Developing

#### Branches
- master: the current Lite version(stable) running on the server
- develop: the main trunk of the whole project(ahead to master quite long)
- release: a 'temp' branch emerge when we need to 'cut' and 'deploy' a new version. Merge to the master in the end, not to the develope.
- [feature]: a 'temp' branch emerge during development. Merge to the develope in the end, not to the master.




## Release

#### Steps
1. merge branch release to master directly.
2. Cut and modify for conflict.
3. Upload seeds if any:
  - from Windows:

    Set-SCPFile -ComputerName '(domainName in string)'  -Credential $ (username as declaim var) -KeyFile .ssh\id_rsa -Port (port used) -RemotePath '(path to save at remote in string)' -LocalFile '(file path at local in string)'

  - db: seed
4. set 'export NODE_ENV=production'
5. db: migrate if needed
6. run build.
7. run build:server.
7. run start.
