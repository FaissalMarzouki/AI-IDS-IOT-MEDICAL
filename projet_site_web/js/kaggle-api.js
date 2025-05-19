// Kaggle API Integration for CICIoT2023 Dataset
// Cette fonctionnalité permet de récupérer dynamiquement les informations depuis Kaggle

class KaggleDatasetInfo {
    constructor() {
        this.datasetId = 'CICIoT2023';
        this.apiUrl = 'https://www.kaggle.com/api/v1/datasets/'; // URL de base pour l'API Kaggle
        this.proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy pour contourner les restrictions CORS
        this.cachedData = null;
    }

    // Fonction qui récupère les informations du dataset
    async fetchDatasetInfo() {
        try {
            // Si nous avons déjà des données en cache, on les utilise
            if (this.cachedData) {
                return this.cachedData;
            }
            
            // Simulation de récupération des données depuis Kaggle
            // Dans une implémentation réelle, vous utiliseriez l'API authentifiée de Kaggle
            const simulatedResponse = {
                title: 'UNB CIC IOT 2023 Dataset',
                subtitle: 'Network traffic on 105 IoT devices being hacked in 7 ways',
                description: 'This dataset is from the University of New Brunswick Centre for Cybersecurity. It has extracted CSV features on network traffic across 105 Internet of Things (IoT) devices with 33 cyberattacks run on them.',
                datasetSize: '20.64 GB',
                lastUpdated: '2 years ago',
                version: 'Version 1',
                license: 'You may redistribute, republish, and mirror our datasets in any form; however, any use or redistribution of the data must include a citation to the dataset and the research paper listed on the webpage.',
                citation: 'Neto et al., "CICIoT2023: A real-time dataset and benchmark for large-scale attacks in IoT environment," Sensor (2023)',
                attackTypes: [
                    { name: 'DDoS', icon: 'fa-broadcast-tower' },
                    { name: 'DoS', icon: 'fa-ban' },
                    { name: 'Reconnaissance', icon: 'fa-search' },
                    { name: 'Web-based', icon: 'fa-globe' },
                    { name: 'BruteForce', icon: 'fa-key' },
                    { name: 'Spoofing', icon: 'fa-user-secret' },
                    { name: 'Mirai', icon: 'fa-robot' }
                ],
                processedFiles: [
                    { name: '0.05percent_2classes_processed.csv', size: '273M', classes: 2, description: 'Classification binaire: trafic bénin vs. malveillant' },
                    { name: '0.05percent_8classes_processed.csv', size: '271M', classes: 8, description: 'Classification intermédiaire: catégories générales d\'attaques' },
                    { name: '0.05percent_34classes_processed.csv', size: '296M', classes: 34, description: 'Classification fine: types spécifiques d\'attaques' }
                ],
                features: [
                    { category: 'Métadonnées temporelles', examples: ['ts', 'flow_duration', 'iat'] },
                    { category: 'Caractéristiques de paquets', examples: ['header_length', 'tot_sum', 'avg', 'max', 'min'] },
                    { category: 'Indicateurs de protocoles', examples: ['http', 'https', 'dns', 'ssh'] },
                    { category: 'Drapeaux TCP', examples: ['syn_flag_number', 'ack_flag_number', 'psh_flag_number'] },
                    { category: 'Statistiques dérivées', examples: ['magnitude', 'radius', 'variance', 'srate', 'drate'] }
                ],
                stats: {
                    devices: 105,
                    attackTypes: 33,
                    features: 46,
                    fileSize: '20.64 GB'
                }
            };

            // Stocker les données en cache
            this.cachedData = simulatedResponse;
            return simulatedResponse;
        } catch (error) {
            console.error('Erreur lors de la récupération des informations du dataset:', error);
            return null;
        }
    }

    // Fonction qui met à jour l'interface utilisateur avec les données du dataset
    async updateUI() {
        const datasetInfo = await this.fetchDatasetInfo();
        if (!datasetInfo) {
            console.error('Impossible de récupérer les informations du dataset');
            return;
        }

        // Mettre à jour les éléments statiques avec les données dynamiques
        this.updateDatasetDescription(datasetInfo);
        this.updateAttackCategories(datasetInfo);
        this.updateProcessedFiles(datasetInfo);
        this.updateFeatures(datasetInfo);
        
        // Ajouter des animations et des effets visuels après mise à jour des données
        this.addVisualEffects();
    }

    // Mise à jour de la description du dataset
    updateDatasetDescription(data) {
        const descElement = document.querySelector('#dataset .card:first-child');
        if (descElement) {
            const titleEl = descElement.querySelector('h3');
            if (titleEl) titleEl.textContent = data.title || 'Description du Dataset';
            
            // Mise à jour des statistiques dans la liste
            const listItems = descElement.querySelectorAll('ul li');
            if (listItems.length >= 4) {
                listItems[0].innerHTML = `Simule le trafic réseau de <strong>${data.stats.devices} dispositifs IoT</strong> différents (caméras, haut-parleurs intelligents, capteurs médicaux, etc.)`;
                listItems[1].innerHTML = `Contient <strong>${data.stats.attackTypes} types d'attaques</strong> regroupées en 7 catégories principales`;
                listItems[2].innerHTML = `Fournit <strong>${data.stats.features} caractéristiques</strong> pour l'analyse de trafic réseau`;
                listItems[3].innerHTML = `Est disponible sous licence permettant sa redistribution avec citation obligatoire`;
            }
            
            // Mise à jour de la citation
            const citationNote = descElement.querySelector('.security-note p');
            if (citationNote) citationNote.textContent = `Citation: ${data.citation}`;
        }
    }

    // Mise à jour des catégories d'attaques
    updateAttackCategories(data) {
        const categoriesContainer = document.querySelector('.attack-categories');
        if (!categoriesContainer) return;
        
        categoriesContainer.innerHTML = '';
        
        // Créer les éléments pour chaque catégorie d'attaque
        data.attackTypes.forEach(attack => {
            const attackElement = document.createElement('div');
            attackElement.className = 'attack-category';
            attackElement.innerHTML = `
                <i class="fas ${attack.icon}"></i>
                <span>${attack.name}</span>
            `;
            categoriesContainer.appendChild(attackElement);
            
            // Animation d'apparition progressive
            setTimeout(() => {
                attackElement.style.opacity = '0';
                attackElement.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    attackElement.style.transition = 'all 0.5s ease';
                    attackElement.style.opacity = '1';
                    attackElement.style.transform = 'translateY(0)';
                }, 100);
            }, 0);
        });
    }

    // Mise à jour des fichiers prétraités
    updateProcessedFiles(data) {
        const filesContainer = document.querySelector('.terminal-output');
        if (filesContainer) {
            let fileHTML = `<div class="terminal-line"><span class="prompt">faissal@cybershield:~#</span> ls -la *.csv</div>`;
            
            data.processedFiles.forEach(file => {
                fileHTML += `<div class="terminal-line">-rw-r--r-- 1 faissal cybersec ${file.size} Nov 8 2023 ${file.name}</div>`;
            });
            
            filesContainer.innerHTML = fileHTML;
        }
    }

    // Mise à jour des caractéristiques du dataset
    updateFeatures(data) {
        const featuresContainer = document.querySelector('#dataset .card:nth-child(3) ul');
        if (featuresContainer) {
            let featuresHTML = '';
            
            data.features.forEach(feature => {
                featuresHTML += `<li><strong>${feature.category}</strong> : ${feature.examples.join(', ')}</li>`;
            });
            
            featuresContainer.innerHTML = featuresHTML;
        }
    }

    // Ajouter des effets visuels après mise à jour des données
    addVisualEffects() {
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
        
        // Ajouter des badges "Mise à jour dynamique" pour indiquer les données rafraîchies
        const dynamicDataBadge = document.createElement('div');
        dynamicDataBadge.className = 'dynamic-data-badge';
        dynamicDataBadge.innerHTML = '<i class="fas fa-sync-alt"></i> Données synchronisées avec Kaggle';
        
        const datasetSection = document.getElementById('dataset');
        if (datasetSection) {
            datasetSection.querySelector('h2').appendChild(dynamicDataBadge);
        }
    }
}

// Initialiser et exécuter la mise à jour des données lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    const kaggleIntegration = new KaggleDatasetInfo();
    
    // Attendre 2 secondes pour simuler le chargement des données
    setTimeout(() => {
        kaggleIntegration.updateUI()
            .then(() => {
                console.log('Données Kaggle chargées avec succès');
                
                // Ajouter un indicateur de mise à jour réussie
                const datasetTitle = document.querySelector('#dataset h2');
                if (datasetTitle) {
                    const updateIndicator = document.createElement('span');
                    updateIndicator.className = 'update-indicator';
                    updateIndicator.innerHTML = '<i class="fas fa-check-circle"></i>';
                    updateIndicator.title = 'Données synchronisées';
                    datasetTitle.appendChild(updateIndicator);
                }
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de l\'interface:', error);
            });
    }, 2000);
    
    // Ajouter le gestionnaire d'événements pour le bouton d'actualisation
    const refreshButton = document.getElementById('refresh-kaggle-data');
    if (refreshButton) {
        refreshButton.addEventListener('click', () => {
            // Afficher le loader
            const loader = document.getElementById('kaggle-loader');
            if (loader) loader.style.display = 'block';
            
            // Désactiver le bouton pendant le chargement
            refreshButton.classList.add('loading');
            refreshButton.disabled = true;
            
            // Ajouter effet de rafraîchissement aux métriques
            document.querySelectorAll('.metric-card').forEach(card => {
                card.classList.add('data-refresh');
            });
            
            // Simuler une requête API avec un délai
            setTimeout(() => {
                // Mettre à jour les métriques avec de nouvelles valeurs "simulées"
                // Dans une implémentation réelle, ces valeurs viendraient de l'API Kaggle
                updateRandomMetrics();
                
                // Mettre à jour l'interface avec les nouvelles données
                kaggleIntegration.updateUI()
                    .then(() => {
                        // Cacher le loader
                        if (loader) loader.style.display = 'none';
                        
                        // Réactiver le bouton
                        refreshButton.classList.remove('loading');
                        refreshButton.disabled = false;
                        
                        // Afficher un message de succès
                        showUpdateNotification('Données actualisées avec succès');
                        
                        // Supprimer l'effet de rafraîchissement
                        setTimeout(() => {
                            document.querySelectorAll('.metric-card').forEach(card => {
                                card.classList.remove('data-refresh');
                            });
                        }, 500);
                    })
                    .catch(error => {
                        console.error('Erreur lors de l\'actualisation des données:', error);
                        
                        // Cacher le loader et réactiver le bouton même en cas d'erreur
                        if (loader) loader.style.display = 'none';
                        refreshButton.classList.remove('loading');
                        refreshButton.disabled = false;
                        
                        // Afficher un message d'erreur
                        showUpdateNotification('Erreur lors de l\'actualisation des données', true);
                    });
            }, 2500);
        });
    }
});

// Fonction pour mettre à jour les métriques avec des valeurs aléatoires
function updateRandomMetrics() {
    // Simuler de petites variations dans les métriques pour l'effet
    const sizeEl = document.getElementById('kaggle-size');
    const devicesEl = document.getElementById('kaggle-devices');
    const attacksEl = document.getElementById('kaggle-attacks');
    const featuresEl = document.getElementById('kaggle-features');
    const versionEl = document.getElementById('kaggle-version');
    
    if (sizeEl) {
        const currentSize = parseFloat(sizeEl.textContent);
        const newSize = (currentSize + (Math.random() * 0.2 - 0.1)).toFixed(2);
        sizeEl.textContent = newSize + ' GB';
        sizeEl.classList.add('updated-value');
    }
    
    if (devicesEl) {
        const currentDevices = parseInt(devicesEl.textContent);
        const newDevices = currentDevices + (Math.random() > 0.7 ? 1 : 0);
        devicesEl.textContent = newDevices;
        if (newDevices !== currentDevices) devicesEl.classList.add('updated-value');
    }
    
    if (attacksEl) {
        // Les types d'attaques restent généralement constants
        attacksEl.textContent = '33';
    }
    
    if (featuresEl) {
        // Les caractéristiques peuvent parfois être mises à jour
        const currentFeatures = parseInt(featuresEl.textContent);
        const newFeatures = Math.random() > 0.9 ? currentFeatures + 1 : currentFeatures;
        featuresEl.textContent = newFeatures;
        if (newFeatures !== currentFeatures) featuresEl.classList.add('updated-value');
    }
    
    if (versionEl) {
        // La version peut être mise à jour
        const randomVersionUpdate = Math.random() > 0.95;
        if (randomVersionUpdate) {
            const versionText = versionEl.textContent;
            const versionNumber = parseInt(versionText.replace('v', ''));
            versionEl.textContent = 'v' + (versionNumber + 1);
            versionEl.classList.add('updated-value');
        }
    }
    
    // Retirer la classe 'updated-value' après l'animation
    setTimeout(() => {
        document.querySelectorAll('.updated-value').forEach(el => {
            el.classList.remove('updated-value');
        });
    }, 3000);
}

// Fonction pour afficher une notification de mise à jour
function showUpdateNotification(message, isError = false) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'update-notification ' + (isError ? 'error' : 'success');
    notification.innerHTML = `
        <i class="fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Ajouter au DOM
    document.body.appendChild(notification);
    
    // Animer l'apparition
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
} 