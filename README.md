# project Pensieve *Dev*
__自由的思考、無限制得探索__
> _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

LTS : __3.0.0__ on 06/09/2019. Current version, redesign the Unit interface & est. Relation view with independent Unit route.

ver : __2.1.0__ on 07/08/2019. rearrange Explore and Unit reading experience, also begin basic customized recommand.

ver : __2.0.0__ on 05/07/2019. the version focus on Nodes sys & User journey update.

ver __1.3.0__ : the version mainly on Explore structure expanding and improvement.

ver __1.2.0__ : the version modified mainly on Noun page and Notifications sys.

ver __1.1.0__ : the version release after modifications base on fast reward from last ver.

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

>please place it at a folder you have auth to write and edit


```bash
#only at the first time, Establishing basic folders needed:
npm run setup
#or if on Windows:
npm run setupWin
Rename-Item -Path .\\config\\.env.example.json -NewName .env.json
```

```bash
npm install
```

> /bcrypt: check [doc](https://www.npmjs.com/package/bcrypt) if face error come from this module, uninstall and install again if needed


`/config/.env.json` : modify necessary info now
  - database connection:
    *modify beneath item to fit your database*
    1. "host"<br>
    2. "user" *with all privilege*<br>
    3. "password"<br>


  - jwt secret
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

```
NODE_ENV="development" npm run build
```

final, start the server

```
NODE_ENV="development" npm start
```


please, only using account below:
```
usertest@mail.com
helloworld
```
otherwise, you have to add account to database manually.

Have a nice trip.

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
4. set 'export NODE_ENV=produtction'
5. db: migrate if needed
6. run build.
7. run start.
