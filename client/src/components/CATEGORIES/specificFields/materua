import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MateriauxFields = ({ fieldName, postData, handleChangeInput, subCategory,  isRTL }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'materiel_professionnel': {
        'typeProfession': 'typeProfession',
        'marqueMateriel': 'marqueMateriel',
        'modeleMateriel': 'modeleMateriel',
        'etatMateriel': 'etatMateriel'
      },
      'outillage_professionnel': {
        'typeOutil': 'typeOutil',
        'marqueOutil': 'marqueOutil',
        'etatOutil': 'etatOutil',
        'puissanceOutil': 'puissanceOutil'
      },
      'materiaux_construction': {
        'typeMateriau': 'typeMateriau',
        'quantiteMateriau': 'quantiteMateriau',
        'qualiteMateriau': 'qualiteMateriau',
        'formatMateriau': 'formatMateriau'
      },
      'matieres_premieres': {
        'typeMatiere': 'typeMatiere',
        'quantiteMatiere': 'quantiteMatiere',
        'qualiteMatiere': 'qualiteMatiere',
        'origineMatiere': 'origineMatiere'
      },
      'produits_hygiene': {
        'typeProduitHygiene': 'typeProduitHygiene',
        'marqueProduit': 'marqueProduit',
        'quantiteProduit': 'quantiteProduit',
        'datePeremption': 'datePeremption'
      },
      'materiel_agricole': {
        'typeMaterielAgricole': 'typeMaterielAgricole',
        'marqueMaterielAgricole': 'marqueMaterielAgricole',
        'puissanceAgricole': 'puissanceAgricole',
        'etatAgricole': 'etatAgricole'
      },
      'autre': {
        'descriptionSpecifique': 'descriptionSpecifique'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    // Matériel professionnel
    'typeProfession': (
      <Form.Group>
        <Form.Label>👷 {t('profession_type', 'Type de profession')}</Form.Label>
        <Form.Select
          name="typeProfession"
          value={postData.typeProfession || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_profession', 'Sélectionnez')}</option>
          <option value="batiment">{t('construction', 'Bâtiment')}</option>
          <option value="electricite">{t('electricity', 'Électricité')}</option>
          <option value="plomberie">{t('plumbing', 'Plomberie')}</option>
          <option value="menuiserie">{t('carpentry', 'Menuiserie')}</option>
          <option value="peinture">{t('painting', 'Peinture')}</option>
          <option value="maconnerie">{t('masonry', 'Maçonnerie')}</option>
          <option value="soudure">{t('welding', 'Soudure')}</option>
          <option value="mecanique">{t('mechanics', 'Mécanique')}</option>
          <option value="jardinage">{t('gardening', 'Jardinage')}</option>
          <option value="nettoyage">{t('cleaning', 'Nettoyage')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueMateriel': (
      <Form.Group>
        <Form.Label>🏷️ {t('equipment_brand', 'Marque du matériel')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueMateriel"
          value={postData.marqueMateriel || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment_brand', 'Ex: Bosch, DeWalt, Makita...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'modeleMateriel': (
      <Form.Group>
        <Form.Label>📋 {t('equipment_model', 'Modèle du matériel')}</Form.Label>
        <Form.Control
          type="text"
          name="modeleMateriel"
          value={postData.modeleMateriel || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment_model', 'Numéro de modèle')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'etatMateriel': (
      <Form.Group>
        <Form.Label>🔄 {t('equipment_condition', 'État du matériel')}</Form.Label>
        <Form.Select
          name="etatMateriel"
          value={postData.etatMateriel || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="bon">{t('good', 'Bon état')}</option>
          <option value="moyen">{t('average', 'État moyen')}</option>
          <option value="fonctionnel">{t('working', 'Fonctionnel')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Outillage professionnel
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
          <option value="perceuse">{t('drill', 'Perceuse')}</option>
          <option value="visseuse">{t('screwdriver', 'Visseuse')}</option>
          <option value="scie">{t('saw', 'Scie')}</option>
          <option value="ponceuse">{t('sander', 'Ponceuse')}</option>
          <option value="meuleuse">{t('grinder', 'Meuleuse')}</option>
          <option value="outils_main">{t('hand_tools', 'Outils à main')}</option>
          <option value="compresseur">{t('compressor', 'Compresseur')}</option>
          <option value="niveau_laser">{t('laser_level', 'Niveau laser')}</option>
          <option value="thermometre">{t('thermometer', 'Thermomètre')}</option>
          <option value="multimetre">{t('multimeter', 'Multimètre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueOutil': (
      <Form.Group>
        <Form.Label>🏷️ {t('tool_brand', 'Marque de l\'outil')}</Form.Label>
        <Form.Select
          name="marqueOutil"
          value={postData.marqueOutil || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brand', 'Sélectionnez')}</option>
          <option value="bosch">Bosch</option>
          <option value="dewalt">DeWalt</option>
          <option value="makita">Makita</option>
          <option value="milwaukee">Milwaukee</option>
          <option value="stanley">Stanley</option>
          <option value="black_decker">Black & Decker</option>
          <option value="hitachi">Hitachi</option>
          <option value="festool">Festool</option>
          <option value="autre">{t('other', 'Autre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'etatOutil': (
      <Form.Group>
        <Form.Label>🔧 {t('tool_condition', 'État de l\'outil')}</Form.Label>
        <Form.Select
          name="etatOutil"
          value={postData.etatOutil || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="peu_utilise">{t('lightly_used', 'Peu utilisé')}</option>
          <option value="usage_normal">{t('normal_use', 'Usage normal')}</option>
          <option value="usage_intensif">{t('heavy_use', 'Usage intensif')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
          <option value="pour_pieces">{t('for_parts', 'Pour pièces détachées')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'puissanceOutil': (
      <Form.Group>
        <Form.Label>⚡ {t('tool_power', 'Puissance de l\'outil')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="puissanceOutil"
              value={postData.puissanceOutil || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_power', 'Ex: 750')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="unitePuissanceOutil"
              value={postData.unitePuissanceOutil || 'W'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="W">W</option>
              <option value="V">V</option>
              <option value="CV">CV</option>
              <option value="HP">{t('hp', 'HP')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Matériaux de construction
    'typeMateriau': (
      <Form.Group>
        <Form.Label>🧱 {t('material_type', 'Type de matériau')}</Form.Label>
        <Form.Select
          name="typeMateriau"
          value={postData.typeMateriau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material_type', 'Sélectionnez')}</option>
          <option value="ciment">{t('cement', 'Ciment')}</option>
          <option value="sable">{t('sand', 'Sable')}</option>
          <option value="gravier">{t('gravel', 'Gravier')}</option>
          <option value="briques">{t('bricks', 'Briques')}</option>
          <option value="parpaings">{t('concrete_blocks', 'Parpaings')}</option>
          <option value="tuiles">{t('tiles', 'Tuiles')}</option>
          <option value="bois">{t('wood', 'Bois de construction')}</option>
          <option value="acier">{t('steel', 'Acier')}</option>
          <option value="platre">{t('plaster', 'Plâtre')}</option>
          <option value="isolation">{t('insulation', 'Isolation')}</option>
          <option value="carrelage">{t('tiling', 'Carrelage')}</option>
          <option value="pvc">{t('pvc', 'PVC')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'quantiteMateriau': (
      <Form.Group>
        <Form.Label>📦 {t('material_quantity', 'Quantité de matériau')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="quantiteMateriau"
              value={postData.quantiteMateriau || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_quantity', 'Ex: 100')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteQuantiteMateriau"
              value={postData.uniteQuantiteMateriau || 'kg'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="kg">kg</option>
              <option value="tonne">{t('ton', 'Tonne')}</option>
              <option value="m3">m³</option>
              <option value="L">L</option>
              <option value="unites">{t('units', 'Unités')}</option>
              <option value="palettes">{t('pallets', 'Palettes')}</option>
              <option value="sacs">{t('bags', 'Sacs')}</option>
              <option value="rouleaux">{t('rolls', 'Rouleaux')}</option>
              <option value="plaques">{t('sheets', 'Plaques')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'qualiteMateriau': (
      <Form.Group>
        <Form.Label>🌟 {t('material_quality', 'Qualité du matériau')}</Form.Label>
        <Form.Select
          name="qualiteMateriau"
          value={postData.qualiteMateriau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_quality', 'Sélectionnez')}</option>
          <option value="premium">{t('premium', 'Premium')}</option>
          <option value="standard">{t('standard', 'Standard')}</option>
          <option value="economique">{t('economical', 'Économique')}</option>
          <option value="recyclé">{t('recycled', 'Recyclé')}</option>
          <option value="haut_gamme">{t('high_end', 'Haut de gamme')}</option>
          <option value="industriel">{t('industrial', 'Industriel')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'formatMateriau': (
      <Form.Group>
        <Form.Label>📏 {t('material_format', 'Format du matériau')}</Form.Label>
        <Form.Control
          type="text"
          name="formatMateriau"
          value={postData.formatMateriau || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_format', 'Ex: 20x40x20 cm, plaque 1.2x2.4m...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Matières premières
    'typeMatiere': (
      <Form.Group>
        <Form.Label>⛏️ {t('raw_material_type', 'Type de matière première')}</Form.Label>
        <Form.Select
          name="typeMatiere"
          value={postData.typeMatiere || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_raw_material', 'Sélectionnez')}</option>
          <option value="minerai">{t('ore', 'Minerai')}</option>
          <option value="metal">{t('metal', 'Métal')}</option>
          <option value="plastique">{t('plastic', 'Plastique')}</option>
          <option value="verre">{t('glass', 'Verre')}</option>
          <option value="papier">{t('paper', 'Papier')}</option>
          <option value="textile">{t('textile', 'Textile')}</option>
          <option value="caoutchouc">{t('rubber', 'Caoutchouc')}</option>
          <option value="bois">{t('wood', 'Bois')}</option>
          <option value="pierre">{t('stone', 'Pierre')}</option>
          <option value="sable">{t('sand', 'Sable')}</option>
          <option value="argile">{t('clay', 'Argile')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'quantiteMatiere': (
      <Form.Group>
        <Form.Label>⚖️ {t('raw_material_quantity', 'Quantité matière première')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="quantiteMatiere"
              value={postData.quantiteMatiere || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_quantity', 'Ex: 500')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteQuantiteMatiere"
              value={postData.uniteQuantiteMatiere || 'kg'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="kg">kg</option>
              <option value="tonne">{t('ton', 'Tonne')}</option>
              <option value="m3">m³</option>
              <option value="L">L</option>
              <option value="g">g</option>
              <option value="barils">{t('barrels', 'Barils')}</option>
              <option value="sacs">{t('bags', 'Sacs')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'qualiteMatiere': (
      <Form.Group>
        <Form.Label>🔬 {t('raw_material_quality', 'Qualité matière première')}</Form.Label>
        <Form.Select
          name="qualiteMatiere"
          value={postData.qualiteMatiere || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_quality', 'Sélectionnez')}</option>
          <option value="purete_99">{t('99_purity', '99% pureté')}</option>
          <option value="purete_95">{t('95_purity', '95% pureté')}</option>
          <option value="industriel">{t('industrial', 'Industriel')}</option>
          <option value="commercial">{t('commercial', 'Commercial')}</option>
          <option value="recyclé">{t('recycled', 'Recyclé')}</option>
          <option value="brut">{t('raw', 'Brut')}</option>
          <option value="raffine">{t('refined', 'Raffiné')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'origineMatiere': (
      <Form.Group>
        <Form.Label>🌍 {t('raw_material_origin', 'Origine matière première')}</Form.Label>
        <Form.Control
          type="text"
          name="origineMatiere"
          value={postData.origineMatiere || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_origin', 'Pays/région d\'origine')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Produits d'hygiène
    'typeProduitHygiene': (
      <Form.Group>
        <Form.Label>🧴 {t('hygiene_product_type', 'Type de produit hygiène')}</Form.Label>
        <Form.Select
          name="typeProduitHygiene"
          value={postData.typeProduitHygiene || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_hygiene_product', 'Sélectionnez')}</option>
          <option value="nettoyage">{t('cleaning', 'Nettoyage')}</option>
          <option value="desinfection">{t('disinfection', 'Désinfection')}</option>
          <option value="detergent">{t('detergent', 'Détergent')}</option>
          <option value="savon">{t('soap', 'Savon')}</option>
          <option value="shampoing">{t('shampoo', 'Shampoing')}</option>
          <option value="papier_toilette">{t('toilet_paper', 'Papier toilette')}</option>
          <option value="essuie_tout">{t('paper_towels', 'Essuie-tout')}</option>
          <option value="produits_feminins">{t('feminine_products', 'Produits féminins')}</option>
          <option value="couches">{t('diapers', 'Couches')}</option>
          <option value="produits_bebe">{t('baby_products', 'Produits bébé')}</option>
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
          placeholder={t('enter_product_brand', 'Ex: Procter & Gamble, Unilever...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'quantiteProduit': (
      <Form.Group>
        <Form.Label>📦 {t('product_quantity', 'Quantité du produit')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="quantiteProduit"
              value={postData.quantiteProduit || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_quantity', 'Ex: 100')}
              min="0"
              step="1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteQuantiteProduit"
              value={postData.uniteQuantiteProduit || 'unites'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="unites">{t('units', 'Unités')}</option>
              <option value="paquets">{t('packets', 'Paquets')}</option>
              <option value="cartons">{t('cartons', 'Cartons')}</option>
              <option value="rouleaux">{t('rolls', 'Rouleaux')}</option>
              <option value="bouteilles">{t('bottles', 'Bouteilles')}</option>
              <option value="sacs">{t('bags', 'Sacs')}</option>
              <option value="L">L</option>
              <option value="kg">kg</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'datePeremption': (
      <Form.Group>
        <Form.Label>📅 {t('expiration_date', 'Date de péremption')}</Form.Label>
        <Form.Control
          type="date"
          name="datePeremption"
          value={postData.datePeremption || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Matériel agricole
    'typeMaterielAgricole': (
      <Form.Group>
        <Form.Label>🚜 {t('agricultural_equipment_type', 'Type de matériel agricole')}</Form.Label>
        <Form.Select
          name="typeMaterielAgricole"
          value={postData.typeMaterielAgricole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_agri_equipment', 'Sélectionnez')}</option>
          <option value="tracteur">{t('tractor', 'Tracteur')}</option>
          <option value="moissonneuse">{t('harvester', 'Moissonneuse')}</option>
          <option value="semoir">{t('seeder', 'Semoir')}</option>
          <option value="pulverisateur">{t('sprayer', 'Pulvérisateur')}</option>
          <option value="remorque">{t('trailer', 'Remorque')}</option>
          <option value="charrues">{t('plows', 'Charrue')}</option>
          <option value="herse">{t('harrow', 'Herse')}</option>
          <option value="faucheuse">{t('mower', 'Faucheuse')}</option>
          <option value="presse">{t('baler', 'Presse à balles')}</option>
          <option value="outils_animaux">{t('animal_tools', 'Outils pour animaux')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueMaterielAgricole': (
      <Form.Group>
        <Form.Label>🏷️ {t('agri_equipment_brand', 'Marque matériel agricole')}</Form.Label>
        <Form.Select
          name="marqueMaterielAgricole"
          value={postData.marqueMaterielAgricole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_brand', 'Sélectionnez')}</option>
          <option value="john_deere">John Deere</option>
          <option value="case_ih">Case IH</option>
          <option value="new_holland">New Holland</option>
          <option value="massey_ferguson">Massey Ferguson</option>
          <option value="fendt">Fendt</option>
          <option value="claas">Claas</option>
          <option value="kubota">Kubota</option>
          <option value="valtra">Valtra</option>
          <option value="autre">{t('other', 'Autre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'puissanceAgricole': (
      <Form.Group>
        <Form.Label>💪 {t('agricultural_power', 'Puissance')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="puissanceAgricole"
              value={postData.puissanceAgricole || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_power', 'Ex: 120')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="unitePuissanceAgricole"
              value={postData.unitePuissanceAgricole || 'CV'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="CV">CV</option>
              <option value="HP">{t('hp', 'HP')}</option>
              <option value="kW">kW</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'etatAgricole': (
      <Form.Group>
        <Form.Label>🔄 {t('agricultural_condition', 'État du matériel')}</Form.Label>
        <Form.Select
          name="etatAgricole"
          value={postData.etatAgricole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="bon">{t('good', 'Bon état')}</option>
          <option value="fonctionnel">{t('working', 'Fonctionnel')}</option>
          <option value="entretien">{t('needs_maintenance', 'Entretien nécessaire')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
          <option value="pour_pieces">{t('for_parts', 'Pour pièces détachées')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Autre
    'descriptionSpecifique': (
      <Form.Group>
        <Form.Label>📝 {t('specific_description', 'Description spécifique')}</Form.Label>
        <Form.Control
          as="textarea"
          name="descriptionSpecifique"
          value={postData.descriptionSpecifique || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_specific_description', 'Décrivez ce matériau/équipement en détail...')}
          rows={3}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
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

export default MateriauxFields;