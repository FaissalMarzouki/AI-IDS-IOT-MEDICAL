# Fonction pour analyser un fichier CSV de trafic
def analyze_traffic_file(uploaded_file, models, scalers):
    # Lire le fichier
    df = pd.read_csv(uploaded_file)
    
    # Afficher les statistiques du jeu de données
    display_dataset_stats(df)
    
    # Prétraiter les données
    preprocessed_data = preprocess_data(df)
    
    # Effectuer la prédiction seulement avec le modèle multiclasse
    multiclass_result = predict(preprocessed_data, models['multiclass'], scalers['multiclass'], 'multiclass')
    
    # Déterminer s'il s'agit d'une attaque ou non (tout ce qui n'est pas 'Benign' est une attaque)
    is_attack = multiclass_result['prediction_class'] != 'Benign'
    
    # Ajouter les résultats à l'historique
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    st.session_state.detection_history.append({
        'timestamp': timestamp,
        'source': uploaded_file.name,
        'samples': len(df),
        'binary_result': 'Attaque détectée' if is_attack else 'Trafic normal',
        'prediction_class': multiclass_result['prediction_class'],
        'confidence': multiclass_result['confidence']
    })
    
    # Afficher les résultats
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Détection de trafic")
        if is_attack:
            st.markdown(f"<div class='alert-danger'>⚠️ <strong>Attaque de type {multiclass_result['prediction_class']} détectée</strong> avec une confiance de {multiclass_result['confidence']:.2f}%</div>", unsafe_allow_html=True)
        else:
            st.markdown(f"<div class='alert-success'>✅ <strong>Trafic normal</strong> avec une confiance de {multiclass_result['confidence']:.2f}%</div>", unsafe_allow_html=True)
        
        # Afficher la jauge de confiance
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=multiclass_result['confidence'],
            title={"text": "Confiance de détection"},
            gauge={
                "axis": {"range": [0, 100]},
                "bar": {"color": "#FF4B4B" if is_attack else "#2ED47A"},
                "steps": [
                    {"range": [0, 50], "color": "#EBF5FB"},
                    {"range": [50, 75], "color": "#D6EAF8"},
                    {"range": [75, 100], "color": "#AED6F1"}
                ]
            }
        ))
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### Classification détaillée")
        
        # Afficher la distribution détaillée des classes
        st.write("Distribution détaillée des prédictions:")
        distribution_df = pd.DataFrame({
            'Type': list(multiclass_result['class_distribution'].keys()),
            'Probabilité (%)': [val*100 for val in multiclass_result['class_distribution'].values()]
        }).sort_values('Probabilité (%)', ascending=False)
        
        st.dataframe(distribution_df, use_container_width=True)
        
        # Graphique en barres des probabilités
        fig = px.bar(
            distribution_df,
            x='Type',
            y='Probabilité (%)',
            color='Probabilité (%)',
            color_continuous_scale='Viridis',
            title="Distribution des types de trafic"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    return df, None, multiclass_result 

def predict_single_packet(csv_text, models, scalers):
    """
    Analyse une ligne CSV unique pour la détection d'intrusion
    
    Args:
        csv_text: Texte CSV contenant les données d'un paquet unique
        models: Dictionnaire des modèles chargés
        scalers: Dictionnaire des scalers chargés
        
    Returns:
        Tuple (df, multiclass_result) contenant les données et résultats de prédiction
    """
    try:
        # Définir l'ordre correct des colonnes
        column_names = [
            "flow_duration", "header_length", "protocol_type", "duration", "rate", "srate", "drate", 
            "fin_flag_number", "syn_flag_number", "rst_flag_number", "psh_flag_number", "ack_flag_number", 
            "ece_flag_number", "cwr_flag_number", "ack_count", "syn_count", "fin_count", "urg_count", 
            "rst_count", "http", "https", "dns", "telnet", "smtp", "ssh", "irc", "tcp", "udp", "dhcp", 
            "arp", "icmp", "ipv", "llc", "tot_sum", "min", "max", "avg", "std", "tot_size", "iat", 
            "number", "radius", "covariance", "variance", "weight", "magnitude"
        ]
        
        # Nettoyer le texte d'entrée et diviser par espaces/tabulations
        cleaned_text = csv_text.strip()
        values = cleaned_text.split()
        
        # Vérifier si le nombre de valeurs correspond au nombre de colonnes attendues
        if len(values) != len(column_names):
            st.warning(f"Le nombre de valeurs ({len(values)}) ne correspond pas au nombre de colonnes attendu ({len(column_names)})")
            # Tenter d'ajuster en ajoutant des valeurs manquantes ou en tronquant
            if len(values) < len(column_names):
                values.extend(["0"] * (len(column_names) - len(values)))
            else:
                values = values[:len(column_names)]
        
        # Créer un dictionnaire pour associer les colonnes aux valeurs
        data_dict = {column: [value] for column, value in zip(column_names, values)}
        
        # Créer un DataFrame à partir du dictionnaire
        df = pd.DataFrame(data_dict)
        
        # Convertir les types de données (tous en float sauf protocol_type)
        for col in df.columns:
            if col != 'protocol_type':
                df[col] = pd.to_numeric(df[col], errors='coerce')
        
        # Prétraiter les données
        preprocessed_data = preprocess_data(df)
        
        # Effectuer la prédiction uniquement avec le modèle multiclasse
        multiclass_result = predict(preprocessed_data, models['multiclass'], scalers['multiclass'], 'multiclass')
        
        # Déterminer s'il s'agit d'une attaque ou non (tout ce qui n'est pas 'Benign' est une attaque)
        is_attack = multiclass_result['prediction_class'] != 'Benign'
        
        # Ajouter à l'historique des détections
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        history_entry = {
            'timestamp': timestamp,
            'source': 'Analyse de paquet unique',
            'is_attack': is_attack,
            'prediction_class': multiclass_result['prediction_class'],
            'confidence': multiclass_result['confidence']
        }
        
        st.session_state.detection_history.append(history_entry)
        
        return df, is_attack, multiclass_result
    
    except Exception as e:
        st.error(f"Erreur lors de l'analyse du paquet: {str(e)}")
        return None, None, None 

# Analyse du paquet
with st.spinner("Analyse du paquet en cours..."):
    df, is_attack, multiclass_result = predict_single_packet(csv_text, models, scalers)

if df is not None:
    # Afficher les résultats
    st.markdown("### Résultats de l'analyse")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("#### Détection de trafic")
        if is_attack:
            st.markdown(f"<div class='alert-danger'>⚠️ <strong>Attaque de type {multiclass_result['prediction_class']} détectée</strong> avec une confiance de {multiclass_result['confidence']:.2f}%</div>", unsafe_allow_html=True)
        else:
            st.markdown(f"<div class='alert-success'>✅ <strong>Trafic normal</strong> avec une confiance de {multiclass_result['confidence']:.2f}%</div>", unsafe_allow_html=True)
        
        # Afficher la jauge de confiance
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=multiclass_result['confidence'],
            title={"text": "Confiance de détection"},
            gauge={
                "axis": {"range": [0, 100]},
                "bar": {"color": "#FF4B4B" if is_attack else "#2ED47A"},
                "steps": [
                    {"range": [0, 50], "color": "#EBF5FB"},
                    {"range": [50, 75], "color": "#D6EAF8"},
                    {"range": [75, 100], "color": "#AED6F1"}
                ]
            }
        ))
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.markdown("#### Classification détaillée")
        
        # Afficher la distribution détaillée des classes
        st.write("Distribution détaillée des prédictions:")
        distribution_df = pd.DataFrame({
            'Type': list(multiclass_result['class_distribution'].keys()),
            'Probabilité (%)': [val*100 for val in multiclass_result['class_distribution'].values()]
        }).sort_values('Probabilité (%)', ascending=False)
        
        st.dataframe(distribution_df, use_container_width=True)
        
        # Graphique en barres des probabilités
        fig = px.bar(
            distribution_df,
            x='Type',
            y='Probabilité (%)',
            color='Probabilité (%)',
            color_continuous_scale='Viridis',
            title="Distribution des types de trafic"
        )
        st.plotly_chart(fig, use_container_width=True)
    
    # Afficher les caractéristiques extraites
    with st.expander("Caractéristiques extraites"):
        st.dataframe(df) 