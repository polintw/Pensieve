# CORNER (project Pensieve): Dev
__自由的思考、無限制得知道__

> _no Limitation by Any force_

this is a web application project initiated & own by Chou Po Lin since May. 2018, modified and rewrote from an earlier version, dev_Corner, which was also owned by the same owner since Dec. 2017.

- master: the current Lite version(stable) running on the server
- develope: the main trunk of the whole project(ahead to master quite long)
- release: a 'temp' branch emerge when we need to 'cut' and 'deploy' a new version. Merge to the master in the end, not to the develope.
- [feature]: a 'temp' branch emerge during development. Merge to the develope in the end, not to the master.

## Initiation: Lite

version "Lite" is the version released to the public of this project.


#### Prepare
config:
- production img serve
- production databse connection
- production jwt secret
- production log path
- production services require
env:
- node 10.15.1
- npm  6.4.1
- /bcrypt: check doc, uninstall and install again if needed


#### Production
- [React for production](https://reactjs.org/docs/optimizing-performance.html#use-the-production-build)環境建議標準

#### Modified Records
- src/units/vanilla.js 刪除"inspired"相關

- app/               modified f()"refer"
- app/               delete svgPropic

- app/Login/Signin   delete register
- app/Self/Profile   change Link to "/shareds"
- app/Self/Cognition delete embeded、mutuals、collateral
- app/Self/Shared    delete thread
- app/Terrace        change Link to "/shareds"
- app/Terrace        delete appearance f()"params"
- app/Terrace/Screen delete options infor
- app/Component/Unit delete action"統計"、action user"追蹤""推廣"
- app/Component/Unit delete control button"related" button"middle"
- app/Component/Mark delete interaction Panel
- app/Component/Edit delete "ref"、credits

- app/Within/Ltd     delete any "background" (except Nav)
