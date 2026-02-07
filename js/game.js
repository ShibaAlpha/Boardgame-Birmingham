class BrassGame {
    constructor() {
        this.players = [];
        this.currentPlayerIndex = 0;
        this.currentEra = 'canal';
        this.currentRound = 1;
        this.turnActions = 0;
        this.cityCards = [];
        this.builtIndustries = new Map();
        this.builtLinks = [];
        this.selectedAction = null;
        this.selectedCard = null;
        this.selectedCity = null;
        
        this.init();
    }
    
    init() {
        this.players = [
            { id: 0, name: '玩家 1', color: '#e74c3c', money: 30, coal: 0, iron: 0, beer: 0, industries: [], links: [], loans: 0, victoryPoints: 0 },
            { id: 1, name: '玩家 2', color: '#3498db', money: 30, coal: 0, iron: 0, beer: 0, industries: [], links: [], loans: 0, victoryPoints: 0 },
            { id: 2, name: '玩家 3', color: '#2ecc71', money: 30, coal: 0, iron: 0, beer: 0, industries: [], links: [], loans: 0, victoryPoints: 0 },
            { id: 3, name: '玩家 4', color: '#f39c12', money: 30, coal: 0, iron: 0, beer: 0, industries: [], links: [], loans: 0, victoryPoints: 0 }
        ];
        
        this.shuffleCards();
        this.bindEvents();
        this.updateUI();
        this.renderBoard();
    }
    
    shuffleCards() {
        this.cityCards = [...CITY_CARDS];
        for (let i = this.cityCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cityCards[i], this.cityCards[j]] = [this.cityCards[j], this.cityCards[i]];
        }
    }
    
    bindEvents() {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectAction(e.target.dataset.action);
            });
        });
        
        document.getElementById('cards-display').addEventListener('click', (e) => {
            if (e.target.classList.contains('card')) {
                this.selectCard(e.target.dataset.city);
            }
        });
        
        document.getElementById('game-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('city') || e.target.closest('.city')) {
                const cityName = e.target.closest('.city').dataset.city;
                this.handleCityClick(cityName);
            }
        });
        
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });
    }
    
    selectAction(action) {
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        if (this.selectedAction === action) {
            this.selectedAction = null;
        } else {
            this.selectedAction = action;
            document.querySelector(`[data-action="${action}"]`).classList.add('selected');
        }
    }
    
    selectCard(city) {
        if (!this.selectedAction) return;
        
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
        
        this.selectedCard = city;
        event.target.classList.add('selected');
    }
    
    handleCityClick(cityName) {
        if (!this.selectedAction) return;
        
        this.selectedCity = cityName;
        this.executeAction();
    }
    
    executeAction() {
        const player = this.players[this.currentPlayerIndex];
        const action = this.selectedAction;
        
        if (!this.isActionValid(action)) return;
        
        switch (action) {
            case 'build':
                this.executeBuild(player);
                break;
            case 'link':
                this.executeLink(player);
                break;
            case 'develop':
                this.executeDevelop(player);
                break;
            case 'sell':
                this.executeSell(player);
                break;
            case 'loan':
                this.executeLoan(player);
                break;
            case 'scout':
                this.executeScout(player);
                break;
        }
        
        this.turnActions++;
        
        if (this.turnActions >= 2) {
            this.endTurn();
        }
        
        this.clearSelections();
        this.updateUI();
    }
    
    isActionValid(action) {
        const player = this.players[this.currentPlayerIndex];
        
        switch (action) {
            case 'build':
                return this.selectedCity && this.selectedCard;
            case 'link':
                return this.selectedCity && this.selectedCard;
            case 'develop':
                return player.industries.length > 0;
            case 'sell':
                return this.hasGoodsToSell(player);
            case 'loan':
                return player.loans < 2;
            case 'scout':
                return this.cityCards.length > 0;
        }
        return false;
    }
    
    executeBuild(player) {
        const city = this.selectedCity;
        const cardCity = this.selectedCard;
        
        if (city !== cardCity) {
            this.showMessage('城市不匹配！请选择正确的城市卡');
            return;
        }
        
        if (this.builtIndustries.has(city)) {
            this.showMessage('该城市已有产业');
            return;
        }
        
        const industryType = this.getIndustryTypeForCity(city);
        if (!industryType) return;
        
        const industry = {
            type: industryType,
            city: city,
            player: player.id,
            level: 1,
            flipped: false
        };
        
        this.builtIndustries.set(city, industry);
        player.industries.push(city);
        
        this.showMessage(`${player.name} 在 ${city} 建造了 ${MAP_DATA.industryTypes[industryType].nameCN}`);
        this.renderBoard(); // 重新渲染地图
    }
    
    executeLink(player) {
        const city1 = this.selectedCity;
        const city2 = this.selectedCard;
        
        const existingLink = this.builtLinks.find(l => 
            (l.city1 === city1 && l.city2 === city2) ||
            (l.city1 === city2 && l.city2 === city1)
        );
        
        if (existingLink) {
            this.showMessage('该链接已存在');
            return;
        }
        
        const link = {
            city1: city1,
            city2: city2,
            player: player.id,
            type: this.currentEra
        };
        
        this.builtLinks.push(link);
        player.links.push({ city1, city2, type: this.currentEra });
        
        this.showMessage(`${player.name} 建造了 ${this.currentEra === 'canal' ? '运河' : '铁路'}连接`);
        this.renderBoard(); // 重新渲染地图
    }
    
    executeDevelop(player) {
        const options = player.industries.map((city, idx) => {
            const ind = this.builtIndustries.get(city);
            const typeInfo = MAP_DATA.industryTypes[ind.type];
            return `<button onclick="game.developIndustry('${city}', ${idx})">${city} - ${typeInfo.nameCN} ${ind.flipped ? '⬆️' : '📗'}</button>`;
        }).join('');
        
        this.showModal('选择要开发的产业', `<div id="develop-options" style="display:grid;gap:10px;">${options}</div>`);
    }
    
    developIndustry(city, index) {
        const player = this.players[this.currentPlayerIndex];
        const industry = this.builtIndustries.get(city);
        if (!industry) return;
        
        const typeInfo = MAP_DATA.industryTypes[industry.type];
        
        if (!industry.flipped) {
            industry.flipped = true;
            player.victoryPoints += typeInfo.points;
            this.showMessage(`${city} 的 ${typeInfo.nameCN} 翻转！+${typeInfo.points}分`);
        } else {
            industry.level++;
            this.showMessage(`${city} 的 ${typeInfo.nameCN} 升级到 ${industry.level} 级`);
        }
        
        this.closeModal();
        this.endTurn();
    }
    
    executeSell(player) {
        const goods = player.coal + player.iron + player.beer;
        if (goods === 0) {
            this.showMessage('没有货物可销售');
            return;
        }
        
        const income = goods * 2;
        player.money += income;
        this.showMessage(`${player.name} 销售货物 +£${income}`);
    }
    
    executeLoan(player) {
        if (player.loans >= 2) {
            this.showMessage('已达最大贷款数（2个）');
            return;
        }
        
        player.loans++;
        player.money += 30;
        this.showMessage(`${player.name} 获得 £30 贷款 💰`);
    }
    
    executeScout(player) {
        if (this.cityCards.length === 0) {
            this.showMessage('没有更多城市卡');
            return;
        }
        
        this.cityCards.pop();
        this.showMessage(`${player.name} 侦察新城市卡 🎴`);
    }
    
    getIndustryTypeForCity(city) {
        const cityData = MAP_DATA.cities[city];
        if (!cityData || !cityData.resources || cityData.resources.length === 0) {
            return null;
        }
        return cityData.resources[0];
    }
    
    hasGoodsToSell(player) {
        return player.coal > 0 || player.iron > 0 || player.beer > 0;
    }
    
    endTurn() {
        this.turnActions = 0;
        this.clearSelections();
        
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        if (this.currentPlayerIndex === 0) {
            this.currentRound++;
            
            if (this.currentRound > 2) {
                this.switchEra();
            }
        }
        
        this.updateUI();
    }
    
    switchEra() {
        if (this.currentEra === 'canal') {
            this.currentEra = 'rail';
            this.currentRound = 1;
            this.showModal('🏭 时代转换', '<p>进入<strong style="color:#9b59b6">铁路时代</strong>！</p><p>所有运河可以升级为铁路。</p>');
        } else {
            this.endGame();
        }
    }
    
    endGame() {
        this.players.forEach(player => {
            player.industries.forEach(city => {
                const industry = this.builtIndustries.get(city);
                if (industry && industry.flipped) {
                    player.victoryPoints += MAP_DATA.industryTypes[industry.type].points;
                }
            });
            
            player.victoryPoints -= player.loans * 15;
            player.victoryPoints += Math.floor(player.money / 2);
        });
        
        const sortedPlayers = [...this.players].sort((a, b) => b.victoryPoints - a.victoryPoints);
        
        let resultHTML = '<div style="text-align:center;margin-bottom:20px;"><h2 style="color:#f39c12;">🏆 最终排名</h2></div>';
        sortedPlayers.forEach((player, idx) => {
            const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '📊';
            resultHTML += `
                <div style="margin: 15px 0; padding: 20px; background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%); border-radius: 15px; border-left: 5px solid ${player.color};">
                    <div style="font-size: 2em; margin-bottom: 10px;">${medal} <strong>${player.name}</strong></div>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; font-size: 1.1em;">
                        <div>⭐ 分数: <strong style="color:#f39c12">${player.victoryPoints}</strong></div>
                        <div>💰 金钱: £${player.money}</div>
                        <div>🏭 产业: ${player.industries.length}</div>
                        <div>🚂 链接: ${player.links.length}</div>
                    </div>
                </div>
            `;
        });
        
        this.showModal('🎉 游戏结束', resultHTML);
    }
    
    clearSelections() {
        this.selectedAction = null;
        this.selectedCard = null;
        this.selectedCity = null;
        
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('selected');
        });
    }
    
    updateUI() {
        const player = this.players[this.currentPlayerIndex];
        
        document.getElementById('current-era').textContent = `🏭 时代: ${this.currentEra === 'canal' ? '运河' : '铁路'}`;
        document.getElementById('current-round').textContent = `📅 回合: ${this.currentRound}`;
        document.getElementById('current-player').textContent = `👤 玩家: ${player.name}`;
        
        document.getElementById('money-display').textContent = player.money;
        document.getElementById('coal-display').textContent = player.coal;
        document.getElementById('iron-display').textContent = player.iron;
        document.getElementById('beer-display').textContent = player.beer;
        
        this.updatePlayerList();
        this.updateHandDisplay();
    }
    
    updatePlayerList() {
        const container = document.getElementById('players-list');
        container.innerHTML = this.players.map((player, idx) => `
            <div class="player-card player-${idx} ${idx === this.currentPlayerIndex ? 'active' : ''}">
                <div class="name">${idx === this.currentPlayerIndex ? '👉 ' : ''}${player.name}</div>
                <div class="stats">
                    <span>💰 £${player.money}</span>
                    <span>🏭 ${player.industries.length}</span>
                    <span>🚂 ${player.links.length}</span>
                    <span>⭐ ${player.victoryPoints}</span>
                </div>
            </div>
        `).join('');
    }
    
    updateHandDisplay() {
        const container = document.getElementById('cards-display');
        const hand = this.cityCards.slice(0, 3);
        
        container.innerHTML = hand.map((city, idx) => `
            <div class="card" data-city="${city}">${city}</div>
        `).join('');
    }
    
    renderBoard() {
        const svg = document.getElementById('game-board');
        svg.innerHTML = '';
        
        // 绘制背景
        this.drawBackground(svg);
        
        // 绘制区域
        this.drawRegions(svg);
        
        // 绘制链接
        this.drawLinks(svg);
        
        // 绘制城市
        this.drawCities(svg);
    }
    
    drawBackground(svg) {
        // 绘制背景（英国形状简化版）
        const bgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        bgPath.setAttribute('d', 'M 150,100 L 200,80 L 300,70 L 400,60 L 500,60 L 600,80 L 700,100 L 750,150 L 780,250 L 800,350 L 780,450 L 750,500 L 700,550 L 600,580 L 500,600 L 400,620 L 300,610 L 200,580 L 150,520 L 100,450 L 80,350 L 100,250 L 120,150 Z');
        bgPath.setAttribute('fill', '#3a4a5c');
        bgPath.setAttribute('opacity', '0.3');
        svg.appendChild(bgPath);
        
        // 绘制海洋
        const ocean = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ocean.setAttribute('width', '100%');
        ocean.setAttribute('height', '100%');
        ocean.setAttribute('fill', 'url(#oceanGradient)');
        svg.appendChild(ocean);
        
        // 渐变定义
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        defs.innerHTML = `
            <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#1a5276;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2c3e50;stop-opacity:1" />
            </linearGradient>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        `;
        svg.appendChild(defs);
    }
    
    drawRegions(svg) {
        Object.entries(MAP_DATA.regionColors).forEach(([region, color]) => {
            // 简化的区域背景
            const regionGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            regionGroup.setAttribute('opacity', '0.3');
            
            // 只对重点区域绘制
            if (['midlands', 'north', 'south'].includes(region)) {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', '500');
                circle.setAttribute('cy', '350');
                circle.setAttribute('r', '250');
                circle.setAttribute('fill', color);
                regionGroup.appendChild(circle);
            }
            
            svg.appendChild(regionGroup);
        });
    }
    
    drawLinks(svg) {
        const defs = document.querySelector('#game-board defs');
        
        // 运河渐变
        const canalGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        canalGradient.setAttribute('id', 'canalGradient');
        canalGradient.innerHTML = '<stop offset="0%" style="stop-color:#3498db"/><stop offset="100%" style="stop-color:#2980b9"/>';
        defs.appendChild(canalGradient);
        
        // 铁路渐变
        const railGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        railGradient.setAttribute('id', 'railGradient');
        railGradient.innerHTML = '<stop offset="0%" style="stop-color:#9b59b6"/><stop offset="100%" style="stop-color:#8e44ad"/>';
        defs.appendChild(railGradient);
        
        // 绘制可建造的链接（虚线）
        const linksToDraw = this.currentEra === 'canal' ? MAP_DATA.canalLinks : MAP_DATA.railLinks;
        linksToDraw.forEach(link => {
            const city1 = MAP_DATA.cities[link[0]];
            const city2 = MAP_DATA.cities[link[1]];
            
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', city1.x);
            line.setAttribute('y1', city1.y);
            line.setAttribute('x2', city2.x);
            line.setAttribute('y2', city2.y);
            line.setAttribute('class', 'link');
            line.setAttribute('stroke', 'rgba(100,100,100,0.3)');
            svg.appendChild(line);
        });
        
        // 绘制已建造的链接
        this.builtLinks.forEach(link => {
            const city1 = MAP_DATA.cities[link.city1];
            const city2 = MAP_DATA.cities[link.city2];
            
            // 发光效果
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            glow.setAttribute('x1', city1.x);
            glow.setAttribute('y1', city1.y);
            glow.setAttribute('x2', city2.x);
            glow.setAttribute('y2', city2.y);
            glow.setAttribute('class', `link built ${link.type}`);
            glow.setAttribute('stroke-width', link.type === 'canal' ? 6 : 8);
            glow.setAttribute('opacity', '0.5');
            glow.setAttribute('filter', 'url(#glow)');
            svg.appendChild(glow);
            
            // 主线条
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', city1.x);
            line.setAttribute('y1', city1.y);
            line.setAttribute('x2', city2.x);
            line.setAttribute('y2', city2.y);
            line.setAttribute('class', `link built ${link.type}`);
            svg.appendChild(line);
        });
    }
    
    drawCities(svg) {
        Object.entries(MAP_DATA.cities).forEach(([name, data]) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'city');
            g.setAttribute('data-city', name);
            
            // 外圈光晕
            const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            glow.setAttribute('cx', data.x);
            glow.setAttribute('cy', data.y);
            glow.setAttribute('r', 18);
            glow.setAttribute('fill', 'rgba(255,255,255,0.1)');
            g.appendChild(glow);
            
            // 城市圆圈
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', data.x);
            circle.setAttribute('cy', data.y);
            circle.setAttribute('r', 14);
            circle.setAttribute('fill', this.getCityColor(name));
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', 3);
            circle.setAttribute('filter', 'url(#glow)');
            
            g.appendChild(circle);
            
            // 产业图标
            const industry = this.builtIndustries.get(name);
            if (industry) {
                const typeInfo = MAP_DATA.industryTypes[industry.type];
                const icon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                icon.setAttribute('x', data.x);
                icon.setAttribute('y', data.y + 4);
                icon.setAttribute('text-anchor', 'middle');
                icon.setAttribute('font-size', '12');
                icon.setAttribute('fill', '#fff');
                icon.textContent = typeInfo.icon || '🏭';
                g.appendChild(icon);
            }
            
            // 城市名称
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', data.x);
            text.setAttribute('y', data.y - 22);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'city-name');
            text.setAttribute('font-size', '11');
            text.setAttribute('font-weight', 'bold');
            text.textContent = name;
            g.appendChild(text);
            
            // 资源标识
            if (data.resources && data.resources.length > 0) {
                const resourceText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                resourceText.setAttribute('x', data.x + 12);
                resourceText.setAttribute('y', data.y - 15);
                resourceText.setAttribute('font-size', '10');
                resourceText.setAttribute('fill', '#f39c12');
                resourceText.textContent = '●';
                g.appendChild(resourceText);
            }
            
            svg.appendChild(g);
        });
    }
    
    getCityColor(cityName) {
        const industry = this.builtIndustries.get(cityName);
        if (!industry) {
            return '#ecf0f1';
        }
        
        return MAP_DATA.industryTypes[industry.type].color || '#fff';
    }
    
    showMessage(msg) {
        console.log(msg);
    }
    
    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').classList.remove('hidden');
    }
    
    closeModal() {
        document.getElementById('modal').classList.add('hidden');
    }
}

let game;
document.addEventListener('DOMContentLoaded', () => {
    game = new BrassGame();
});
