// Brass: Birmingham 地图数据

const MAP_DATA = {
    cities: {
        "Birmingham": { x: 480, y: 380, resources: ["coal", "iron"], name: "Birmingham" },
        "Manchester": { x: 420, y: 200, resources: ["coal"], name: "Manchester" },
        "Liverpool": { x: 340, y: 150, resources: ["coal"], name: "Liverpool" },
        "Leeds": { x: 480, y: 120, resources: ["coal", "iron"], name: "Leeds" },
        "Sheffield": { x: 550, y: 180, resources: ["coal"], name: "Sheffield" },
        "Nottingham": { x: 580, y: 300, resources: [], name: "Nottingham" },
        "Derby": { x: 520, y: 320, resources: ["coal"], name: "Derby" },
        "Leicester": { x: 620, y: 340, resources: [], name: "Leicester" },
        "Coventry": { x: 520, y: 420, resources: [], name: "Coventry" },
        "Wolverhampton": { x: 440, y: 440, resources: ["coal"], name: "Wolverhampton" },
        "Worcester": { x: 500, y: 480, resources: [], name: "Worcester" },
        "Oxford": { x: 580, y: 480, resources: [], name: "Oxford" },
        "Northampton": { x: 600, y: 400, resources: [], name: "Northampton" },
        "Cambridge": { x: 720, y: 420, resources: [], name: "Cambridge" },
        "London": { x: 750, y: 500, resources: [], name: "London" },
        "Bristol": { x: 400, y: 560, resources: ["coal"], name: "Bristol" },
        "Bath": { x: 450, y: 580, resources: [], name: "Bath" },
        "Southampton": { x: 600, y: 600, resources: [], name: "Southampton" },
        "Portsmouth": { x: 700, y: 580, resources: [], name: "Portsmouth" },
        "Swansea": { x: 250, y: 580, resources: ["coal"], name: "Swansea" },
        "Cardiff": { x: 320, y: 550, resources: ["coal"], name: "Cardiff" },
        "Newcastle": { x: 480, y: 60, resources: ["coal"], name: "Newcastle" },
        "Sunderland": { x: 520, y: 50, resources: [], name: "Sunderland" },
        "Hull": { x: 600, y: 100, resources: ["coal"], name: "Hull" },
        "York": { x: 500, y: 100, resources: ["coal"], name: "York" },
        "Lancaster": { x: 380, y: 100, resources: [], name: "Lancaster" }
    },
    
    canalLinks: [
        ["Birmingham", "Wolverhampton"], ["Birmingham", "Coventry"], ["Birmingham", "Worcester"],
        ["Birmingham", "Derby"], ["Manchester", "Lancaster"], ["Manchester", "Liverpool"],
        ["Manchester", "Leeds"], ["Manchester", "Sheffield"], ["Leeds", "York"],
        ["Leeds", "Newcastle"], ["Leeds", "Sheffield"], ["Sheffield", "Derby"],
        ["Sheffield", "Nottingham"], ["Sheffield", "Hull"], ["Liverpool", "Lancaster"],
        ["Bristol", "Bath"], ["Bristol", "Wolverhampton"], ["Bristol", "Swansea"],
        ["Bristol", "Cardiff"], ["Swansea", "Cardiff"], ["Oxford", "Northampton"],
        ["Oxford", "Cambridge"], ["Oxford", "London"], ["Northampton", "Cambridge"],
        ["Southampton", "Portsmouth"], ["Portsmouth", "London"]
    ],
    
    railLinks: [
        ["Birmingham", "Manchester"], ["Birmingham", "Leeds"], ["Birmingham", "London"],
        ["Birmingham", "Bristol"], ["Manchester", "Leeds"], ["Manchester", "Newcastle"],
        ["Manchester", "Liverpool"], ["Leeds", "Hull"], ["Leeds", "Newcastle"],
        ["Sheffield", "Hull"], ["Sheffield", "Leeds"], ["Liverpool", "Newcastle"],
        ["London", "Cambridge"], ["London", "Northampton"], ["London", "Oxford"],
        ["London", "Southampton"], ["London", "Portsmouth"], ["Bristol", "Cardiff"],
        ["Bristol", "Swansea"], ["Newcastle", "Sunderland"], ["Newcastle", "York"],
        ["York", "Hull"]
    ],
    
    industryTypes: {
        "coal": { name: "煤矿", cost: { coal: 1 }, income: 2, points: 3, maxLevel: 3 },
        "iron": { name: "铁厂", cost: { coal: 1, iron: 1 }, income: 3, points: 4, maxLevel: 2 },
        "cotton": { name: "纺织厂", cost: { coal: 1 }, income: 3, points: 4, maxLevel: 2 },
        "textile": { name: "毛纺厂", cost: { coal: 1, iron: 1 }, income: 4, points: 5, maxLevel: 2 },
        "pottery": { name: "陶器厂", cost: { coal: 1, iron: 1 }, income: 2, points: 3, maxLevel: 4 },
        "manufacturing": { name: "制造厂", cost: { coal: 2, iron: 2 }, income: 5, points: 6, maxLevel: 1 },
        "beer": { name: "啤酒厂", cost: { coal: 1, iron: 1 }, income: 3, points: 4, maxLevel: 2 }
    }
};

const CITY_CARDS = [
    "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield",
    "Nottingham", "Derby", "Leicester", "Coventry", "Wolverhampton",
    "Worcester", "Oxford", "Northampton", "Cambridge", "London",
    "Bristol", "Bath", "Southampton", "Portsmouth", "Swansea",
    "Cardiff", "Newcastle", "Sunderland", "Hull", "York"
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_DATA, CITY_CARDS };
}
