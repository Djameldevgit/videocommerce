import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const SportFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // CORREGIDO: Usar array en lugar de objeto anidado
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'football': ['typeEquipementFootball', 'marqueSport', 'tailleEquipement', 'etatEquipement'],
      'hand_voley_basket': ['sportType', 'typeEquipementBallon', 'marqueBallon', 'tailleBallon', 'etatEquipement'],
      'sport_combat': ['typeSportCombat', 'typeEquipementCombat', 'tailleCombat', 'protectionIncluse', 'etatEquipement'],
      'fitness_musculation': ['typeEquipementFitness', 'poidsMax', 'dimensionsFitness', 'resistance', 'etatEquipement'],
      'natation': ['typeEquipementNatation', 'tailleNatation', 'matiereNatation', 'niveau', 'etatEquipement'],
      'velos_trotinettes': ['typeVehiculeSport', 'tailleVehicule', 'ageUtilisateur', 'typeFreins', 'etatEquipement'],
      'sports_raquette': ['typeSportRaquette', 'tailleRaquette', 'poidsRaquette', 'tensionCorde', 'etatEquipement'],
      'sport_aquatiques': ['typeSportAquatique', 'typeEquipementAquatique', 'tailleAquatique', 'niveauAquatique', 'etatEquipement']
    };
    
    return specificFields[subCategory] || [];
  };
  
  // Los fields permanecen igual (ya los tienes bien definidos)
  const fields = {
    // Football
    'typeEquipementFootball': (
      <Form.Group key="typeEquipementFootball">
        <Form.Label>⚽ {t('football_equipment_type', 'Type d\'équipement football')}</Form.Label>
        <Form.Select
          name="typeEquipementFootball"
          value={postData.typeEquipementFootball || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_equipment_type', 'Sélectionnez')}</option>
          <option value="ballon">{t('ball', 'Ballon')}</option>
          <option value="chaussures">{t('shoes', 'Chaussures')}</option>
          <option value="maillot">{t('jersey', 'Maillot')}</option>
          <option value="short">{t('shorts', 'Short')}</option>
          <option value="protections">{t('protections', 'Protections')}</option>
          <option value="cages">{t('goals', 'Cages')}</option>
          <option value="accessoires">{t('accessories', 'Accessoires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleEquipement': (
      <Form.Group key="tailleEquipement">
        <Form.Label>📏 {t('equipment_size', 'Taille équipement')}</Form.Label>
        <Form.Select
          name="tailleEquipement"
          value={postData.tailleEquipement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="1">{t('size_1', 'Taille 1 (baby)')}</option>
          <option value="3">{t('size_3', 'Taille 3')}</option>
          <option value="4">{t('size_4', 'Taille 4')}</option>
          <option value="5">{t('size_5', 'Taille 5 (adulte)')}</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueSport': (
      <Form.Group key="marqueSport">
        <Form.Label>🏷️ {t('sports_brand', 'Marque sportive')}</Form.Label>
        <Form.Select
          name="marqueSport"
          value={postData.marqueSport || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brand', 'Sélectionnez')}</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
          <option value="puma">Puma</option>
          <option value="reebok">Reebok</option>
          <option value="umbro">Umbro</option>
          <option value="kalenji">Kalenji</option>
          <option value="decathlon">Decathlon</option>
          <option value="autres">{t('other', 'Autres')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'etatEquipement': (
      <Form.Group key="etatEquipement">
        <Form.Label>🔄 {t('equipment_condition', 'État équipement')}</Form.Label>
        <Form.Select
          name="etatEquipement"
          value={postData.etatEquipement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="bon">{t('good', 'Bon état')}</option>
          <option value="usage">{t('used', 'Usage visible')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Hand/Voley/Basket
    'sportType': (
      <Form.Group key="sportType">
        <Form.Label>🏀 {t('sport_type', 'Type de sport')}</Form.Label>
        <Form.Select
          name="sportType"
          value={postData.sportType || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_sport_type', 'Sélectionnez')}</option>
          <option value="handball">{t('handball', 'Handball')}</option>
          <option value="volleyball">{t('volleyball', 'Volleyball')}</option>
          <option value="basketball">{t('basketball', 'Basketball')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEquipementBallon': (
      <Form.Group key="typeEquipementBallon">
        <Form.Label>🏐 {t('ball_equipment_type', 'Type d\'équipement ballon')}</Form.Label>
        <Form.Select
          name="typeEquipementBallon"
          value={postData.typeEquipementBallon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_equipment_type', 'Sélectionnez')}</option>
          <option value="ballon">{t('ball', 'Ballon')}</option>
          <option value="maillot">{t('jersey', 'Maillot')}</option>
          <option value="chaussures">{t('shoes', 'Chaussures')}</option>
          <option value="protections">{t('protections', 'Protections')}</option>
          <option value="filets">{t('nets', 'Filets')}</option>
          <option value="poteaux">{t('posts', 'Poteaux')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleBallon': (
      <Form.Group key="tailleBallon">
        <Form.Label>📏 {t('ball_size', 'Taille du ballon')}</Form.Label>
        <Form.Select
          name="tailleBallon"
          value={postData.tailleBallon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="1">{t('size_1', 'Taille 1')}</option>
          <option value="3">{t('size_3', 'Taille 3')}</option>
          <option value="4">{t('size_4', 'Taille 4')}</option>
          <option value="5">{t('size_5', 'Taille 5')}</option>
          <option value="6">{t('size_6', 'Taille 6')}</option>
          <option value="7">{t('size_7', 'Taille 7')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueBallon': (
      <Form.Group key="marqueBallon">
        <Form.Label>🏷️ {t('ball_brand', 'Marque du ballon')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueBallon"
          value={postData.marqueBallon || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brand', 'Ex: Molten, Mikasa, Spalding...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // ... (todos los demás campos, asegúrate de agregar key={fieldName} a cada Form.Group)
    
    // Deportes de combate
    'typeSportCombat': (
      <Form.Group key="typeSportCombat">
        <Form.Label>🥊 {t('combat_sport_type', 'Type de sport de combat')}</Form.Label>
        <Form.Select
          name="typeSportCombat"
          value={postData.typeSportCombat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_combat_sport', 'Sélectionnez')}</option>
          <option value="boxe">{t('boxing', 'Boxe')}</option>
          <option value="judo">{t('judo', 'Judo')}</option>
          <option value="karate">{t('karate', 'Karate')}</option>
          <option value="taekwondo">{t('taekwondo', 'Taekwondo')}</option>
          <option value="muay_thai">{t('muay_thai', 'Muay Thai')}</option>
          <option value="lutte">{t('wrestling', 'Lutte')}</option>
          <option value="mma">{t('mma', 'MMA')}</option>
        </Form.Select>
      </Form.Group>
    ),
    'typeEquipementFootball': (
      <Form.Group>
        <Form.Label>⚽ {t('football_equipment_type', 'Type d\'équipement football')}</Form.Label>
        <Form.Select
          name="typeEquipementFootball"
          value={postData.typeEquipementFootball || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_equipment_type', 'Sélectionnez')}</option>
          <option value="ballon">{t('ball', 'Ballon')}</option>
          <option value="chaussures">{t('shoes', 'Chaussures')}</option>
          <option value="maillot">{t('jersey', 'Maillot')}</option>
          <option value="short">{t('shorts', 'Short')}</option>
          <option value="protections">{t('protections', 'Protections')}</option>
          <option value="cages">{t('goals', 'Cages')}</option>
          <option value="accessoires">{t('accessories', 'Accessoires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleEquipement': (
      <Form.Group>
        <Form.Label>📏 {t('equipment_size', 'Taille équipement')}</Form.Label>
        <Form.Select
          name="tailleEquipement"
          value={postData.tailleEquipement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="1">{t('size_1', 'Taille 1 (baby)')}</option>
          <option value="3">{t('size_3', 'Taille 3')}</option>
          <option value="4">{t('size_4', 'Taille 4')}</option>
          <option value="5">{t('size_5', 'Taille 5 (adulte)')}</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueSport': (
      <Form.Group>
        <Form.Label>🏷️ {t('sports_brand', 'Marque sportive')}</Form.Label>
        <Form.Select
          name="marqueSport"
          value={postData.marqueSport || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brand', 'Sélectionnez')}</option>
          <option value="nike">Nike</option>
          <option value="adidas">Adidas</option>
          <option value="puma">Puma</option>
          <option value="reebok">Reebok</option>
          <option value="umbro">Umbro</option>
          <option value="kalenji">Kalenji</option>
          <option value="decathlon">Decathlon</option>
          <option value="autres">{t('other', 'Autres')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'etatEquipement': (
      <Form.Group>
        <Form.Label>🔄 {t('equipment_condition', 'État équipement')}</Form.Label>
        <Form.Select
          name="etatEquipement"
          value={postData.etatEquipement || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="bon">{t('good', 'Bon état')}</option>
          <option value="usage">{t('used', 'Usage visible')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Hand/Voley/Basket
    'sportType': (
      <Form.Group>
        <Form.Label>🏀 {t('sport_type', 'Type de sport')}</Form.Label>
        <Form.Select
          name="sportType"
          value={postData.sportType || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_sport_type', 'Sélectionnez')}</option>
          <option value="handball">{t('handball', 'Handball')}</option>
          <option value="volleyball">{t('volleyball', 'Volleyball')}</option>
          <option value="basketball">{t('basketball', 'Basketball')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEquipementBallon': (
      <Form.Group>
        <Form.Label>🏐 {t('ball_equipment_type', 'Type d\'équipement ballon')}</Form.Label>
        <Form.Select
          name="typeEquipementBallon"
          value={postData.typeEquipementBallon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_equipment_type', 'Sélectionnez')}</option>
          <option value="ballon">{t('ball', 'Ballon')}</option>
          <option value="maillot">{t('jersey', 'Maillot')}</option>
          <option value="chaussures">{t('shoes', 'Chaussures')}</option>
          <option value="protections">{t('protections', 'Protections')}</option>
          <option value="filets">{t('nets', 'Filets')}</option>
          <option value="poteaux">{t('posts', 'Poteaux')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleBallon': (
      <Form.Group>
        <Form.Label>📏 {t('ball_size', 'Taille du ballon')}</Form.Label>
        <Form.Select
          name="tailleBallon"
          value={postData.tailleBallon || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="1">{t('size_1', 'Taille 1')}</option>
          <option value="3">{t('size_3', 'Taille 3')}</option>
          <option value="4">{t('size_4', 'Taille 4')}</option>
          <option value="5">{t('size_5', 'Taille 5')}</option>
          <option value="6">{t('size_6', 'Taille 6')}</option>
          <option value="7">{t('size_7', 'Taille 7')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueBallon': (
      <Form.Group>
        <Form.Label>🏷️ {t('ball_brand', 'Marque du ballon')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueBallon"
          value={postData.marqueBallon || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brand', 'Ex: Molten, Mikasa, Spalding...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Sports de combat
    'typeSportCombat': (
      <Form.Group>
        <Form.Label>🥊 {t('combat_sport_type', 'Type de sport de combat')}</Form.Label>
        <Form.Select
          name="typeSportCombat"
          value={postData.typeSportCombat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_combat_sport', 'Sélectionnez')}</option>
          <option value="boxe">{t('boxing', 'Boxe')}</option>
          <option value="judo">{t('judo', 'Judo')}</option>
          <option value="karate">{t('karate', 'Karate')}</option>
          <option value="taekwondo">{t('taekwondo', 'Taekwondo')}</option>
          <option value="muay_thai">{t('muay_thai', 'Muay Thai')}</option>
          <option value="lutte">{t('wrestling', 'Lutte')}</option>
          <option value="mma">{t('mma', 'MMA')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEquipementCombat': (
      <Form.Group>
        <Form.Label>🥋 {t('combat_equipment_type', 'Type d\'équipement combat')}</Form.Label>
        <Form.Select
          name="typeEquipementCombat"
          value={postData.typeEquipementCombat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_equipment_type', 'Sélectionnez')}</option>
          <option value="kimono">{t('gi', 'Kimono/Gi')}</option>
          <option value="gants">{t('gloves', 'Gants')}</option>
          <option value="casque">{t('helmet', 'Casque')}</option>
          <option value="protections">{t('protections', 'Protections')}</option>
          <option value="sangles">{t('wraps', 'Sangles')}</option>
          <option value="punching_ball">{t('punching_ball', 'Punching ball')}</option>
          <option value="sac_frappe">{t('punching_bag', 'Sac de frappe')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleCombat': (
      <Form.Group>
        <Form.Label>📏 {t('combat_size', 'Taille équipement combat')}</Form.Label>
        <Form.Select
          name="tailleCombat"
          value={postData.tailleCombat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="enfant">{t('child', 'Enfant')}</option>
          <option value="ado">{t('teen', 'Adolescent')}</option>
          <option value="adulte">{t('adult', 'Adulte')}</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'protectionIncluse': (
      <Form.Group>
        <Form.Label>🛡️ {t('protection_included', 'Protections incluses')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="protectionDents"
            label={t('mouthguard', 'Protège-dents')}
            checked={postData.protectionDents || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="protectionTete"
            label={t('head_protection', 'Protection tête')}
            checked={postData.protectionTete || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="protectionTibias"
            label={t('shin_protection', 'Protège-tibias')}
            checked={postData.protectionTibias || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="protectionPoitrine"
            label={t('chest_protection', 'Protection poitrine')}
            checked={postData.protectionPoitrine || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Fitness & Musculation
    'typeEquipementFitness': (
      <Form.Group>
        <Form.Label>💪 {t('fitness_equipment_type', 'Type d\'équipement fitness')}</Form.Label>
        <Form.Select
          name="typeEquipementFitness"
          value={postData.typeEquipementFitness || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_fitness_equipment', 'Sélectionnez')}</option>
          <option value="haltères">{t('dumbbells', 'Haltères')}</option>
          <option value="barre">{t('barbell', 'Barre')}</option>
          <option value="station">{t('multi_station', 'Station multifonction')}</option>
          <option value="rameur">{t('rowing_machine', 'Rameur')}</option>
          <option value="tapis_course">{t('treadmill', 'Tapis de course')}</option>
          <option value="velo_appartement">{t('exercise_bike', 'Vélo d\'appartement')}</option>
          <option value="elastiques">{t('resistance_bands', 'Élastiques')}</option>
          <option value="kettlebell">{t('kettlebell', 'Kettlebell')}</option>
          <option value="banc">{t('bench', 'Banc de musculation')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'poidsMax': (
      <Form.Group>
        <Form.Label>🏋️ {t('max_weight', 'Poids maximum')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="poidsMax"
              value={postData.poidsMax || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_max_weight', 'Ex: 100')}
              min="0"
              step="0.5"
            />
          </Col>
          <Col>
            <Form.Select
              name="unitePoids"
              value={postData.unitePoids || 'kg'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'dimensionsFitness': (
      <Form.Group>
        <Form.Label>📐 {t('fitness_dimensions', 'Dimensions équipement')}</Form.Label>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="number"
              name="longueurFitness"
              value={postData.longueurFitness || ''}
              onChange={handleChangeInput}
              placeholder={t('length', 'Longueur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="largeurFitness"
              value={postData.largeurFitness || ''}
              onChange={handleChangeInput}
              placeholder={t('width', 'Largeur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="hauteurFitness"
              value={postData.hauteurFitness || ''}
              onChange={handleChangeInput}
              placeholder={t('height', 'Hauteur')}
              min="0"
              step="0.1"
            />
          </Col>
        </Row>
        <Form.Select
          name="uniteDimensionsFitness"
          value={postData.uniteDimensionsFitness || 'cm'}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="cm">cm</option>
          <option value="m">m</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'resistance': (
      <Form.Group>
        <Form.Label>💪 {t('resistance', 'Résistance/niveaux')}</Form.Label>
        <Form.Control
          type="text"
          name="resistance"
          value={postData.resistance || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_resistance', 'Ex: 10 niveaux, 20-100kg...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Natation
    'typeEquipementNatation': (
      <Form.Group>
        <Form.Label>🏊 {t('swimming_equipment_type', 'Type d\'équipement natation')}</Form.Label>
        <Form.Select
          name="typeEquipementNatation"
          value={postData.typeEquipementNatation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_swimming_equipment', 'Sélectionnez')}</option>
          <option value="maillot">{t('swimsuit', 'Maillot de bain')}</option>
          <option value="lunettes">{t('goggles', 'Lunettes')}</option>
          <option value="bonnet">{t('swim_cap', 'Bonnet')}</option>
          <option value="palmes">{t('fins', 'Palmes')}</option>
          <option value="planche">{t('kickboard', 'Planche')}</option>
          <option value="tuba">{t('snorkel', 'Tuba')}</option>
          <option value="bouees">{t('floats', 'Bouées')}</option>
          <option value="accessoires">{t('accessories', 'Accessoires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleNatation': (
      <Form.Group>
        <Form.Label>📏 {t('swimming_size', 'Taille équipement natation')}</Form.Label>
        <Form.Select
          name="tailleNatation"
          value={postData.tailleNatation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="enfant">{t('child', 'Enfant')}</option>
          <option value="ado">{t('teen', 'Adolescent')}</option>
          <option value="adulte">{t('adult', 'Adulte')}</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="universel">{t('universal', 'Universel')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'matiereNatation': (
      <Form.Group>
        <Form.Label>🧵 {t('swimming_material', 'Matière équipement')}</Form.Label>
        <Form.Select
          name="matiereNatation"
          value={postData.matiereNatation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material', 'Sélectionnez')}</option>
          <option value="polyester">{t('polyester', 'Polyester')}</option>
          <option value="nylon">{t('nylon', 'Nylon')}</option>
          <option value="lycra">{t('lycra', 'Lycra')}</option>
          <option value="silicone">{t('silicone', 'Silicone')}</option>
          <option value="caoutchouc">{t('rubber', 'Caoutchouc')}</option>
          <option value="plastique">{t('plastic', 'Plastique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'niveau': (
      <Form.Group>
        <Form.Label>🌟 {t('swimming_level', 'Niveau de natation')}</Form.Label>
        <Form.Select
          name="niveau"
          value={postData.niveau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_level', 'Sélectionnez')}</option>
          <option value="debutant">{t('beginner', 'Débutant')}</option>
          <option value="intermediaire">{t('intermediate', 'Intermédiaire')}</option>
          <option value="confirme">{t('advanced', 'Confirmé')}</option>
          <option value="competition">{t('competition', 'Compétition')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Vélo & Trotinettes
    'typeVehiculeSport': (
      <Form.Group>
        <Form.Label>🚲 {t('sport_vehicle_type', 'Type de véhicule sportif')}</Form.Label>
        <Form.Select
          name="typeVehiculeSport"
          value={postData.typeVehiculeSport || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_vehicle_type', 'Sélectionnez')}</option>
          <option value="velo_route">{t('road_bike', 'Vélo de route')}</option>
          <option value="velo_vtt">{t('mountain_bike', 'VTT')}</option>
          <option value="velo_ville">{t('city_bike', 'Vélo de ville')}</option>
          <option value="velo_enfant">{t('kids_bike', 'Vélo enfant')}</option>
          <option value="trotinette">{t('scooter', 'Trotinette')}</option>
          <option value="trottinette_electrique">{t('electric_scooter', 'Trotinette électrique')}</option>
          <option value="skateboard">{t('skateboard', 'Skateboard')}</option>
          <option value="rollers">{t('rollers', 'Rollers')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleVehicule': (
      <Form.Group>
        <Form.Label>📏 {t('vehicle_size', 'Taille du véhicule')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="tailleVehicule"
              value={postData.tailleVehicule || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_size', 'Ex: 26 pour pouces vélo')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteTailleVehicule"
              value={postData.uniteTailleVehicule || 'pouces'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="pouces">{t('inches', 'Pouces')}</option>
              <option value="cm">cm</option>
              <option value="taille">{t('size', 'Taille')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'ageUtilisateur': (
      <Form.Group>
        <Form.Label>👤 {t('user_age', 'Âge utilisateur')}</Form.Label>
        <Form.Select
          name="ageUtilisateur"
          value={postData.ageUtilisateur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_age_range', 'Sélectionnez')}</option>
          <option value="3-5">3-5 {t('years', 'ans')}</option>
          <option value="6-8">6-8 {t('years', 'ans')}</option>
          <option value="9-12">9-12 {t('years', 'ans')}</option>
          <option value="13-16">13-16 {t('years', 'ans')}</option>
          <option value="adulte">{t('adult', 'Adulte')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeFreins': (
      <Form.Group>
        <Form.Label>🛑 {t('brake_type', 'Type de freins')}</Form.Label>
        <Form.Select
          name="typeFreins"
          value={postData.typeFreins || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brake_type', 'Sélectionnez')}</option>
          <option value="patins">{t('rim_brakes', 'Freins à patins')}</option>
          <option value="disque">{t('disc_brakes', 'Freins à disque')}</option>
          <option value="tambour">{t('drum_brakes', 'Freins à tambour')}</option>
          <option value="pied">{t('foot_brake', 'Frein au pied')}</option>
          <option value="sans_freins">{t('no_brakes', 'Sans freins')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Sports de raquette
    'typeSportRaquette': (
      <Form.Group>
        <Form.Label>🎾 {t('racket_sport_type', 'Type de sport de raquette')}</Form.Label>
        <Form.Select
          name="typeSportRaquette"
          value={postData.typeSportRaquette || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_racket_sport', 'Sélectionnez')}</option>
          <option value="tennis">{t('tennis', 'Tennis')}</option>
          <option value="badminton">{t('badminton', 'Badminton')}</option>
          <option value="squash">{t('squash', 'Squash')}</option>
          <option value="padel">{t('padel', 'Padel')}</option>
          <option value="ping_pong">{t('table_tennis', 'Tennis de table')}</option>
          <option value="raquettes_neige">{t('snowshoes', 'Raquettes à neige')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleRaquette': (
      <Form.Group>
        <Form.Label>📏 {t('racket_size', 'Taille de la raquette')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="tailleRaquette"
              value={postData.tailleRaquette || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_size', 'Longueur en cm ou pouces')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteTailleRaquette"
              value={postData.uniteTailleRaquette || 'cm'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="cm">cm</option>
              <option value="pouces">{t('inches', 'Pouces')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'poidsRaquette': (
      <Form.Group>
        <Form.Label>⚖️ {t('racket_weight', 'Poids de la raquette')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="poidsRaquette"
              value={postData.poidsRaquette || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_weight', 'Ex: 300')}
              min="0"
              step="1"
            />
          </Col>
          <Col>
            <Form.Select
              name="unitePoidsRaquette"
              value={postData.unitePoidsRaquette || 'g'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="g">g</option>
              <option value="kg">kg</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'tensionCorde': (
      <Form.Group>
        <Form.Label>🎾 {t('string_tension', 'Tension des cordes')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="tensionCorde"
              value={postData.tensionCorde || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_tension', 'Ex: 24')}
              min="0"
              step="0.5"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteTension"
              value={postData.uniteTension || 'kg'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="kg">kg</option>
              <option value="lbs">lbs</option>
            </Form.Select>
          </Col>
        </Row>
        <Form.Text className="text-muted">
          💡 {t('tension_tip', 'Généralement entre 20-30kg pour le tennis')}
        </Form.Text>
      </Form.Group>
    ),
    
    // Sports aquatiques
    'typeSportAquatique': (
      <Form.Group>
        <Form.Label>🚤 {t('water_sport_type', 'Type de sport aquatique')}</Form.Label>
        <Form.Select
          name="typeSportAquatique"
          value={postData.typeSportAquatique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_water_sport', 'Sélectionnez')}</option>
          <option value="surf">{t('surfing', 'Surf')}</option>
          <option value="planche_voile">{t('windsurfing', 'Planche à voile')}</option>
          <option value="kitesurf">{t('kitesurfing', 'Kitesurf')}</option>
          <option value="canoe_kayak">{t('canoe_kayak', 'Canöe/Kayak')}</option>
          <option value="aviron">{t('rowing', 'Aviron')}</option>
          <option value="plongee">{t('diving', 'Plongée')}</option>
          <option value="pêche_sportive">{t('sport_fishing', 'Pêche sportive')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEquipementAquatique': (
      <Form.Group>
        <Form.Label>🛶 {t('water_equipment_type', 'Type d\'équipement aquatique')}</Form.Label>
        <Form.Select
          name="typeEquipementAquatique"
          value={postData.typeEquipementAquatique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_water_equipment', 'Sélectionnez')}</option>
          <option value="planche">{t('board', 'Planche')}</option>
          <option value="voile">{t('sail', 'Voile')}</option>
          <option value="combinaison">{t('wetsuit', 'Combinaison')}</option>
          <option value="gilet">{t('life_jacket', 'Gilet de sauvetage')}</option>
          <option value="embarcation">{t('boat', 'Embarcation')}</option>
          <option value="materiel_peche">{t('fishing_gear', 'Matériel de pêche')}</option>
          <option value="bouteille_plongee">{t('scuba_tank', 'Bouteille de plongée')}</option>
          <option value="accessoires">{t('accessories', 'Accessoires')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'tailleAquatique': (
      <Form.Group>
        <Form.Label>📏 {t('water_equipment_size', 'Taille équipement aquatique')}</Form.Label>
        <Form.Control
          type="text"
          name="tailleAquatique"
          value={postData.tailleAquatique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_size_description', 'Ex: 8 pieds, taille adulte...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'niveauAquatique': (
      <Form.Group>
        <Form.Label>🌊 {t('water_sport_level', 'Niveau sport aquatique')}</Form.Label>
        <Form.Select
          name="niveauAquatique"
          value={postData.niveauAquatique || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_level', 'Sélectionnez')}</option>
          <option value="debutant">{t('beginner', 'Débutant')}</option>
          <option value="intermediaire">{t('intermediate', 'Intermédiaire')}</option>
          <option value="confirme">{t('advanced', 'Confirmé')}</option>
          <option value="professionnel">{t('professional', 'Professionnel')}</option>
        </Form.Select>
      </Form.Group>
    )
  };
  
  // Obtener campos específicos para la subcategoría actual
  const subCategoryFields = getSubCategorySpecificFields();
  
  // Si fieldName está especificado, devolver ese campo
  if (fieldName) {
    return fields[fieldName] || null;
  }
  
  // Si no hay fieldName específico, devolver todos los campos de la subcategoría
  if (subCategory && subCategoryFields) {
    return (
      <>
        {Object.keys(subCategoryFields).map(key => (
          <div key={key} className="mb-3">
            {fields[subCategoryFields[key]]}
          </div>
        ))}
      </>
    );
  }
  
  return null;
};

export default SportFields;