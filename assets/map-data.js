// Brass: Birmingham 地图数据 - 改进版

const MAP_DATA = {
    // 英国地理坐标（简化版）
    cities: {
        "Birmingham": { x: 480, y: 380, resources: ["coal", "iron"], name: "Birmingham", region: "midlands" },
        "Manchester": { x: 420, y: 200, resources: ["coal"], name: "Manchester", region: "north" },
        "Liverpool": { x: 340, y: 150, resources: ["coal"], name: "Liverpool", region: "north" },
        "Leeds": { x: 480, y: 120, resources: ["coal", "iron"], name: "Leeds", region: "north" },
        "Sheffield": { x: 550, y: 180, resources: ["coal"], name: "Sheffield", region: "north" },
        "Nottingham": { x: 580, y: 300, resources: [], name: "Nottingham", region: "midlands" },
        "Derby": { x: 520, y: 320, resources: ["coal"], name: "Derby", region: "midlands" },
        "Leicester": { x: 620, y: 340, resources: [], name: "Leicester", region: "midlands" },
        "Coventry": { x: 520, y: 420, resources: [], name: "Coventry", region: "midlands" },
        "Wolverhampton": { x: 440, y: 440, resources: ["coal"], name: "Wolverhampton", region: "midlands" },
        "Worcester": { x: 500, y: 480, resources: [], name: "Worcester", region: "midlands" },
        "Oxford": { x: 580, y: 480, resources: [], name: "Oxford", region: "south" },
        "Northampton": { x: 600, y: 400, resources: [], name: "Northampton", region: "midlands" },
        "Cambridge": { x: 720, y: 420, resources: [], name: "Cambridge", region: "south" },
        "London": { x: 750, y: 500, resources: [], name: "London", region: "south" },
        "Bristol": { x: 400, y: 560, resources: ["coal"], name: "Bristol", region: "southwest" },
        "Bath": { x: 450, y: 580, resources: [], name: "Bath", region: "southwest" },
        "Southampton": { x: 600, y: 600, resources: [], name: "Southampton", region: "south" },
        "Portsmouth": { x: 700, y: 580, resources: [], name: "Portsmouth", region: "south" },
        "Swansea": { x: 250, y: 580, resources: ["coal"], name: "Swansea", region: "wales" },
        "Cardiff": { x: 320, y: 550, resources: ["coal"], name: "Cardiff", region: "wales" },
        "Newcastle": { x: 480, y: 60, resources: ["coal"], name: "Newcastle", region: "northeast" },
        "Sunderland": { x: 520, y: 50, resources: [], name: "Sunderland", region: "northeast" },
        "Hull": { x: 600, y: 100, resources: ["coal"], name: "Hull", region: "yorkshire" },
        "York": { x: 500, y: 100, resources: ["coal"], name: "York", region: "yorkshire" },
        "Lancaster": { x: 380, y: 100, resources: [], name: "Lancaster", region: "north" }
    },
    
    // 运河连接
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
    
    // 铁路连接
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
    
    // 产业类型详情
    industryTypes: {
        "coal": { 
            name: "Coal Mine", 
            nameCN: "煤矿", 
            cost: { coal: 1 }, 
            income: 2, 
            points: 3, 
            maxLevel: 3,
            color: "#2c3e50",
            icon: "◉"
        },
        "iron": { 
            name: "Iron Works", 
            nameCN: "铁厂", 
            cost: { coal: 1, iron: 1 }, 
            income: 3, 
            points: 4, 
            maxLevel: 2,
            color: "#7f8c8d",
            icon: "◆"
        },
        "cotton": { 
            name: "Cotton Mill", 
            nameCN: "纺织厂", 
            cost: { coal: 1 }, 
            income: 3, 
            points: 4, 
            maxLevel: 2,
            color: "#ecf0f1",
            icon: "◎"
        },
        "textile": { 
            name: "Textile Mill", 
            nameCN: "毛纺厂", 
            cost: { coal: 1, iron: 1 }, 
            income: 4, 
            points: 5, 
            maxLevel: 2,
            color: "#9b59b6",
            icon: "◇"
        },
        "pottery": { 
            name: "Pottery", 
            nameCN: "陶器厂", 
            cost: { coal: 1, iron: 1 }, 
            income: 2, 
            points: 3, 
            maxLevel: 4,
            color: "#c0392b",
            icon: "○"
        },
        "manufacturing": { 
            name: "Manufacturing", 
            nameCN: "制造厂", 
            cost: { coal: 2, iron: 2 }, 
            income: 5, 
            points: 6, 
            maxLevel: 1,
            color: "#16a085",
            icon: "⬡"
        },
        "beer": { 
            name: "Beer", 
            nameCN: "啤酒厂", 
            cost: { coal: 1, iron: 1 }, 
            income: 3, 
            points: 4, 
            maxLevel: 2,
            color: "#f39c12",
            icon: "●"
        }
    },
    
    // 区域颜色
    regionColors: {
        "north": "rgba(52, 152, 219, 0.1)",
        "northeast": "rgba(155, 89, 182, 0.1)",
        "yorkshire": "rgba(46, 204, 113, 0.1)",
        "midlands": "rgba(241, 196, 15, 0.1)",
        "south": "rgba(230, 126, 34, 0.1)",
        "southwest": "rgba(231, 76, 60, 0.1)",
        "wales": "rgba(26, 188, 156, 0.1)"
    }
};

// 城市卡牌
const CITY_CARDS = [
    "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield",
    "Nottingham", "Derby", "Leicester", "Coventry", "Wolverhampton",
    "Worcester", "Oxford", "Northampton", "Cambridge", "London",
    "Bristol", "Bath", "Southampton", "Portsmouth", "Swansea",
    "Cardiff", "Newcastle", "Sunderland", "Hull", "York"
];

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MAP_DATA, CITY_CARDS };
}
