const state_nums = document.querySelectorAll('#states > .item> .state> .value > span')
const state_bars = document.querySelectorAll('#states > .item> .bar > div')
const cares_btns = document.querySelectorAll('#cares > button')
const dialogs = document.querySelectorAll('.cares_modal')
const shop_modal = document.querySelector('#shop_modal')
const shop = document.querySelector('#shop')
const snack_counts = document.querySelectorAll('#snack_modal span')
const toy_counts = document.querySelectorAll('#toy_modal span')
const bedding_counts = document.querySelectorAll('#bedding_modal span')
const bath_counts = document.querySelectorAll('#bath_modal span')
const shop_items = shop_modal.querySelectorAll('.items')
const coin = document.querySelectorAll('#coin > div')[1]
const cares_items = document.querySelectorAll('.modal .items')
const params = new URLSearchParams(window.location.search)
const pet_name = params.get('pet_name')
const pet_tpye = params.get('pet_tpye')

if (!pet_name || !pet_tpye) {
    localStorage.clear();
    location.href = '/';
}

function load(key) {
    const data = localStorage.getItem(key)
    return JSON.parse(data);
}

function save(key, new_value) {
    localStorage.setItem(key, JSON.stringify(new_value))
}


function updatePetState() {
    const data = load('pet_state')

    state_nums.forEach((state_num) => {
        state_num.innerHTML = data[state_num.dataset.stateType]
    })

    state_bars.forEach((state_bar) => {
        state_bar.style.width = `${data[state_bar.dataset.stateType]}%`
    })
}

function updatePurchaseSnack() {
    const data = load('purchase_snack')

    snack_counts.forEach((snack_count) => {
        snack_count.textContent = data[snack_count.dataset.snackName]
    })
}

function updateCoin() {
    const data = load('coin')

    coin.textContent = data
}

function updatePurchaseToy() {
    const data = load('purchase_toy')

    toy_counts.forEach((toy_count) => {
        toy_count.textContent = data[toy_count.dataset.toyName]
    })
}

function updatePurchaseBedding() {
    const data = load('purchase_bedding')

    bedding_counts.forEach((bedding_count) => {
        bedding_count.textContent = data[bedding_count.dataset.beddingName]
    })
}

function updatePurchaseBath() {
    const data = load('purchase_bath')

    bath_counts.forEach((bath_count) => {
        bath_count.textContent = data[bath_count.dataset.bathName]
    })
}

function initializeGame() {
    if (load('pet_state') === null) {
        save('pet_state', {
            '행복도': 0,
            '포만감': 0,
            '청결도': 0,
            '에너지': 0
        })

        save('purchase_snack', {
            '개껌': 0,
            '육포': 0,
            '츄르': 0,
            '참치캔': 0,
            '사과': 0,
            '당근': 0
        })

        save('purchase_toy', {
            '공': 0,
            '낚시대': 0,
            '터그': 0,
            '털실': 0
        })

        save('purchase_bedding', {
            '쿠션': 0,
            '이불': 0
        })

        save('purchase_bath', {
            '샤워볼': 0,
            '비누': 0,
            '칫솔&치약': 0
        })

        save('coin', 300)
    }

    if (load('pet_level') === null) {
        save('pet_level', { level: 1, exp: 0 })
    }

    updatePetState()
    updatePurchaseSnack()
    updatePurchaseToy()
    updatePurchaseBedding()
    updatePurchaseBath()
    updateCoin()

    setInterval(() => {
        const data = load('pet_state')

        data['행복도'] = Math.max(0, data['행복도'] - 1)
        data['포만감'] = Math.max(0, data['포만감'] - 1)
        data['청결도'] = Math.max(0, data['청결도'] - 1)
        data['에너지'] = Math.max(0, data['에너지'] - 1)

        save('pet_state', data)
        updatePetState()

        if (data['행복도'] === 10 || data['행복도'] === 5) {
            alert(`${pet_name}이/가 외롭습니다`)
        } else if (data['포만감'] === 10 || data['포만감'] === 5) {
            alert(`${pet_name}이/가 배고픕니다`)
        } else if (data['청결도'] === 10 || data['청결도'] === 5) {
            alert(`${pet_name}이/가 더럽습니다`)
        } else if (data['에너지'] === 10 || data['에너지'] === 5) {
            alert(`${pet_name}이/가 피곤합니다`)
        }

    }, 10000)

    loadOrRefreshMissions()
    renderMissions()
    updateLevelUI()
}


cares_btns.forEach((cares_btn, i) => {
    cares_btn.addEventListener('click', () => {
        dialogs[i].showModal()
    })
})

dialogs.forEach((dialog) => {
    dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();

        const isInDialog =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;

        if (!isInDialog) {
            dialog.close();
        }
    })

})

shop.addEventListener('click', () => {
    shop_modal.showModal()
})


shop_modal.addEventListener('click', (e) => {
    const rect = shop_modal.getBoundingClientRect();

    const isInDialog =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

    if (!isInDialog) {
        shop_modal.close();
    }
})

shop_items.forEach((shop_item) => {
    shop_item.childNodes.forEach((item) => {
        item.addEventListener('click', () => {
            const itemPrice = item.dataset.itemPrice
            const itemName = item.dataset.itemName

            if (itemPrice <= load('coin')) {
                alert(`${itemName}(이/가) 구매되었습니다`)

                // 현재 코인값 구매금액에 따라 변경(로컬, html)
                save('coin', +load('coin') - itemPrice)
                updateCoin()

                let data

                // 구매내역도 변경(로컬, html)
                switch (item.dataset.itemType) {
                    case '간식':
                        data = load('purchase_snack')
                        data[itemName] += 1

                        save('purchase_snack', data)

                        updatePurchaseSnack()
                        break
                    case '목욕용품':
                        data = load('purchase_bath')
                        data[itemName] += 1

                        save('purchase_bath', data)

                        updatePurchaseBath()
                        break
                    case '장난감':
                        data = load('purchase_toy')
                        data[itemName] += 1

                        save('purchase_toy', data)

                        updatePurchaseToy()
                        break
                    default:
                        data = load('purchase_bedding')
                        data[itemName] += 1

                        save('purchase_bedding', data)

                        updatePurchaseBedding()
                        break
                }
            } else {
                alert('잔액이 부족합니다. 게임을 통해 코인을 얻으시오')
            }
        })
    })
})

cares_items.forEach((cares_item) => {
    cares_item.childNodes.forEach((item) => {
        const itemType = cares_item.dataset.itemType

        item.addEventListener('click', () => {
            const span = item.querySelector('span')
            const dialog = item.closest('dialog')

            if (+span.textContent > 0) {
                const data = load('pet_state')
                let purchase

                const stateKeys = {
                    'toy': '행복도',
                    'snack': '포만감',
                    'bath': '청결도',
                    'bedding': '에너지'
                }
                const stateKey = stateKeys[itemType]

                if (data[stateKey] >= 100) {
                    alert(`이미 ${stateKey}가 가득차서 펫이 원하지 않습니다.`)
                    if (dialog) dialog.close()
                    return
                }

                // 구매한 것 변경하기
                switch (itemType) {
                    case 'toy':
                        const toyName = span.dataset.toyName
                        purchase = load('purchase_toy')
                        purchase[toyName] -= 1
                        save('purchase_toy', purchase)
                        updatePurchaseToy()

                        // 1. 모달 즉시 닫기
                        if (dialog) dialog.close()

                        // 2. 장난감 이미지 생성 및 펫 컨테이너에 추가
                        const toyImg = document.createElement('img')
                        toyImg.src = `/static/${toyName}.png`
                        toyImg.className = 'play-toy-item'
                        const toyPetContainer = document.getElementById('pet')
                        toyPetContainer.appendChild(toyImg)

                        // 3. 애니메이션 종료 후 상태 업데이트 및 경고창
                        toyImg.addEventListener('animationend', () => {
                            toyImg.remove()

                            setTimeout(() => {
                                data['행복도'] = Math.min(100, data['행복도'] + 10)
                                save('pet_state', data)
                                updatePetState()

                                alert(`${toyName}을/를 가지고 놀고 행복도가 올라갔습니다.`)
                                notifyMission('놀아주기')
                            }, 100)
                        })

                        return
                    case 'snack':
                        const snackName = span.dataset.snackName
                        purchase = load('purchase_snack')
                        purchase[snackName] -= 1
                        save('purchase_snack', purchase)
                        updatePurchaseSnack()

                        // 1. 간식 이미지 동적 생성
                        const snackImg = document.createElement('img')
                        snackImg.src = `/static/${snackName}.png`
                        snackImg.className = 'eating-snack'

                        // 2. 펫 컨테이너(#pet)에 추가
                        const petContainer = document.getElementById('pet')
                        petContainer.appendChild(snackImg)

                        // 3. 모달 즉시 닫기
                        if (dialog) dialog.close()

                        // 4. 애니메이션 완료 시 처리
                        snackImg.addEventListener('animationend', () => {
                            snackImg.remove()

                            setTimeout(() => {
                                // 펫 상태 업데이트 및 저장
                                data['포만감'] = Math.min(100, data['포만감'] + 10)
                                save('pet_state', data)
                                updatePetState()

                                alert(`${snackName}을/를 먹고 포만감이 올라갔습니다.`)
                                notifyMission('밥주기')
                            }, 100)
                        })

                        return
                    case 'bath':
                        const bathName = span.dataset.bathName
                        purchase = load('purchase_bath')
                        purchase[bathName] -= 1
                        save('purchase_bath', purchase)
                        updatePurchaseBath()

                        // 1. 모달 즉시 닫기
                        if (dialog) dialog.close()

                        // 2. 목욕용품 이미지 등장
                        const bathPetContainer = document.getElementById('pet')

                        const bathImg = document.createElement('img')
                        bathImg.src = `/static/${bathName}.png`
                        bathImg.className = 'bath-item'
                        bathPetContainer.appendChild(bathImg)

                        // 3. 거품 생성 (setInterval 100ms 간격)
                        const bubbles = []
                        const bubbleColors = [
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(255, 182, 193, 0.4))',
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(216, 191, 255, 0.4))',
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(255, 255, 180, 0.4))',
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(173, 216, 230, 0.4))',
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(255, 255, 255, 0.3))',
                            'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(255, 218, 185, 0.4))',
                        ]

                        const bubbleInterval = setInterval(() => {
                            const count = Math.random() < 0.5 ? 1 : 2
                            for (let i = 0; i < count; i++) {
                                const bubble = document.createElement('div')
                                bubble.className = 'bubble'
                                const size = Math.random() * 28 + 8
                                bubble.style.position = 'absolute'
                                bubble.style.width = `${size}px`
                                bubble.style.height = `${size}px`
                                bubble.style.minWidth = `${size}px`
                                bubble.style.minHeight = `${size}px`
                                bubble.style.maxWidth = `${size}px`
                                bubble.style.maxHeight = `${size}px`
                                bubble.style.borderRadius = '50%'
                                bubble.style.aspectRatio = '1 / 1'
                                bubble.style.boxSizing = 'border-box'
                                bubble.style.top = `${Math.random() * 80 + 5}%`
                                bubble.style.left = `${Math.random() * 80 + 5}%`
                                bubble.style.background = bubbleColors[Math.floor(Math.random() * bubbleColors.length)]
                                bubble.style.opacity = (Math.random() * 0.35 + 0.5).toFixed(2)
                                bubble.style.animationDelay = `${Math.random() * 0.3}s`
                                bathPetContainer.appendChild(bubble)
                                bubbles.push(bubble)
                            }
                        }, 100)

                        // 4. 거품 생성 중단 + 거품/아이템 사그라들기 (t=1500ms)
                        setTimeout(() => {
                            clearInterval(bubbleInterval)
                            bubbles.forEach(b => b.classList.add('popping'))
                            bathImg.style.opacity = '0'
                        }, 1500)

                        // 5. 반짝이 파티클 등장 (t=2100ms)
                        const sparkleChars = ['★', '✦', '✧', '✨', '⭐']
                        const sparkleColors = ['#FFD700', '#FFFACD', '#FFFFFF', '#FFE4B5']
                        const sparkles = []

                        setTimeout(() => {
                            for (let i = 0; i < 12; i++) {
                                const sparkle = document.createElement('span')
                                sparkle.className = 'sparkle'
                                sparkle.textContent = sparkleChars[Math.floor(Math.random() * sparkleChars.length)]
                                sparkle.style.top = `${Math.random() * 90 + 5}%`
                                sparkle.style.left = `${Math.random() * 90 + 5}%`
                                sparkle.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)]
                                const tx = (Math.random() - 0.5) * 60
                                const ty = (Math.random() - 0.5) * 60
                                sparkle.style.setProperty('--tx', `${tx}px`)
                                sparkle.style.setProperty('--ty', `${ty}px`)
                                bathPetContainer.appendChild(sparkle)
                                sparkles.push(sparkle)
                            }
                        }, 2100)

                        // 6. 정리 + 상태 업데이트 + alert (t=3000ms)
                        setTimeout(() => {
                            bubbles.forEach(b => b.remove())
                            sparkles.forEach(s => s.remove())
                            bathImg.remove()

                            data['청결도'] = Math.min(100, data['청결도'] + 10)
                            save('pet_state', data)
                            updatePetState()

                            alert(`${bathName}을/를 사용하여 청결도가 올라갔습니다.`)
                            notifyMission('씻기기')
                        }, 3000)

                        return
                    default:
                        const beddingName = span.dataset.beddingName
                        purchase = load('purchase_bedding')
                        purchase[beddingName] -= 1
                        save('purchase_bedding', purchase)
                        updatePurchaseBedding()

                        // 1. 모달 즉시 닫기
                        if (dialog) dialog.close()

                        // 2. 어두운 오버레이 생성
                        const overlay = document.createElement('div')
                        overlay.className = 'sleep-overlay'
                        document.body.appendChild(overlay)
                        // 리플로우 강제 후 active 적용
                        overlay.offsetWidth
                        overlay.classList.add('active')

                        // 3. 침구류 이미지 생성 및 펫 아래 배치
                        const beddingPetContainer = document.getElementById('pet')
                        const beddingImg = document.createElement('img')
                        beddingImg.src = `/static/${beddingName}.png`
                        beddingImg.className = 'bedding-item'
                        beddingPetContainer.appendChild(beddingImg)

                        // 4. ZZZ 애니메이션 글자 주기적 생성 (400ms 간격)
                        const zLetters = ['z', 'z', 'Z', 'Z']
                        let zIndex = 0
                        const zList = []

                        const zInterval = setInterval(() => {
                            const zSpan = document.createElement('span')
                            zSpan.className = 'sleep-z'
                            zSpan.textContent = zLetters[zIndex % zLetters.length]

                            // 펫 머리 부근 절대 좌표 계산 (오버레이 위로 글자를 띄우기 위함)
                            const petRect = beddingPetContainer.getBoundingClientRect()
                            const startTop = petRect.top + window.scrollY
                            const startLeft = petRect.left + window.scrollX

                            const yPos = startTop + petRect.height * 0.25 + (Math.random() - 0.5) * 15
                            const xPos = startLeft + petRect.width * 0.55 + (Math.random() - 0.5) * 15
                            zSpan.style.top = `${yPos}px`
                            zSpan.style.left = `${xPos}px`

                            // Z의 크기를 다르게 설정
                            const isBig = zSpan.textContent === 'Z'
                            zSpan.style.fontSize = isBig ? `${24 + Math.random() * 6}px` : `${14 + Math.random() * 4}px`

                            document.body.appendChild(zSpan)
                            zList.push(zSpan)
                            zIndex++
                        }, 400)

                        // 5. 애니메이션 정지 및 페이드아웃 (t=2300ms)
                        setTimeout(() => {
                            clearInterval(zInterval)
                            overlay.classList.remove('active')
                            beddingImg.classList.add('fade-out')
                        }, 2300)

                        // 6. 정리 및 상태 업데이트 (t=3000ms)
                        setTimeout(() => {
                            overlay.remove()
                            beddingImg.remove()
                            zList.forEach(z => z.remove())

                            data['에너지'] = Math.min(100, data['에너지'] + 10)
                            save('pet_state', data)
                            updatePetState()

                            alert(`${beddingName}에서 자고 에너지가 올라갔습니다.`)
                            notifyMission('재우기')
                        }, 3000)

                        return
                }

                save('pet_state', data)
                updatePetState()
                if (dialog) dialog.close()


            } else {
                alert('아이템이 없습니다. 상점에서 구매하고 오세요')
                if (dialog) dialog.close()
            }
        })
    })
})



// ══════════════════════════════════════════════════════
//  📋 일일 미션 & 레벨/EXP 시스템
// ══════════════════════════════════════════════════════

function getLevelInfo(level) {
    if (level <= 5) return { stage: '아기', required: 1 };
    if (level <= 10) return { stage: '어린이', required: 2 };
    if (level <= 15) return { stage: '10대 초반', required: 3 };
    if (level <= 20) return { stage: '10대 후반', required: 4 };
    return { stage: '20대', required: 5 };
}

function getTodayDate() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function generateMissions() {
    const MISSION_POOL = ['밥주기', '놀아주기', '씻기기', '재우기'];
    const levelData = load('pet_level') || { level: 1, exp: 0 };
    const { required } = getLevelInfo(levelData.level);

    // 랜덤 3개 선택
    const shuffled = MISSION_POOL.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    const missions = selected.map(action => ({
        action,
        required,
        current: 0,
        done: false
    }));

    save('daily_mission', {
        date: getTodayDate(),
        missions
    });
}

function loadOrRefreshMissions() {
    const levelData = load('pet_level') || { level: 1, exp: 0 };
    if (levelData.level >= 30) return; // 만렙 시 미션 생성 안함

    let data = load('daily_mission');
    const today = getTodayDate();

    if (!data || data.date !== today) {
        generateMissions();
    }
}

function showMissionToast(text) {
    let toast = document.getElementById('mission-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'mission-toast';
        document.body.appendChild(toast);
    }
    toast.textContent = text;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function notifyMission(action) {
    const levelData = load('pet_level') || { level: 1, exp: 0 };
    if (levelData.level >= 30) return; // 만렙 시 미션 카운트 무시

    let data = load('daily_mission');
    if (!data || data.date !== getTodayDate()) {
        loadOrRefreshMissions();
        data = load('daily_mission');
    }

    let updated = false;
    data.missions.forEach(mission => {
        if (mission.action === action && !mission.done) {
            mission.current += 1;
            updated = true;
            if (mission.current >= mission.required) {
                mission.done = true;
                gainExp(33); // 33 EXP 획득
                showMissionToast(`일일 미션 완료: ${action} (${mission.required}/${mission.required})`);
            }
        }
    });

    if (updated) {
        save('daily_mission', data);
        renderMissions();
    }
}

function gainExp(amount) {
    let data = load('pet_level') || { level: 1, exp: 0 };
    if (data.level >= 30) return; // 만렙 시 경험치 획득 무시

    data.exp += amount;

    if (data.exp >= 100) {
        data.level += 1;
        data.exp = 0; // 초과분 0으로 초기화
        
        // 레벨업 플래시 애니메이션
        const bg = document.getElementById('exp-bar-bg');
        if (bg) {
            bg.classList.remove('levelup-flash');
            void bg.offsetWidth; // 리플로우
            bg.classList.add('levelup-flash');
        }
        
        if (data.level >= 30) {
            data.level = 30;
            data.exp = 100; // EXP 바 꽉 찬 상태 유지
            setTimeout(() => {
                alert(`🎉 레벨 업! Lv ${data.level}이(가) 되었습니다.\n펫의 모든 성장이 끝났습니다!`);
            }, 500);
        } else {
            setTimeout(() => alert(`🎉 레벨 업! Lv ${data.level}이(가) 되었습니다.`), 500);
        }
    }

    save('pet_level', data);
    updateLevelUI();
    if (data.level >= 30) renderMissions(); // 만렙 시 패널 갱신
}

function renderMissions() {
    const levelData = load('pet_level') || { level: 1, exp: 0 };
    const listEl = document.getElementById('mission-list');
    if (!listEl) return;

    listEl.innerHTML = '';

    // 만렙일 경우 미션 대신 축하 메시지 표시
    if (levelData.level >= 30) {
        const li = document.createElement('li');
        li.className = 'mission-item';
        li.style.justifyContent = 'center';
        li.style.color = '#7c4a00';
        li.style.fontWeight = 'bold';
        li.textContent = '모든 성장이 완료되었습니다! 🎉';
        listEl.appendChild(li);
        return;
    }

    const data = load('daily_mission');
    if (!data) return;
    data.missions.forEach(m => {
        const li = document.createElement('li');
        li.className = `mission-item ${m.done ? 'done' : ''}`;
        
        const check = document.createElement('span');
        check.className = 'mission-check';
        check.textContent = m.done ? '✅' : '🔲';

        const text = document.createElement('span');
        text.className = 'mission-text';
        text.textContent = m.action;

        const progress = document.createElement('span');
        progress.className = 'mission-progress';
        progress.textContent = `${m.current}/${m.required}`;

        li.appendChild(check);
        li.appendChild(text);
        li.appendChild(progress);
        listEl.appendChild(li);
    });
}

function updateLevelUI() {
    const data = load('pet_level') || { level: 1, exp: 0 };
    const info = getLevelInfo(data.level);

    // .pet-level 텍스트 업데이트
    const display = document.getElementById('pet-level-display');
    if (display) {
        const pName = typeof pet_name !== 'undefined' ? pet_name : '';
        display.textContent = `Lv${data.level} (${info.stage}), ${pName}`;
    }

    // EXP 바 및 텍스트 업데이트
    const levelNum = document.getElementById('level-num');
    if (levelNum) levelNum.textContent = data.level;

    const expNum = document.getElementById('exp-num');
    if (expNum) expNum.textContent = data.exp;

    const fill = document.getElementById('exp-bar-fill');
    if (fill) fill.style.width = `${Math.min(100, data.exp)}%`;
}

initializeGame()

// ══════════════════════════════════════════════════════
//  🐍 스네이크(지렁이) 미니게임 모듈
// ══════════════════════════════════════════════════════
;(function () {

    // ── 상수 ──────────────────────────────────────────
    const GRID        = 20;       // N × N 격자
    const CELL        = 20;       // 셀 픽셀 크기 (canvas 400 / 20 = 20)
    const TICK_MS     = 150;      // 이동 주기 (ms)
    const INIT_LEN    = 3;        // 초기 지렁이 길이

    // 색상
    const COLOR_BG        = '#0d0d1a';
    const COLOR_GRID      = '#16213e';
    const COLOR_HEAD      = '#86efac';
    const COLOR_BODY      = '#22c55e';
    const COLOR_BODY_DARK = '#16a34a';
    const COLOR_FOOD      = '#f97316';
    const COLOR_FOOD_GLOW = 'rgba(249,115,22,0.45)';

    // ── DOM 참조 ──────────────────────────────────────
    const miniGameBtn   = document.getElementById('mini-game-btn');
    const snakeModal    = document.getElementById('snake_modal');
    const canvas        = document.getElementById('snake-canvas');
    const ctx           = canvas.getContext('2d');
    const scoreEl       = document.getElementById('snake-score');
    const guideEl       = document.getElementById('snake-guide');
    const gameoverEl    = document.getElementById('snake-gameover');
    const finalScoreEl  = document.getElementById('final-score');
    const earnedCoinEl  = document.getElementById('earned-coin');
    const restartBtn    = document.getElementById('snake-restart-btn');
    const closeBtn      = document.getElementById('snake-close-btn');

    // ── 게임 상태 변수 ────────────────────────────────
    let snake        = [];    // [{x, y}, ...] 머리가 인덱스 0
    let direction    = { x: 1, y: 0 };
    let nextDir      = { x: 1, y: 0 };
    let food         = null;  // {x, y}
    let score        = 0;
    let gameLoop     = null;
    let gameStarted  = false;
    let isGameOver   = false;
    let foodPulse    = 0;     // 먹이 빛나는 애니메이션 프레임 카운터

    // ── 초기화 ────────────────────────────────────────
    function initSnake() {
        snake       = [];
        score       = 0;
        gameStarted = false;
        isGameOver  = false;
        foodPulse   = 0;

        // 가운데 행, 왼쪽 방향 향해 INIT_LEN 칸
        const startX = Math.floor(GRID / 2);
        const startY = Math.floor(GRID / 2);
        for (let i = 0; i < INIT_LEN; i++) {
            snake.push({ x: startX - i, y: startY });
        }

        direction = { x: 1, y: 0 };
        nextDir   = { x: 1, y: 0 };

        spawnFood();
        updateScoreUI();
        gameoverEl.classList.add('hidden');
        guideEl.textContent = '방향키를 눌러 게임을 시작하세요';
        render();
    }

    // ── 먹이 생성 ─────────────────────────────────────
    function spawnFood() {
        // 지렁이 몸 좌표를 Set으로 변환
        const occupied = new Set(snake.map(s => `${s.x},${s.y}`));

        // 빈 칸 목록 구성
        const empty = [];
        for (let y = 0; y < GRID; y++) {
            for (let x = 0; x < GRID; x++) {
                if (!occupied.has(`${x},${y}`)) {
                    empty.push({ x, y });
                }
            }
        }

        if (empty.length === 0) return; // 격자가 꽉 찬 경우
        food = empty[Math.floor(Math.random() * empty.length)];
    }

    // ── 게임 시작 ─────────────────────────────────────
    function startGame() {
        if (gameStarted || isGameOver) return;
        gameStarted = true;
        guideEl.textContent = '';
        gameLoop = setInterval(tick, TICK_MS);
    }

    // ── 한 틱 처리 ────────────────────────────────────
    function tick() {
        // 방향 확정
        direction = { ...nextDir };

        // 새 머리 좌표
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // 1. 벽 충돌 검사
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
            endGame();
            return;
        }

        // 2. 자기 몸 충돌 검사
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                endGame();
                return;
            }
        }

        // 3. 머리를 맨 앞에 추가
        snake.unshift(head);

        // 4. 먹이 섭취 여부
        if (food && head.x === food.x && head.y === food.y) {
            score++;
            updateScoreUI();
            spawnFood();
            // 꼬리 제거하지 않음 → 길이 증가
        } else {
            snake.pop(); // 꼬리 제거 → 길이 유지
        }

        render();
    }

    // ── 렌더링 ────────────────────────────────────────
    function render() {
        const W = canvas.width;
        const H = canvas.height;

        // 배경 초기화
        ctx.fillStyle = COLOR_BG;
        ctx.fillRect(0, 0, W, H);

        // 격자선
        ctx.strokeStyle = COLOR_GRID;
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= GRID; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL, 0);
            ctx.lineTo(i * CELL, H);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL);
            ctx.lineTo(W, i * CELL);
            ctx.stroke();
        }

        // 지렁이 몸 (꼬리→머리 순서로 그림)
        for (let i = snake.length - 1; i >= 0; i--) {
            const seg = snake[i];
            const px  = seg.x * CELL;
            const py  = seg.y * CELL;
            const pad = i === 0 ? 1 : 2; // 머리는 더 크게

            if (i === 0) {
                // 머리: 밝은 초록 + 둥근 사각형
                ctx.fillStyle = COLOR_HEAD;
                roundRect(ctx, px + 1, py + 1, CELL - 2, CELL - 2, 5);
                ctx.fill();

                // 눈 그리기
                const eyeSize = 2.5;
                ctx.fillStyle = '#0f172a';
                const eyeOffsets = getEyeOffsets(direction);
                eyeOffsets.forEach(([ex, ey]) => {
                    ctx.beginPath();
                    ctx.arc(px + ex, py + ey, eyeSize, 0, Math.PI * 2);
                    ctx.fill();
                });
            } else {
                // 몸통: 초록 그라디언트 느낌
                const progress = i / (snake.length - 1);
                const g = ctx.createLinearGradient(px, py, px + CELL, py + CELL);
                g.addColorStop(0, COLOR_BODY);
                g.addColorStop(1, COLOR_BODY_DARK);
                ctx.fillStyle = g;
                roundRect(ctx, px + pad, py + pad, CELL - pad * 2, CELL - pad * 2, 4);
                ctx.fill();
            }
        }

        // 먹이
        if (food) {
            foodPulse += 0.12;
            const fp   = food.x * CELL;
            const fq   = food.y * CELL;
            const glow = Math.sin(foodPulse) * 0.3 + 0.7; // 0.4 ~ 1.0
            const r    = (CELL / 2 - 2) * glow;

            // 빛 효과
            const radGrad = ctx.createRadialGradient(fp + CELL/2, fq + CELL/2, 1, fp + CELL/2, fq + CELL/2, CELL * 0.9);
            radGrad.addColorStop(0, COLOR_FOOD_GLOW);
            radGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = radGrad;
            ctx.fillRect(fp - CELL*0.4, fq - CELL*0.4, CELL * 1.8, CELL * 1.8);

            // 먹이 원
            ctx.beginPath();
            ctx.arc(fp + CELL / 2, fq + CELL / 2, r, 0, Math.PI * 2);
            ctx.fillStyle = COLOR_FOOD;
            ctx.fill();

            // 하이라이트
            ctx.beginPath();
            ctx.arc(fp + CELL / 2 - 2, fq + CELL / 2 - 2, r * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,255,0.4)';
            ctx.fill();
        }
    }

    // 방향에 따른 눈 위치 오프셋
    function getEyeOffsets(dir) {
        const C = CELL;
        if (dir.x === 1)  return [[C * 0.7, C * 0.3], [C * 0.7, C * 0.7]]; // 오른쪽
        if (dir.x === -1) return [[C * 0.3, C * 0.3], [C * 0.3, C * 0.7]]; // 왼쪽
        if (dir.y === -1) return [[C * 0.3, C * 0.3], [C * 0.7, C * 0.3]]; // 위
        return                    [[C * 0.3, C * 0.7], [C * 0.7, C * 0.7]]; // 아래
    }

    // 둥근 사각형 helper
    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }

    // ── 게임 오버 ─────────────────────────────────────
    function endGame() {
        clearInterval(gameLoop);
        gameLoop    = null;
        isGameOver  = true;
        gameStarted = false;

        // 점수·코인 계산
        const earned = score * 100;
        const newCoin = (load('coin') || 0) + earned;
        save('coin', newCoin);
        updateCoin();

        // UI 업데이트
        finalScoreEl.textContent  = score;
        earnedCoinEl.textContent  = earned.toLocaleString();
        gameoverEl.classList.remove('hidden');
    }

    // ── 점수 UI 업데이트 ──────────────────────────────
    function updateScoreUI() {
        scoreEl.textContent = score;
    }

    // ── 키보드 이벤트 ─────────────────────────────────
    const DIR_MAP = {
        ArrowUp:    { x:  0, y: -1 },
        ArrowDown:  { x:  0, y:  1 },
        ArrowLeft:  { x: -1, y:  0 },
        ArrowRight: { x:  1, y:  0 },
    };

    document.addEventListener('keydown', (e) => {
        // 모달이 열려있을 때만 처리
        if (!snakeModal.open) return;

        const newDir = DIR_MAP[e.key];
        if (!newDir) return;

        // 스크롤 방지
        e.preventDefault();

        // 반대 방향(180도) 전환 방지
        if (newDir.x === -direction.x && newDir.y === -direction.y) return;

        nextDir = newDir;

        // 최초 방향키 입력 시 게임 시작
        if (!gameStarted && !isGameOver) {
            startGame();
        }
    });

    // ── 모달 열기/닫기 ────────────────────────────────
    miniGameBtn.addEventListener('click', () => {
        initSnake();
        snakeModal.showModal();
    });

    restartBtn.addEventListener('click', () => {
        clearInterval(gameLoop);
        gameLoop = null;
        initSnake();
    });

    closeBtn.addEventListener('click', () => {
        clearInterval(gameLoop);
        gameLoop    = null;
        isGameOver  = true;
        gameStarted = false;
        snakeModal.close();
    });

    // 모달 바깥 클릭 시 닫기
    snakeModal.addEventListener('click', (e) => {
        const rect = snakeModal.getBoundingClientRect();
        const inDialog =
            e.clientX >= rect.left && e.clientX <= rect.right &&
            e.clientY >= rect.top  && e.clientY <= rect.bottom;
        if (!inDialog) {
            clearInterval(gameLoop);
            gameLoop    = null;
            isGameOver  = true;
            gameStarted = false;
            snakeModal.close();
        }
    });

})();