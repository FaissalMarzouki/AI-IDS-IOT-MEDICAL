def predict(data, model, scaler, model_type='binary'):
    """
    Effectue des prédictions avec le modèle spécifié
    
    Args:
        data: DataFrame contenant les données à prédire
        model: Modèle à utiliser pour les prédictions
        scaler: Scaler à utiliser pour normaliser les données
        model_type: Type de modèle ('binary' ou 'multiclass')
        
    Returns:
        Dictionnaire contenant les résultats de la prédiction
    """
    # Normaliser les données
    scaled_data = scaler.transform(data)
    
    # Vérifier si le modèle est disponible
    if model is None:
        print(f"Avertissement: Modèle {model_type} non disponible, retour de valeurs par défaut")
        if model_type == 'binary':
            # Valeurs par défaut pour le modèle binaire
            return {
                'has_attack': False,
                'attack_ratio': 0,
                'confidence': 0
            }
        else:
            # Valeurs par défaut pour le modèle multiclasses
            return {
                'prediction_class': 'Inconnu',
                'confidence': 0,
                'class_distribution': {
                    'Benign': 1.0,
                    'DDoS': 0,
                    'DoS': 0,
                    'Reconnaissance': 0,
                    'Web': 0,
                    'BruteForce': 0,
                    'Spoofing': 0,
                    'Mirai': 0
                }
            }
    
    # Prédictions avec le modèle
    print(f"Prédiction avec le modèle {model_type} réel sur {len(data)} échantillons")
    
    if model_type == 'binary':
        # Pour le modèle binaire
        predictions = model.predict(scaled_data)
        probabilities = model.predict_proba(scaled_data)
        
        # Calculer la proportion d'attaques
        attack_ratio = np.mean(predictions == 1)
        
        # Calculer la confiance moyenne
        confidence = np.mean(np.max(probabilities, axis=1)) * 100
        
        print(f"Résultat binaire: {attack_ratio*100:.2f}% des échantillons classés comme attaques, confiance moyenne: {confidence:.2f}%")
        
        return {
            'has_attack': attack_ratio > 0.5,
            'attack_ratio': attack_ratio,
            'confidence': confidence
        }
    else:
        # Pour le modèle multiclasses
        predictions = model.predict(scaled_data)
        probabilities = model.predict_proba(scaled_data)
        
        # Mapper les indices de classe vers des noms plus descriptifs
        class_names = {
            0: 'Benign',
            1: 'DDoS',
            2: 'DoS',
            3: 'Reconnaissance',
            4: 'Web',
            5: 'BruteForce',
            6: 'Spoofing',
            7: 'Mirai'
        }
        
        # Définir les poids des classes pour équilibrer les prédictions
        # Ces poids sont inversement proportionnels à la fréquence de chaque classe
        class_weights = {
            'DDoS': 1.0,
            'DoS': 4.217345664488805,
            'Mirai': 12.836500853853368,
            'Benign': 31.061183684350862,
            'Spoofing': 68.8392909896603,
            'Recon': 95.61797291752158,
            'Web': 1429.5766871165652,
            'BruteForce': 2709.5466116279092
        }
        
        # Initialiser le dictionnaire de distribution avec toutes les classes à 0
        class_distribution = {name: 0.0 for name in class_names.values()}
        
        # Calculer la distribution moyenne par classe sur tous les échantillons
        avg_probabilities = np.mean(probabilities, axis=0)
        
        # Appliquer les poids pour équilibrer les prédictions
        # Multiplier les probabilités moyennes par les poids pour favoriser les classes rares
        weighted_probabilities = np.zeros_like(avg_probabilities)
        for i, prob in enumerate(avg_probabilities):
            if i < len(class_names):
                class_name = class_names.get(i, f"Class_{i}")
                # Remplacer 'Recon' par 'Reconnaissance' pour correspondre aux noms
                weight_key = 'Reconnaissance' if class_name == 'Reconnaissance' else class_name
                weight = class_weights.get(weight_key, 1.0)
                weighted_probabilities[i] = prob * weight
                class_distribution[class_name] = prob
        
        # Obtenir la classe la plus fréquente basée sur les prédictions pondérées
        most_common_class_idx = np.argmax(weighted_probabilities)
        prediction_class = class_names.get(most_common_class_idx, f"Class_{most_common_class_idx}")
        
        # Calculer la confiance moyenne
        max_probs = np.max(probabilities, axis=1)
        confidence = np.mean(max_probs) * 100
        
        print(f"Résultat multiclasse: classe principale {prediction_class} ({avg_probabilities[most_common_class_idx]*100:.2f}%), confiance moyenne: {confidence:.2f}%")
        print(f"Distribution des probabilités: {', '.join([f'{name}: {prob*100:.2f}%' for name, prob in class_distribution.items() if prob > 0.01])}")
        print(f"Après pondération: classe principale {prediction_class}")
        
        return {
            'prediction_class': prediction_class,
            'confidence': confidence,
            'class_distribution': class_distribution
        } 