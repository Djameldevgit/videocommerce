import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const PiecesDetacheesFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // ✅ FUNCIÓN PARA CAMPOS ESPECÍFICOS POR SUBCATEGORÍA
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'pieces_automobiles': {
        'typePieceAuto': 'typePieceAuto',
        'marqueCompatible': 'marqueCompatible',
        'modeleCompatible': 'modeleCompatible',
        'anneeCompatible': 'anneeCompatible',
        'etatPiece': 'etatPiece',
        'originePiece': 'originePiece',
        'garantiePiece': 'garantiePiece',
        'prix': 'prix'
      },
      'pieces_vehicules': {
        'typePieceVehicule': 'typePieceVehicule',
        'marqueCompatible': 'marqueCompatible',
        'modeleCompatible': 'modeleCompatible',
        'typeVehicule': 'typeVehicule',
        'etatPiece': 'etatPiece',
        'garantiePiece': 'garantiePiece',
        'prix': 'prix'
      },
      'pieces_moto': {
        'typePieceMoto': 'typePieceMoto',
        'marqueCompatible': 'marqueCompatible',
        'modeleCompatible': 'modeleCompatible',
        'cylindreeCompatible': 'cylindreeCompatible',
        'etatPiece': 'etatPiece',
        'garantiePiece': 'garantiePiece',
        'prix': 'prix'
      },
      'pieces_bateaux': {
        'typePieceBateau': 'typePieceBateau',
        'marqueCompatible': 'marqueCompatible',
        'modeleCompatible': 'modeleCompatible',
        'longueurBateau': 'longueurBateau',
        'etatPiece': 'etatPiece',
        'garantiePiece': 'garantiePiece',
        'prix': 'prix'
      },
      'alarme_securite': {
        'typeAlarme': 'typeAlarme',
        'marqueAlarme': 'marqueAlarme',
        'fonctionsAlarme': 'fonctionsAlarme',
        'compatibleAvec': 'compatibleAvec',
        'etat': 'etat',
        'garantie': 'garantie',
        'prix': 'prix'
      },
      'nettoyage_entretien': {
        'typeProduit': 'typeProduit',
        'marqueProduit': 'marqueProduit',
        'application': 'application',
        'contenance': 'contenance',
        'etat': 'etat',
        'prix': 'prix'
      },
      'outils_diagnostics': {
        'typeOutil': 'typeOutil',
        'marqueOutil': 'marqueOutil',
        'fonctionsOutil': 'fonctionsOutil',
        'compatibleAvec': 'compatibleAvec',
        'etat': 'etat',
        'garantie': 'garantie',
        'prix': 'prix'
      },
      'lubrifiants': {
        'typeLubrifiant': 'typeLubrifiant',
        'marqueLubrifiant': 'marqueLubrifiant',
        'viscosite': 'viscosite',
        'contenance': 'contenance',
        'application': 'application',
        'etat': 'etat',
        'prix': 'prix'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  // ✅ OBJETO CON TODOS LOS CAMPOS DE PIÈCES DÉTACHÉES
  const fields = {
    // Pièces Automobiles
    'typePieceAuto': (
      <Form.Group>
        <Form.Label>🚗 {t('auto_part_type', 'Type de pièce automobile')}</Form.Label>
        <Form.Select
          name="typePieceAuto"
          value={postData.typePieceAuto || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_auto_part', 'Sélectionnez')}</option>
          <option value="moteur">⚙️ Moteur</option>
          <option value="transmission">⚙️ Transmission</option>
          <option value="suspension">🔄 Suspension</option>
          <option value="freins">🛑 Freins</option>
          <option value="direction">🚙 Direction</option>
          <option value="echappement">💨 Échappement</option>
          <option value="carrosserie">🚗 Carrosserie</option>
          <option value="electricite">⚡ Électricité</option>
          <option value="climatisation">❄️ Climatisation</option>
          <option value="interieur">🛋️ Intérieur</option>
          <option value="optiques">💡 Optiques</option>
          <option value="jantes">🛞 Jantes & Pneus</option>
          <option value="filtres">🔍 Filtres</option>
          <option value="batterie">🔋 Batterie</option>
          <option value="autres">🔧 Autres pièces</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Pièces Véhicules
    'typePieceVehicule': (
      <Form.Group>
        <Form.Label>🚚 {t('vehicle_part_type', 'Type de pièce véhicule')}</Form.Label>
        <Form.Select
          name="typePieceVehicule"
          value={postData.typePieceVehicule || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_vehicle_part', 'Sélectionnez')}</option>
          <option value="utilitaire">🚚 Utilitaire</option>
          <option value="camion">🚛 Camion</option>
          <option value="bus">🚌 Bus</option>
          <option value="engin">🏗️ Engin de chantier</option>
          <option value="agricole">🚜 Agricole</option>
          <option value="remorque">🚛 Remorque</option>
          <option value="tout_type">🔧 Tous types de véhicules</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Pièces Moto
    'typePieceMoto': (
      <Form.Group>
        <Form.Label>🏍️ {t('moto_part_type', 'Type de pièce moto')}</Form.Label>
        <Form.Select
          name="typePieceMoto"
          value={postData.typePieceMoto || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_moto_part', 'Sélectionnez')}</option>
          <option value="moteur_moto">⚙️ Moteur</option>
          <option value="transmission_moto">⚙️ Transmission</option>
          <option value="suspension_moto">🔄 Suspension</option>
          <option value="freins_moto">🛑 Freins</option>
          <option value="echappement_moto">💨 Échappement</option>
          <option value="carrosserie_moto">🏍️ Carrosserie</option>
          <option value="electricite_moto">⚡ Électricité</option>
          <option value="selles">🪑 Selless</option>
          <option value="cadre">🔩 Cadre</option>
          <option value="roues">🛞 Roues & Pneus</option>
          <option value="autres_moto">🔧 Autres pièces</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Pièces Bateaux
    'typePieceBateau': (
      <Form.Group>
        <Form.Label>🛥️ {t('boat_part_type', 'Type de pièce bateau')}</Form.Label>
        <Form.Select
          name="typePieceBateau"
          value={postData.typePieceBateau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_boat_part', 'Sélectionnez')}</option>
          <option value="moteur_bateau">⚙️ Moteur marin</option>
          <option value="helice">🌀 Hélice</option>
          <option value="electrique_bateau">⚡ Électricité marine</option>
          <option value="navigation">🧭 Navigation</option>
          <option value="accastillage">⚓ Accastillage</option>
          <option value="coque">🛥️ Coque</option>
          <option value="voile">⛵ Voile</option>
          <option value="securite_bateau">🛟 Sécurité</option>
          <option value="autres_bateau">🔧 Autres pièces</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Champs communs
    'marqueCompatible': (
      <Form.Group>
        <Form.Label>🏷️ {t('compatible_brand', 'Marque compatible')}</Form.Label>
        <Form.Select
          name="marqueCompatible"
          value={postData.marqueCompatible || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_compatible_brand', 'Sélectionnez')}</option>
          <optgroup label={t('auto_brands', 'Automobiles')}>
            <option value="renault">🚗 Renault</option>
            <option value="peugeot">🚗 Peugeot</option>
            <option value="citroen">🚗 Citroën</option>
            <option value="volkswagen">🚗 Volkswagen</option>
            <option value="mercedes">🚗 Mercedes</option>
            <option value="bmw">🚗 BMW</option>
            <option value="audi">🚗 Audi</option>
            <option value="toyota">🚗 Toyota</option>
            <option value="nissan">🚗 Nissan</option>
            <option value="ford">🚗 Ford</option>
            <option value="opel">🚗 Opel</option>
            <option value="fiat">🚗 Fiat</option>
          </optgroup>
          <optgroup label={t('moto_brands', 'Motos')}>
            <option value="yamaha">🏍️ Yamaha</option>
            <option value="honda">🏍️ Honda</option>
            <option value="kawasaki">🏍️ Kawasaki</option>
            <option value="suzuki">🏍️ Suzuki</option>
            <option value="bmw_moto">🏍️ BMW</option>
            <option value="ducati">🏍️ Ducati</option>
            <option value="ktm">🏍️ KTM</option>
          </optgroup>
          <option value="toutes_marques">🌍 Toutes marques</option>
          <option value="autre">🔧 Autre</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'modeleCompatible': (
      <Form.Group>
        <Form.Label>📋 {t('compatible_model', 'Modèle compatible')}</Form.Label>
        <Form.Control
          type="text"
          name="modeleCompatible"
          value={postData.modeleCompatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible_model', 'Ex: Clio IV, Golf 7, CBR 600...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'anneeCompatible': (
      <Form.Group>
        <Form.Label>📅 {t('compatible_year', 'Année(s) compatible(s)')}</Form.Label>
        <Form.Control
          type="text"
          name="anneeCompatible"
          value={postData.anneeCompatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible_years', 'Ex: 2015-2020, 2018+, Toutes années...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'typeVehicule': (
      <Form.Group>
        <Form.Label>🚚 {t('vehicle_type', 'Type de véhicule')}</Form.Label>
        <Form.Select
          name="typeVehicule"
          value={postData.typeVehicule || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_vehicle_type', 'Sélectionnez')}</option>
          <option value="camionnette">🚚 Camionnette</option>
          <option value="camion">🚛 Camion</option>
          <option value="fourgon">🚐 Fourgon</option>
          <option value="utilitaire">🚚 Utilitaire</option>
          <option value="benne">🚛 Benne</option>
          <option value="remorque">🚛 Remorque</option>
          <option value="engin_chantier">🏗️ Engin de chantier</option>
          <option value="agricole">🚜 Agricole</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'cylindreeCompatible': (
      <Form.Group>
        <Form.Label>⚙️ {t('compatible_cc', 'Cylindrée compatible')}</Form.Label>
        <Form.Control
          type="text"
          name="cylindreeCompatible"
          value={postData.cylindreeCompatible || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatible_cc', 'Ex: 125cc, 600cc, 1000-1200cc...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'longueurBateau': (
      <Form.Group>
        <Form.Label>📏 {t('boat_length', 'Longueur bateau compatible')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="longueurBateau"
              value={postData.longueurBateau || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 6, 8, 12"
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteLongueur"
              value={postData.uniteLongueur || 'metres'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="metres">mètres</option>
              <option value="pieds">pieds</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'etatPiece': (
      <Form.Group>
        <Form.Label>🔄 {t('part_condition', 'État de la pièce')}</Form.Label>
        <Form.Select
          name="etatPiece"
          value={postData.etatPiece || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">✨ Neuf sous blister</option>
          <option value="neuf_sans_etiquette">✨ Neuf sans étiquette</option>
          <option value="tres_bon">👍 Très bon état</option>
          <option value="bon">👌 Bon état</option>
          <option value="moyen">⚠️ État moyen</option>
          <option value="reconditionne">🔄 Reconditionné</option>
          <option value="pour_reparation">🔧 Pour réparation</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'originePiece': (
      <Form.Group>
        <Form.Label>🌍 {t('part_origin', 'Origine de la pièce')}</Form.Label>
        <Form.Select
          name="originePiece"
          value={postData.originePiece || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_origin', 'Sélectionnez')}</option>
          <option value="origine">🏭 Pièce d'origine (OEM)</option>
          <option value="parallele">🔧 Pièce parallèle</option>
          <option value="occasion">🔄 Pièce d'occasion</option>
          <option value="reconditionnee">🔄 Pièce reconditionnée</option>
          <option value="apres_vente">🏪 Après-vente</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'garantiePiece': (
      <Form.Group>
        <Form.Label>🛡️ {t('part_warranty', 'Garantie sur la pièce')}</Form.Label>
        <Form.Control
          type="text"
          name="garantiePiece"
          value={postData.garantiePiece || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, 1 an, Aucune...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Alarme & Sécurité
    'typeAlarme': (
      <Form.Group>
        <Form.Label>🚨 {t('alarm_type', 'Type d\'alarme/sécurité')}</Form.Label>
        <Form.Select
          name="typeAlarme"
          value={postData.typeAlarme || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_alarm_type', 'Sélectionnez')}</option>
          <option value="alarme_voiture">🚗 Alarme voiture</option>
          <option value="alarme_moto">🏍️ Alarme moto</option>
          <option value="gps_tracker">📍 Tracker GPS</option>
          <option value="immobilisateur">🔒 Immobilisateur</option>
          <option value="serrures">🔐 Serrures renforcées</option>
          <option value="disques_vol">🛡️ Disques de vol</option>
          <option value="antivol">🔒 Antivol</option>
          <option value="autres_securite">🔧 Autres systèmes</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueAlarme': (
      <Form.Group>
        <Form.Label>🏷️ {t('alarm_brand', 'Marque de l\'alarme')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueAlarme"
          value={postData.marqueAlarme || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_alarm_brand', 'Ex: Meta System, Autowatch, Viper...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'fonctionsAlarme': (
      <Form.Group>
        <Form.Label>⚙️ {t('alarm_features', 'Fonctions de l\'alarme')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="checkbox"
            name="telecommande"
            label={t('remote', 'Télécommande')}
            checked={postData.telecommande || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="démarrage_distance"
            label={t('remote_start', 'Démarrage à distance')}
            checked={postData.démarrage_distance || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="blocage_moteur"
            label={t('engine_lock', 'Blocage moteur')}
            checked={postData.blocage_moteur || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="capteur_choc"
            label={t('shock_sensor', 'Capteur de choc')}
            checked={postData.capteur_choc || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="capteur_mouvement"
            label={t('motion_sensor', 'Capteur de mouvement')}
            checked={postData.capteur_mouvement || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Nettoyage & Entretien
    'typeProduit': (
      <Form.Group>
        <Form.Label>🧼 {t('product_type', 'Type de produit')}</Form.Label>
        <Form.Select
          name="typeProduit"
          value={postData.typeProduit || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_product_type', 'Sélectionnez')}</option>
          <option value="nettoyant">🧼 Nettoyant</option>
          <option value="polish">✨ Polish/cire</option>
          <option value="desinfectant">🧴 Désinfectant</option>
          <option value="detergent">🧴 Détergent</option>
          <option value="antigel">❄️ Antigel</option>
          <option value="lave_glace">💦 Lave-glace</option>
          <option value="adblue">🔵 AdBlue</option>
          <option value="additifs">🧪 Additifs</option>
          <option value="accessoires_nettoyage">🧽 Accessoires</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueProduit': (
      <Form.Group>
        <Form.Label>🏷️ {t('product_brand', 'Marque du produit')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueProduit"
          value={postData.marqueProduit || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_product_brand', 'Ex: Turtle Wax, Meguiar\'s, Sonax...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'application': (
      <Form.Group>
        <Form.Label>🎯 {t('application', 'Application')}</Form.Label>
        <Form.Select
          name="application"
          value={postData.application || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_application', 'Sélectionnez')}</option>
          <option value="interieur">🛋️ Intérieur véhicule</option>
          <option value="exterieur">🚗 Extérieur véhicule</option>
          <option value="moteur">⚙️ Moteur</option>
          <option value="jantes">🛞 Jantes</option>
          <option value="vitres">🔍 Vitres</option>
          <option value="cuir">🐮 Cuir</option>
          <option value="tissu">🧵 Tissu</option>
          <option value="universel">🌍 Universel</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'contenance': (
      <Form.Group>
        <Form.Label>📏 {t('capacity', 'Contenance')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="contenance"
              value={postData.contenance || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 1, 5, 20"
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteContenance"
              value={postData.uniteContenance || 'litres'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="litres">litres (L)</option>
              <option value="ml">millilitres (ml)</option>
              <option value="kg">kilogrammes (kg)</option>
              <option value="g">grammes (g)</option>
              <option value="pieces">pièces</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Outils de diagnostics
    'typeOutil': (
      <Form.Group>
        <Form.Label>🔧 {t('tool_type', 'Type d\'outil')}</Form.Label>
        <Form.Select
          name="typeOutil"
          value={postData.typeOutil || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_tool_type', 'Sélectionnez')}</option>
          <option value="valise_diagnostic">💼 Valise diagnostic</option>
          <option value="scanner_obd">🔍 Scanner OBD</option>
          <option value="testeur_batterie">🔋 Testeur batterie</option>
          <option value="testeur_allumage">⚡ Testeur allumage</option>
          <option value="manometre">📊 Manomètre</option>
          <option value="multimetre">🔌 Multimètre</option>
          <option value="oscilloscope">📈 Oscilloscope</option>
          <option value="autres_outils">🔧 Autres outils</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueOutil': (
      <Form.Group>
        <Form.Label>🏷️ {t('tool_brand', 'Marque de l\'outil')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueOutil"
          value={postData.marqueOutil || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_tool_brand', 'Ex: Launch, Autel, Bosch, Snap-on...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'fonctionsOutil': (
      <Form.Group>
        <Form.Label>⚙️ {t('tool_features', 'Fonctions de l\'outil')}</Form.Label>
        <Form.Control
          as="textarea"
          name="fonctionsOutil"
          value={postData.fonctionsOutil || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_tool_features', 'Lecteur défauts, effacement codes, tests live...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'compatibleAvec': (
      <Form.Group>
        <Form.Label>🔄 {t('compatible_with', 'Compatible avec')}</Form.Label>
        <Form.Control
          type="text"
          name="compatibleAvec"
          value={postData.compatibleAvec || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_compatibility', 'Ex: OBD2, EOBD, marques spécifiques...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Lubrifiants
    'typeLubrifiant': (
      <Form.Group>
        <Form.Label>🛢️ {t('lubricant_type', 'Type de lubrifiant')}</Form.Label>
        <Form.Select
          name="typeLubrifiant"
          value={postData.typeLubrifiant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_lubricant_type', 'Sélectionnez')}</option>
          <option value="huile_moteur">⚙️ Huile moteur</option>
          <option value="huile_boite">⚙️ Huile boîte vitesse</option>
          <option value="huile_freins">🛑 Huile freins</option>
          <option value="huile_direction">🚙 Huile direction</option>
          <option value="graisse">🧴 Graisse</option>
          <option value="liquide_refroidissement">❄️ Liquide refroidissement</option>
          <option value="liquide_freins">🛑 Liquide freins</option>
          <option value="autres_lubrifiants">🛢️ Autres lubrifiants</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueLubrifiant': (
      <Form.Group>
        <Form.Label>🏷️ {t('lubricant_brand', 'Marque du lubrifiant')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueLubrifiant"
          value={postData.marqueLubrifiant || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_lubricant_brand', 'Ex: Total, Elf, Mobil, Castrol...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'viscosite': (
      <Form.Group>
        <Form.Label>📊 {t('viscosity', 'Viscosité')}</Form.Label>
        <Form.Control
          type="text"
          name="viscosite"
          value={postData.viscosite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_viscosity', 'Ex: 5W30, 10W40, 15W40, SAE 90...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'etat': (
      <Form.Group>
        <Form.Label>🔄 {t('condition', 'État')}</Form.Label>
        <Form.Select
          name="etat"
          value={postData.etat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">✨ Neuf</option>
          <option value="occasion">🔄 Occasion</option>
          <option value="reconditionne">🔄 Reconditionné</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'garantie': (
      <Form.Group>
        <Form.Label>🛡️ {t('warranty', 'Garantie')}</Form.Label>
        <Form.Control
          type="text"
          name="garantie"
          value={postData.garantie || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_warranty', 'Ex: 3 mois, 6 mois, 1 an, Aucune...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'prix': (
      <Form.Group>
        <Form.Label>💰 {t('price', 'Prix')}</Form.Label>
        <Form.Control
          type="text"
          name="prix"
          value={postData.prix || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_price', 'Ex: 1500 DA, 50€, Négociable...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  };
  
  // ✅ OBTENER CAMPOS ESPECÍFICOS
  const subCategoryFields = getSubCategorySpecificFields();
  
  // Si fieldName está especificado, devolver ese campo
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en PiecesDetacheesFields para "${subCategory}"`);
      return (
        <Form.Group>
          <Form.Text className="text-danger">
            ⚠️ {t('field_not_implemented', 'Champ non implémenté')}: {fieldName}
          </Form.Text>
        </Form.Group>
      );
    }
    return fieldComponent;
  }
  
  // Si no hay fieldName específico, devolver todos los campos de la subcategoría
  if (subCategory && subCategoryFields) {
    return (
      <>
        {Object.keys(subCategoryFields).map(key => (
          <div key={key} className="mb-3">
            {fields[subCategoryFields[key]] || (
              <div className="alert alert-warning">
                ⚠️ {t('component_missing', 'Composant manquant')}: {subCategoryFields[key]}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
  
  return null;
};

export default PiecesDetacheesFields;