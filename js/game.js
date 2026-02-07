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
            this.showMessage('城市不匹配！');
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
        
        this.showMessage(`${player.name} 在 ${city} 建造了 ${industryType} 厂`);
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
        
        this.showMessage(`${player.name} 在 ${city1}-${city2} 建造了${this.currentEra === 'canal' ? '运河' : '铁路'}`);
    }
    
    executeDevelop(player) {
        const options = player.industries.map((city, idx) => {
            const ind = this.builtIndustries.get(city);
            return `<button onclick="game.developIndustry('${city}', ${idx})">${city} - ${ind.type} ${ind.flipped ? '(已翻转)' : ''}</button>`;
        }).join('');
        
        this.showModal('开发产业', `<div id="develop-options">${options}</div>`);
    }
    
    developIndustry(city, index) {
        const player = this.players[this.currentPlayerIndex];
        const industry = this.builtIndustries.get(city);
        if (!industry) return;
        
        if (!industry.flipped) {
            industry.flipped = true;
            player.victoryPoints += MAP_DATA.industryTypes[industry.type].points;
            this.showMessage(`${city} 的 ${industry.type} 厂翻转！+${MAP_DATA.industryTypes[industry.type].points}分`);
        } else {
            industry.level++;
            this.showMessage(`${city} 的 ${industry.type} 厂升级到 ${industry.level} 级`);
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
        this.showMessage(`${player.name} 销售 ${goods} 个货物，+£${income}`);
    }
    
    executeLoan(player) {
        if (player.loans >= 2) {
            this.showMessage('已达最大贷款数');
            return;
        }
        
        player.loans++;
        player.money += 30;
        this.showMessage(`${player.name} 获得 £30 贷款`);
    }
    
    executeScout(player) {
        if (this.cityCards.length === 0) {
            this.showMessage('没有更多城市卡');
            return;
        }
        
        this.cityCards.pop();
        this.showMessage(`${player.name} 侦察了新城市卡`);
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
            this.showModal('时代转换', '<p>进入铁路时代！</p>');
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
        
        let resultHTML = '<h3>最终排名</h3>';
        sortedPlayers.forEach((player, idx) => {
            resultHTML += `<div style="margin: 10px 0; padding: 10px; background: rgba(255,255,255,0.1); border-radius: 8px;"><strong>#${idx + 1} ${player.name}</strong><br>分数: ${player.victoryPoints}<br>金钱: £${player.money} | 产业: ${player.industries.length}</div>`;
        });
        
        this.showModal('游戏结束', resultHTML);
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
        
        document.getElementById('current-era').textContent = `时代: ${this.currentEra === 'canal' ? '运河' : '铁路'}时代`;
        document.getElementById('current-round').textContent = `回合: ${this.currentRound}`;
        document.getElementById('current-player').textContent = `玩家: ${player.name}`;
        
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
                <div class="name">${player.name}</div>
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
        
        this.drawLinks(svg);
        this.drawCities(svg);
    }
    
    drawLinks(svg) {
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
            svg.appendChild(line);
        });
        
        this.builtLinks.forEach(link => {
            const city1 = MAP_DATA.cities[link.city1];
            const city2 = MAP_DATA.cities[link.city2];
            
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
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', data.x);
            circle.setAttribute('cy', data.y);
            circle.setAttribute('r', 12);
            circle.setAttribute('fill', this.getCityColor(name));
            circle.setAttribute('stroke', '#333');
            circle.setAttribute('stroke-width', 2);
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', data.x);
            text.setAttribute('y', data.y - 18);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('class', 'city-name');
            text.textContent = name;
            
            g.appendChild(circle);
            g.appendChild(text);
            svg.appendChild(g);
        });
    }
    
    getCityColor(cityName) {
        const industry = this.builtIndustries.get(cityName);
        if (!industry) return '#fff';
        
        const colors = {
            'coal': '#2c3e50', 'iron': '#95a5a6', 'cotton': '#9b59b6',
            'textile': '#8e44ad', 'pottery': '#e74c3c', 'manufacturing': '#1abc9c', 'beer': '#f39c12'
        };
        
        return colors[industry.type] || '#fff';
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
