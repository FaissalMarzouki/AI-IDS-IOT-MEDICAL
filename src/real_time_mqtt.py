import os
import time
from datetime import datetime
import streamlit as st

class RealTimeMQTTDetection:
    def __init__(self, mqtt_monitor, models, scalers):
        self.mqtt_monitor = mqtt_monitor
        self.models = models
        self.scalers = scalers
        self.running = True
        self.models_available = True
        self.last_update_time = time.time()
        self.traffic_data = []
        self.attack_packets = 0
        self.normal_packets = 0
        self.detected_attacks = 0
        self.attacks_by_type = {}
        self.detection_results = []

    def _analysis_loop(self, interval):
        """
        Boucle d'analyse qui traite les captures MQTT et effectue les détections
        """
        capture_dir = self.mqtt_monitor.capture_dir
        processed_files = set()
        
        # Avertir si les modèles ne sont pas disponibles
        if not self.models_available:
            print("Avertissement: Les modèles ne sont pas disponibles. Utilisation des valeurs par défaut pour les prédictions.")
        
        while self.running:
            # Trouver les nouveaux fichiers de capture
            current_files = []
            if os.path.exists(capture_dir):
                current_files = [
                    os.path.join(capture_dir, f) for f in os.listdir(capture_dir) 
                    if f.endswith(".pcap") and os.path.join(capture_dir, f) not in processed_files
                ]
            
            for pcap_file in current_files:
                if not os.path.exists(pcap_file) or os.path.getsize(pcap_file) == 0:
                    processed_files.add(pcap_file)
                    continue
                
                try:
                    # Extraire les caractéristiques
                    features_df = extract_features_from_pcap(pcap_file)
                    
                    if not features_df.empty:
                        # Prétraiter les données
                        preprocessed_data = preprocess_data(features_df)
                        
                        # Effectuer uniquement la prédiction multiclasse
                        multiclass_result = predict(preprocessed_data, self.models['multiclass'], self.scalers['multiclass'], 'multiclass')
                        
                        # Déterminer s'il s'agit d'une attaque ou non (tout ce qui n'est pas 'Benign' est une attaque)
                        is_attack = multiclass_result['prediction_class'] != 'Benign'
                        
                        # Mettre à jour les compteurs
                        n_flows = len(features_df)
                        
                        if is_attack:
                            # Mettre à jour les compteurs
                            self.attack_packets += n_flows
                            self.detected_attacks += 1
                            
                            attack_type = multiclass_result['prediction_class']
                            if attack_type in self.attacks_by_type:
                                self.attacks_by_type[attack_type] += 1
                            
                            # Ajouter à l'historique
                            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            detection_result = {
                                'timestamp': timestamp,
                                'source': 'MQTT en temps réel',
                                'samples': n_flows,
                                'binary_result': 'Attaque détectée',
                                'prediction_class': attack_type,
                                'confidence': multiclass_result['confidence']
                            }
                            
                            # Ajouter à l'historique de session
                            if 'detection_history' in st.session_state:
                                st.session_state.detection_history.append(detection_result)
                            
                            # Ajouter aux résultats locaux
                            self.detection_results.append(detection_result)
                        else:
                            self.normal_packets += n_flows
                        
                        # Mettre à jour les données de trafic pour les graphiques
                        current_time = time.time()
                        elapsed_time = current_time - self.last_update_time
                        
                        self.traffic_data.append({
                            "time": elapsed_time, 
                            "normal": self.normal_packets, 
                            "attack": self.attack_packets
                        })
                
                except Exception as e:
                    print(f"Erreur lors de l'analyse du fichier {pcap_file}: {e}")
                
                # Marquer le fichier comme traité
                processed_files.add(pcap_file)
            
            # Pause pour éviter une utilisation CPU excessive
            time.sleep(1) 