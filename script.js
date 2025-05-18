// NeighborGrid 웹사이트 JavaScript - 히어로 슬라이더 기능 완전 구현

// 문서가 로드될 때 실행되는 메인 함수
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

// 웹사이트 초기화 함수
function initializeWebsite() {
    setupHeroSlider(); // 히어로 슬라이더 기능 추가
    setupMobileMenu();
    setupScrollProgress();
    setupSmoothScrolling();
    setupAnimationsOnScroll();
    setupStatCounters();
    setupTypingEffect();
    setupParallaxEffects();
    setupFormHandlers();
    setupTooltips();
    setupLazyLoading();
    setupEnvironmentCalculator();
}

// 히어로 슬라이더 기능 설정 - 전체 구현
function setupHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const leftArrow = document.querySelector('.slider-arrow-left');
    const rightArrow = document.querySelector('.slider-arrow-right');
    const playPauseBtn = document.getElementById('slider-play-pause');
    const playIcon = playPauseBtn.querySelector('.play-icon');
    const pauseIcon = playPauseBtn.querySelector('.pause-icon');
    
    let currentSlide = 0;
    let isPlaying = true;
    let slideInterval;
    const slideDelay = 4000; // 4초마다 자동 전환
    
    // 초기 설정: 첫 번째 슬라이드만 활성화
    function initializeSlider() {
        if (slides.length === 0) return;
        
        // 모든 슬라이드의 active 클래스 제거
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // 첫 번째 슬라이드와 도트 활성화
        slides[0].classList.add('active');
        if (dots.length > 0) dots[0].classList.add('active');
        
        // 자동 재생 시작
        startSlideShow();
    }
    
    // 슬라이드 변경 함수
    function changeSlide(index) {
        if (index < 0 || index >= slides.length || index === currentSlide) return;
        
        // 현재 슬라이드와 도트에서 active 클래스 제거
        slides[currentSlide].classList.remove('active');
        if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
        
        // 새로운 슬라이드의 인덱스 설정
        currentSlide = index;
        
        // 새로운 슬라이드와 도트에 active 클래스 추가
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    // 다음 슬라이드로 이동
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        changeSlide(nextIndex);
    }
    
    // 이전 슬라이드로 이동
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        changeSlide(prevIndex);
    }
    
    // 자동 재생 시작
    function startSlideShow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, slideDelay);
        isPlaying = true;
        updatePlayPauseIcon();
    }
    
    // 자동 재생 정지
    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        isPlaying = false;
        updatePlayPauseIcon();
    }
    
    // 재생/일시정지 아이콘 업데이트
    function updatePlayPauseIcon() {
        if (isPlaying) {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        } else {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        }
    }
    
    // 도트 클릭 이벤트 설정
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            changeSlide(index);
            // 수동으로 슬라이드를 변경했을 때 자동 재생 재시작
            if (isPlaying) {
                startSlideShow();
            }
        });
    });
    
    // 화살표 클릭 이벤트 설정
    if (leftArrow) {
        leftArrow.addEventListener('click', function() {
            prevSlide();
            if (isPlaying) {
                startSlideShow(); // 자동 재생 재시작
            }
        });
    }
    
    if (rightArrow) {
        rightArrow.addEventListener('click', function() {
            nextSlide();
            if (isPlaying) {
                startSlideShow(); // 자동 재생 재시작
            }
        });
    }
    
    // 재생/일시정지 버튼 이벤트
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            if (isPlaying) {
                stopSlideShow();
            } else {
                startSlideShow();
            }
        });
    }
    
    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        // 포커스가 입력 필드에 있을 때는 무시
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                if (isPlaying) startSlideShow();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                if (isPlaying) startSlideShow();
                break;
            case ' ':
                e.preventDefault();
                if (isPlaying) {
                    stopSlideShow();
                } else {
                    startSlideShow();
                }
                break;
        }
    });
    
    // 마우스 호버 시 자동 재생 일시정지 (선택사항)
    const sliderContainer = document.querySelector('.hero-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', function() {
            // 마우스가 올라간 동안 자동 재생을 멈추지 않음 (UX 고려)
            // 원한다면 여기서 stopSlideShow() 호출 가능
        });
        
        sliderContainer.addEventListener('mouseleave', function() {
            // 마우스가 떠났을 때도 기존 상태 유지
            // 원한다면 여기서 startSlideShow() 호출 가능
        });
    }
    
    // 페이지 가시성 변경 시 자동 재생 관리
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 자동 재생 정지
            if (isPlaying && slideInterval) {
                stopSlideShow();
                // 원래 재생 중이었다는 플래그 설정
                document._wasPlaying = true;
            }
        } else {
            // 페이지가 다시 보일 때 자동 재생 재시작
            if (document._wasPlaying) {
                startSlideShow();
                document._wasPlaying = false;
            }
        }
    });
    
    // 슬라이더 초기화 실행
    initializeSlider();
    
    // 터치 제스처 지원 (모바일)
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (sliderContainer) {
        sliderContainer.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        sliderContainer.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50; // 최소 스와이프 거리
        const swipeDistance = touchEndX - touchStartX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // 오른쪽으로 스와이프 (이전 슬라이드)
                prevSlide();
            } else {
                // 왼쪽으로 스와이프 (다음 슬라이드)
                nextSlide();
            }
            
            if (isPlaying) {
                startSlideShow(); // 자동 재생 재시작
            }
        }
    }
}

// 모바일 메뉴 토글 기능
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            // 햄버거 메뉴 아이콘을 X로 변경하는 애니메이션 효과
            const icon = mobileMenuBtn.querySelector('svg path');
            if (mobileMenu.classList.contains('hidden')) {
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            } else {
                icon.setAttribute('d', 'M6 18L18 6M6 6l12 12');
            }
        });
        
        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('svg path');
                icon.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
            });
        });
    }
}

// 스크롤 진행률 표시 기능
function setupScrollProgress() {
    // 스크롤 진행률 바를 동적으로 생성
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-indicator';
    progressBar.innerHTML = '<div class="scroll-progress"></div>';
    document.body.appendChild(progressBar);
    
    const scrollProgress = progressBar.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        
        scrollProgress.style.width = scrollPercent + '%';
    });
}

// 부드러운 스크롤링 설정
function setupSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('nav').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 스크롤 시 애니메이션 효과
function setupAnimationsOnScroll() {
    // Intersection Observer를 사용하여 요소가 뷰포트에 들어올 때 애니메이션 실행
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // 진행률 바 애니메이션
                const progressBars = entry.target.querySelectorAll('.progress-fill');
                progressBars.forEach(bar => {
                    const targetWidth = bar.getAttribute('data-width') || '85';
                    setTimeout(() => {
                        bar.style.width = targetWidth + '%';
                    }, 200);
                });
            }
        });
    }, observerOptions);
    
    // 관찰할 요소들을 선택
    const elementsToAnimate = document.querySelectorAll('.card-hover, .bg-white, .bg-gray-50');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// 통계 카운터 애니메이션
function setupStatCounters() {
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            element.textContent = current.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // 통계 숫자들을 찾아서 애니메이션 적용
    const statElements = document.querySelectorAll('.counter');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target')) || 100;
                animateCounter(entry.target, 0, target, 2000);
                statObserver.unobserve(entry.target);
            }
        });
    });
    
    statElements.forEach(el => statObserver.observe(el));
}

// 타이핑 효과
function setupTypingEffect() {
    const typingElements = document.querySelectorAll('.typing-effect');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.style.display = 'inline-block';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text.charAt(i);
            i++;
            if (i >= text.length) {
                clearInterval(typeInterval);
                // 타이핑 완료 후 커서 제거
                setTimeout(() => {
                    element.style.borderRight = 'none';
                }, 1000);
            }
        }, 50);
    });
}

// 패럴랙스 효과
function setupParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    });
}

// 정교한 환경 효과 계산기
function setupEnvironmentCalculator() {
    // 커뮤니티 규모별 기본 데이터
    const communityData = {
        small: { name: '소규모 (아파트 단지)', households: 500, baseDevices: 2000 },
        medium: { name: '중간 규모 (동 단위)', households: 2000, baseDevices: 8000 },
        large: { name: '대규모 (구 단위)', households: 10000, baseDevices: 40000 }
    };
    
    // 효과 계산을 위한 상수들
    const EFFECTS = {
        wastePerDevice: 0.01,      // 기기당 전자폐기물 감소 (톤)
        co2PerDevice: 0.0035,      // 기기당 CO2 절약 (톤)
        energyPerDevice: 14,       // 기기당 에너지 절약 (kWh/년)
        costPerHousehold: 300000,  // 세대당 연간 절약 비용 (원)
        operationCost: 1000,      // 기기당 연간 운영비 (원)
        treesPerTonCO2: 35,       // CO2 1톤당 소나무 그루 수
        carKmPerTonCO2: 4000      // CO2 1톤당 자동차 주행거리 (km)
    };
    
    // 계산기 초기화
    function initializeCalculator() {
        // DOM 요소들이 존재할 때까지 대기
        setTimeout(() => {
            const inputs = {
                communitySize: document.getElementById('community-size'),
                participationRate: document.getElementById('participation-rate'),
                devicesPerHousehold: document.getElementById('devices-per-household'),
                operationMonths: document.getElementById('operation-months')
            };
            
            if (!inputs.communitySize) return; // 요소가 없으면 리턴
            
            // 슬라이더 초기값 표시 설정
            updateSliderDisplay(inputs.participationRate);
            updateSliderDisplay(inputs.devicesPerHousehold);
            updateSliderDisplay(inputs.operationMonths);
            
            // 슬라이더 이벤트 리스너 설정
            [inputs.participationRate, inputs.devicesPerHousehold, inputs.operationMonths]
                .forEach(input => {
                    if (input) {
                        input.addEventListener('input', function() {
                            updateSliderDisplay(input);
                            calculateEffects();
                        });
                    }
                });
            
            // 드롭다운 이벤트 리스너
            if (inputs.communitySize) {
                inputs.communitySize.addEventListener('change', calculateEffects);
            }
            
            // 초기 계산 실행
            calculateEffects();
        }, 500);
    }
    
    // 슬라이더 값 표시 업데이트
    function updateSliderDisplay(slider) {
        if (!slider) return;
        
        const id = slider.id;
        const value = slider.value;
        let displayId;
        
        switch(id) {
            case 'participation-rate':
                displayId = 'participation-display';
                break;
            case 'devices-per-household':
                displayId = 'devices-display';
                break;
            case 'operation-months':
                displayId = 'operation-display';
                break;
        }
        
        const displayElement = document.getElementById(displayId);
        if (displayElement) {
            switch(id) {
                case 'participation-rate':
                    displayElement.textContent = value + '%';
                    break;
                case 'devices-per-household':
                    displayElement.textContent = value + '개';
                    break;
                case 'operation-months':
                    displayElement.textContent = value + '개월';
                    break;
            }
        }
    }
    
    // 효과 계산 메인 함수
    function calculateEffects() {
        const inputs = getCurrentInputs();
        if (!inputs) return;
        
        const community = communityData[inputs.communitySize];
        const participatingHouseholds = Math.floor(community.households * inputs.participationRate / 100);
        const totalDevices = participatingHouseholds * inputs.devicesPerHousehold;
        const operationFactor = inputs.operationMonths / 12;
        const gridNodes = Math.ceil(totalDevices / 600); // 기기 600대당 하나의 그리드 노드
        
        // 환경 효과 계산
        const wasteReduction = totalDevices * EFFECTS.wastePerDevice;
        const co2Reduction = totalDevices * EFFECTS.co2PerDevice * operationFactor;
        const energySavings = totalDevices * EFFECTS.energyPerDevice * operationFactor;
        
        // 경제 효과 계산
        const householdSavings = participatingHouseholds * EFFECTS.costPerHousehold * operationFactor;
        const operationCost = totalDevices * EFFECTS.operationCost * operationFactor;
        const netBenefit = householdSavings - operationCost;
        
        // 사회 효과 계산
        const digitalAccess = participatingHouseholds * 3; // 세대당 평균 3명
        const educationBenefit = Math.floor(participatingHouseholds * 0.3); // 30% 교육 혜택
        const disasterReadiness = community.households * 2.25; // 전체 인구 (세대당 2.25명)
        
        // 비교 효과 계산
        const treeEquivalent = Math.floor(co2Reduction * EFFECTS.treesPerTonCO2);
        const carEquivalent = Math.floor(co2Reduction * EFFECTS.carKmPerTonCO2);
        const householdElectricityEquivalent = Math.floor(energySavings / 250); // 가정당 월 250kWh 기준
        
        // 5년 누적 효과
        const cumulativeCO2 = co2Reduction * 5;
        const cumulativeWaste = wasteReduction * 5;
        const cumulativeEconomic = netBenefit * 5;
        
        // UI 업데이트
        updateResults({
            basics: {
                totalHouseholds: participatingHouseholds,
                totalDevices: totalDevices,
                gridNodes: gridNodes
            },
            environment: {
                wasteReduction: wasteReduction,
                co2Reduction: co2Reduction,
                energySavings: energySavings
            },
            economy: {
                householdSavings: householdSavings,
                operationCost: operationCost,
                netBenefit: netBenefit
            },
            society: {
                digitalAccess: digitalAccess,
                educationBenefit: educationBenefit,
                disasterReadiness: disasterReadiness
            },
            comparisons: {
                treeEquivalent: treeEquivalent,
                carEquivalent: carEquivalent,
                householdElectricityEquivalent: householdElectricityEquivalent
            },
            cumulative: {
                co2: cumulativeCO2,
                waste: cumulativeWaste,
                economic: cumulativeEconomic
            }
        });
        
        // 원형 진행률 차트 업데이트
        updateCircularCharts(co2Reduction, wasteReduction, netBenefit);
    }
    
    // 현재 입력 값 가져오기
    function getCurrentInputs() {
        const communitySize = document.getElementById('community-size');
        const participationRate = document.getElementById('participation-rate');
        const devicesPerHousehold = document.getElementById('devices-per-household');
        const operationMonths = document.getElementById('operation-months');
        
        if (!communitySize || !participationRate || !devicesPerHousehold || !operationMonths) {
            return null;
        }
        
        return {
            communitySize: communitySize.value,
            participationRate: parseInt(participationRate.value),
            devicesPerHousehold: parseInt(devicesPerHousehold.value),
            operationMonths: parseInt(operationMonths.value)
        };
    }
    
    // 결과 UI 업데이트
    function updateResults(results) {
        // 기본 현황
        updateElement('total-households', `${results.basics.totalHouseholds.toLocaleString()}세대`);
        updateElement('total-devices', `${results.basics.totalDevices.toLocaleString()}대`);
        updateElement('grid-nodes', `${results.basics.gridNodes}개`);
        
        // 환경 효과
        updateElement('waste-saved', `${results.environment.wasteReduction.toFixed(1)}톤`);
        updateElement('co2-saved', `${results.environment.co2Reduction.toFixed(1)}톤`);
        updateElement('energy-saved', `${Math.floor(results.environment.energySavings).toLocaleString()}kWh`);
        
        // 경제 효과  
        updateElement('household-savings', formatCurrency(results.economy.householdSavings));
        updateElement('operation-cost', formatCurrency(results.economy.operationCost));
        updateElement('net-benefit', formatCurrency(results.economy.netBenefit));
        
        // 사회 효과
        updateElement('digital-access', `${results.society.digitalAccess.toLocaleString()}명`);
        updateElement('education-benefit', `${results.society.educationBenefit.toLocaleString()}명`);
        updateElement('disaster-readiness', `${results.society.disasterReadiness.toLocaleString()}명`);
        
        // 비교 효과
        updateElement('tree-equivalent', `소나무 ${results.comparisons.treeEquivalent.toLocaleString()}그루를 심는 효과와 같음`);
        updateElement('car-equivalent', `자동차 ${results.comparisons.carEquivalent.toLocaleString()}km 운행 절약과 같음`);
        updateElement('household-equivalent', `일반 가정 ${results.comparisons.householdElectricityEquivalent.toLocaleString()}개월 전기료와 같음`);
        
        // 5년 누적 효과
        updateElement('cumulative-co2', `${results.cumulative.co2.toFixed(1)}톤`);
        updateElement('cumulative-waste', `${results.cumulative.waste.toFixed(1)}톤`);
        updateElement('cumulative-economic', formatCurrency(results.cumulative.economic));
    }
    
    // 화폐 형식 변환
    function formatCurrency(amount) {
        if (amount >= 100000000) {  // 1억 이상
            const billions = Math.floor(amount / 100000000);
            const millions = Math.floor((amount % 100000000) / 10000);
            if (millions > 0) {
                return `${billions}억 ${millions.toLocaleString()}만원`;
            } else {
                return `${billions}억원`;
            }
        } else if (amount >= 10000) {  // 1만 이상
            return `${Math.floor(amount / 10000).toLocaleString()}만원`;
        } else {
            return `${amount.toLocaleString()}원`;
        }
    }
    
    // 요소 업데이트 헬퍼 함수
    function updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }
    
    // 원형 진행률 차트 업데이트
    function updateCircularCharts(co2, waste, economic) {
        // 기준값 설정 (중간 규모 기준)
        const maxValues = {
            co2: 30,      // 톤
            waste: 100,   // 톤  
            economic: 500000000 // 5억원
        };
        
        // 백분율 계산
        const co2Percentage = Math.min((co2 / maxValues.co2) * 100, 100);
        const wastePercentage = Math.min((waste / maxValues.waste) * 100, 100);
        const economicPercentage = Math.min((economic / maxValues.economic) * 100, 100);
        
        // 원형 차트 업데이트
        updateCircleProgress('co2-circle', 'co2-percentage', co2Percentage);
        updateCircleProgress('waste-circle', 'waste-percentage', wastePercentage);
        updateCircleProgress('economic-circle', 'economic-percentage', economicPercentage);
    }
    
    // 개별 원형 차트 업데이트
    function updateCircleProgress(circleId, percentageId, percentage) {
        const circle = document.getElementById(circleId);
        const percentageElement = document.getElementById(percentageId);
        
        if (circle && percentageElement) {
            const radius = 10;
            const circumference = 2 * Math.PI * radius;
            const strokeDasharray = circumference;
            const strokeDashoffset = circumference - (percentage / 100) * circumference;
            
            circle.style.strokeDasharray = strokeDasharray;
            circle.style.strokeDashoffset = strokeDashoffset;
            percentageElement.textContent = `${Math.round(percentage)}%`;
        }
    }
    
    // 계산기 초기화 호출
    initializeCalculator();
}

// 폼 핸들러 설정
function setupFormHandlers() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 기본적인 폼 유효성 검사
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('border-red-500');
                    isValid = false;
                } else {
                    input.classList.remove('border-red-500');
                }
            });
            
            if (isValid) {
                // 성공 메시지 표시
                showNotification('메시지가 성공적으로 전송되었습니다!', 'success');
                form.reset();
            } else {
                showNotification('모든 필수 필드를 채워주세요.', 'error');
            }
        });
    });
}

// 알림 메시지 표시
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white transform translate-x-full transition-transform duration-300`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 등장
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 툴팁 설정
function setupTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.classList.add('tooltip');
    });
}

// 이미지 지연 로딩
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        img.classList.add('lazy-img');
        imageObserver.observe(img);
    });
}

// 네비게이션 바 스크롤 효과
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('shadow-xl');
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
    } else {
        nav.classList.remove('shadow-xl');
        nav.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    }
});

// 화면 크기 변경 감지
window.addEventListener('resize', function() {
    // 화면 크기가 변경될 때 모바일 메뉴 상태 재설정
    const mobileMenu = document.getElementById('mobile-menu');
    if (window.innerWidth >= 768 && mobileMenu) {
        mobileMenu.classList.add('hidden');
    }
});

// 성능 최적화를 위한 디바운스 함수
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 디바운스가 적용된 리사이즈 이벤트
const debouncedResize = debounce(function() {
    // 리사이즈 시 애니메이션 재계산
    setupAnimationsOnScroll();
}, 250);

window.addEventListener('resize', debouncedResize);

// 다크 모드 토글 (선택사항)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 다크 모드 설정 로드
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// 스크롤 위치 저장 및 복원
window.addEventListener('beforeunload', function() {
    localStorage.setItem('scrollPosition', window.scrollY);
});

window.addEventListener('load', function() {
    const savedScrollPosition = localStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
        window.scrollTo(0, parseInt(savedScrollPosition));
        localStorage.removeItem('scrollPosition');
    }
});

// 디버그 모드 (개발 시에만 사용)
const DEBUG_MODE = false;

if (DEBUG_MODE) {
    console.log('NeighborGrid 웹사이트가 성공적으로 로드되었습니다.');
    console.log('히어로 슬라이더가 완전히 구현되었습니다.');
    
    // 성능 모니터링
    window.addEventListener('load', function() {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`페이지 로드 시간: ${loadTime}ms`);
    });
}