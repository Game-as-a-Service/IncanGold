// Artifact Card
export const artifactName:Record<string,string> = { A1:'杯子',A2:'雞蛋糕模具',A3:'金輪',A4:'派大星',A5:'黑暗大法師'};

export const artifactCards = [
{"ID":"A1", "name":artifactName['A1'], "points":5 },
{"ID":"A2", "name":artifactName['A2'], "points":7 },
{"ID":"A3", "name":artifactName['A3'], "points":8 },
{"ID":"A4", "name":artifactName['A4'], "points":10},
{"ID":"A5", "name":artifactName['A5'], "points":12},
]

// todo : 之後重構要拿掉，測試資料夾內補個testHelper.ts 裡面要有generateCardByID(id)
export const artifactPoints:Record<number,number> = { 1:5,2:7,3:8,4:10,5:12 };

export const treasureCards = [
{"ID":"T1"    , "points":1 },
{"ID":"T2"    , "points":2 },
{"ID":"T3"    , "points":3 },
{"ID":"T4"    , "points":4 },
{"ID":"T5(1)" , "points":5 },
{"ID":"T5(2)" , "points":5 },
{"ID":"T7(1)" , "points":7 },
{"ID":"T7(2)" , "points":7 },
{"ID":"T9"    , "points":9 },
{"ID":"T11(1)", "points":11},
{"ID":"T11(2)", "points":11},
{"ID":"T13"   , "points":13},
{"ID":"T14"   , "points":14},
{"ID":"T15"   , "points":15},
{"ID":"T17"   , "points":17},
]

// Hazard Card
export const hazardNames = ["fire","rocks","mummy","python","spiders"];

export const hazardCards = [
{"ID":"HF1", "name":"fire"   },
{"ID":"HF2", "name":"fire"   },
{"ID":"HF3", "name":"fire"   },
{"ID":"HR1", "name":"rocks"  },
{"ID":"HR2", "name":"rocks"  },
{"ID":"HR3", "name":"rocks"  },
{"ID":"HM1", "name":"mummy"  },
{"ID":"HM2", "name":"mummy"  },
{"ID":"HM3", "name":"mummy"  },
{"ID":"HP1", "name":"python" },
{"ID":"HP2", "name":"python" },
{"ID":"HP3", "name":"python" },
{"ID":"HS1", "name":"spiders"},
{"ID":"HS2", "name":"spiders"},
{"ID":"HS3", "name":"spiders"},
]