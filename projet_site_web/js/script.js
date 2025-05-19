// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter des effets de scroll fluide pour la navigation
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Créer le graphique des résultats avec couleurs hacker
    createHackerResultsChart();
    
    // Ajouter effet de type terminal
    addTerminalEffect();
    
    // Ajouter effet de glitch sur le titre
    addGlitchEffect();
    
    // Ajouter effet de matrice
    createMatrixEffect();
    
    // Ajouter des effets pour la section dataset
    addDatasetEffects();
});

// Fonction pour créer le graphique des résultats avec Chart.js (style hacker)
function createHackerResultsChart() {
    const ctx = document.getElementById('resultsChart');
    
    if (!ctx) return; // Sortir si l'élément n'existe pas
    
    // Définir le thème hacker pour Chart.js
    Chart.defaults.color = '#00ff41';
    Chart.defaults.borderColor = 'rgba(0, 255, 65, 0.2)';
    
    // Données extraites du tableau
    const data = {
        labels: ['Random Forest', 'Gradient Boosting', 'RF-Bagging', 'KNN', 'LogReg'],
        datasets: [
            {
                label: 'Accuracy',
                data: [99.29, 99.04, 90.65, 93.20, 78.36],
                backgroundColor: 'rgba(0, 255, 65, 0.7)',
                borderColor: '#00ff41',
                borderWidth: 1
            },
            {
                label: 'Recall',
                data: [71.12, 81.55, 64.87, 58.05, 41.63],
                backgroundColor: 'rgba(0, 210, 55, 0.7)',
                borderColor: '#00d237',
                borderWidth: 1
            },
            {
                label: 'Precision',
                data: [75.48, 82.87, 55.34, 62.54, 50.19],
                backgroundColor: 'rgba(0, 165, 45, 0.7)',
                borderColor: '#00a52d',
                borderWidth: 1
            },
            {
                label: 'F1-Score',
                data: [71.93, 81.77, 53.10, 58.96, 40.91],
                backgroundColor: 'rgba(0, 120, 35, 0.7)',
                borderColor: '#007823',
                borderWidth: 1
            }
        ]
    };

    // Configuration du graphique
    const config = {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#00ff41',
                        font: {
                            family: 'Courier New'
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'ANALYSE DES PERFORMANCES DES MODÈLES',
                    color: '#00ff41',
                    font: {
                        family: 'Courier New',
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 255, 65, 0.1)'
                    },
                    ticks: {
                        color: '#00ff41',
                        font: {
                            family: 'Courier New'
                        }
                    },
                    title: {
                        display: true,
                        text: 'POURCENTAGE (%)',
                        color: '#00ff41',
                        font: {
                            family: 'Courier New'
                        }
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(0, 255, 65, 0.1)'
                    },
                    ticks: {
                        color: '#00ff41',
                        font: {
                            family: 'Courier New'
                        }
                    },
                    title: {
                        display: true,
                        text: 'ALGORITHMES',
                        color: '#00ff41',
                        font: {
                            family: 'Courier New'
                        }
                    }
                }
            }
        }
    };

    // Créer le graphique
    new Chart(ctx, config);
}

// Effet de saisie de terminal pour les titres de section
function addTerminalEffect() {
    // Appliquer l'effet aux titres h3
    document.querySelectorAll('.card h3').forEach(heading => {
        const originalText = heading.innerText;
        heading.innerHTML = ''; // Vider le contenu
        
        // Créer un wrapper pour l'animation
        const wrapper = document.createElement('span');
        wrapper.className = 'terminal-text';
        heading.appendChild(wrapper);
        
        // Ajouter un curseur clignotant
        const cursor = document.createElement('span');
        cursor.className = 'cursor';
        cursor.innerHTML = '&#9608;'; // Bloc unicode
        cursor.style.color = '#00ff41';
        cursor.style.animation = 'blink 1s step-end infinite';
        
        // Texte avec préfixe de terminal
        const prefix = document.createElement('span');
        prefix.textContent = '> ';
        prefix.style.color = '#00ff41';
        wrapper.appendChild(prefix);
        
        // Texte à taper
        const textElement = document.createElement('span');
        wrapper.appendChild(textElement);
        wrapper.appendChild(cursor);
        
        // Animation de saisie
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < originalText.length) {
                textElement.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 50);
    });
    
    // Ajouter le style pour le curseur clignotant
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Effet de glitch pour le titre principal
function addGlitchEffect() {
    const headerTitle = document.querySelector('header h1');
    if (!headerTitle) return;
    
    const originalText = headerTitle.innerText;
    
    // Créer la structure pour l'effet de glitch
    headerTitle.innerHTML = `
        <span class="glitch-wrapper">
            <span class="glitch" data-text="${originalText}">${originalText}</span>
        </span>
    `;
    
    // Ajouter le style CSS pour l'effet de glitch
    const style = document.createElement('style');
    style.innerHTML = `
        .glitch-wrapper {
            position: relative;
            display: inline-block;
        }
        
        .glitch {
            position: relative;
            display: inline-block;
            color: #00ff41;
        }
        
        .glitch::before,
        .glitch::after {
            content: attr(data-text);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #00ff41;
        }
        
        .glitch::before {
            left: 2px;
            text-shadow: -1px 0 #00aaff;
            animation: glitch-anim-1 2s infinite linear alternate-reverse;
        }
        
        .glitch::after {
            left: -2px;
            text-shadow: 1px 0 #ff00aa;
            animation: glitch-anim-2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim-1 {
            0% { clip-path: inset(20% 0 80% 0); }
            20% { clip-path: inset(60% 0 40% 0); }
            40% { clip-path: inset(40% 0 60% 0); }
            60% { clip-path: inset(80% 0 20% 0); }
            80% { clip-path: inset(10% 0 90% 0); }
            100% { clip-path: inset(70% 0 30% 0); }
        }
        
        @keyframes glitch-anim-2 {
            0% { clip-path: inset(10% 0 90% 0); }
            25% { clip-path: inset(30% 0 70% 0); }
            50% { clip-path: inset(50% 0 50% 0); }
            75% { clip-path: inset(70% 0 30% 0); }
            100% { clip-path: inset(90% 0 10% 0); }
        }
    `;
    document.head.appendChild(style);
    
    // Déclencher l'effet de glitch aléatoirement
    setInterval(() => {
        headerTitle.classList.add('active-glitch');
        setTimeout(() => {
            headerTitle.classList.remove('active-glitch');
        }, 200);
    }, 3000);
}

// Effet de pluie de matrice en arrière-plan
function createMatrixEffect() {
    // Créer un canvas pour l'effet de matrice
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.className = 'matrix-canvas';
    matrixCanvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.1;
        pointer-events: none;
    `;
    document.body.appendChild(matrixCanvas);
    
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    
    // Caractères pour l'effet matrice
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const columns = matrixCanvas.width / 15;
    const drops = [];
    
    // Initialiser les gouttes
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -20) - 50;
    }
    
    // Dessiner l'effet matrice
    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        
        ctx.fillStyle = '#00ff41';
        ctx.font = '15px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            // Sélection aléatoire d'un caractère
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            
            // Position x calculée par l'index * largeur des caractères
            const x = i * 15;
            // Position y par la valeur dans l'array des gouttes
            const y = drops[i] * 20;
            
            ctx.fillText(text, x, y);
            
            // Envoyer la goutte de nouveau au début après avoir dépassé l'écran
            // Ajout de randomisation pour rendre l'effet plus naturel
            if (y > matrixCanvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            
            // Déplacer les gouttes plus bas
            drops[i]++;
        }
    }
    
    // Mettre à jour la taille du canvas lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
    });
    
    // Lancer l'animation
    setInterval(drawMatrix, 80);
}

// Animation des sections au défilement
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight - 100) {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }
    });
});

// Ajouter une classe active au lien de navigation actuel
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 100 && 
            window.pageYOffset < sectionTop + sectionHeight - 100) {
            currentSection = '#' + section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSection) {
            link.classList.add('active');
        }
    });
});

// Ajouter un effet de distortion au survol des cartes
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        // Ajouter un effet de bruit sur le bord
        card.style.boxShadow = '0 0 15px rgba(0, 255, 65, 0.6)';
        card.style.borderColor = '#00ff41';
    });
    
    card.addEventListener('mouseout', () => {
        // Remettre le style normal
        card.style.boxShadow = '';
        card.style.borderColor = '';
    });
});

// Fonction pour ajouter des effets à la section dataset
function addDatasetEffects() {
    // Animation pour les catégories d'attaques
    const attackCategories = document.querySelectorAll('.attack-category');
    if (attackCategories.length > 0) {
        attackCategories.forEach((category, index) => {
            category.style.opacity = '0';
            category.style.transform = 'translateY(20px)';
            
            // Animation avec délai progressif
            setTimeout(() => {
                category.style.transition = 'all 0.5s ease';
                category.style.opacity = '1';
                category.style.transform = 'translateY(0)';
            }, 100 * index);
        });
    }
    
    // Animation pour les défis
    const challenges = document.querySelectorAll('.challenge');
    if (challenges.length > 0) {
        // Observer pour animer les éléments au scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        challenges.forEach(challenge => {
            challenge.style.opacity = '0';
            challenge.style.transform = 'translateY(30px)';
            challenge.style.transition = 'all 0.7s ease';
            
            observer.observe(challenge);
            
            // Définir la classe active
            challenge.addEventListener('transitionend', () => {
                challenge.style.removeProperty('opacity');
                challenge.style.removeProperty('transform');
            });
        });
        
        // Style pour les éléments actifs
        const style = document.createElement('style');
        style.innerHTML = `
            .challenge.active {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Effet de typing pour le texte d'observation
    const observation = document.querySelector('.observation.matrix-effect');
    if (observation) {
        const originalText = observation.textContent;
        observation.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < originalText.length) {
                observation.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 30);
    }
} 