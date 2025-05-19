# Système de Détection d'Intrusions IoT Médical

Système avancé de détection d'intrusions pour environnements IoT médicaux utilisant des algorithmes de machine learning.

## Caractéristiques

- Classification multi-niveaux (binaire, 8 classes, 34 classes)
- Basé sur le dataset CICIoT2023
- Interface Streamlit
- Détection temps réel des menaces

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/FaissalMarzouki/AI-IDS-IOT-MEDICAL.git

# Créer un environnement virtuel
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt
```

## Utilisation

```bash
# Lancer l'application Streamlit
streamlit run src/app.py
```

## Structure du projet

- `src/` : Code source principal
- `docs/` : Documentation
- `data_samples/` : Échantillons de données

## Références

- Dataset: CICIoT2023, Université du Nouveau-Brunswick
