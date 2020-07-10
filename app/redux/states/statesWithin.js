export const initWithin = {
  belongsByType: {
    fetched: false,
    fetchedSeries: false,
    setTypesList: [], // [? 'homeland', ? 'residence']
    "homeland": null,
    /*"homelandup": {nodeId, listToTop, topParentId}*/
    /*
    and here is a trick: '...up' obj only true after parent list res,
    could be used as a 'checkpoint' to distinguish if the parent list has res*/
  },
}

export const initCosmic = {
  focusLists: {
    listFocus:[],
    listNew: [],
    broads: []
  },
}

export const initAround = {
  flagChainFetRespond: false,
  chainList: {
    listOrderedChain: [],
    listInfo: {}
  },
  indexLists: {
    listUnread: [],
    listBrowsed: [],
    scrolled: true
  },
  sharedsList: {
    list: []
  }
}
