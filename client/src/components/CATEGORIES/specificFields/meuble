import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const MeublesFields = ({ fieldName, postData, handleChangeInput, subCategory, articleType, isRTL }) => {
  const { t } = useTranslation();
  
  // Campos específicos para cada subcategoría
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      // Meubles Maison (muebles de casa general)
      'meubles_maison': {
        'typeMeuble': 'typeMeuble',
        'materiau': 'materiau',
        'style': 'style',
        'dimensions': 'dimensions',
        'couleur': 'couleur',
        'etat': 'etat'
      },
      
      // Décoration
      'decoration': {
        'typeDecoration': 'typeDecoration',
        'materiau': 'materiau',
        'couleur': 'couleur',
        'dimensions': 'dimensions',
        'style': 'style',
        'etat': 'etat'
      },
      
      // Vaisselle
      'vaisselle': {
        'typeVaisselle': 'typeVaisselle',
        'materiau': 'materiau',
        'nombrePieces': 'nombrePieces',
        'etat': 'etat',
        'capacite': 'capaciteVaisselle'
      },
      
      // Meubles Bureau
      'meubles_bureau': {
        'typeBureau': 'typeBureau',
        'materiau': 'materiau',
        'dimensions': 'dimensions',
        'couleur': 'couleur',
        'avecRangement': 'avecRangement',
        'etat': 'etat'
      },
      
      // Rideaux
      'rideaux': {
        'typeRideau': 'typeRideau',
        'materiau': 'materiau',
        'couleur': 'couleur',
        'longueurRideau': 'longueurRideau',
        'largeurRideau': 'largeurRideau',
        'etat': 'etat'
      },
      
      // Literie & Linge
      'literie_linge': {
        'tailleLit': 'tailleLit',
        'typeMatelas': 'typeMatelas',
        'materiauLinge': 'materiauLinge',
        'couleur': 'couleur',
        'nombrePieces': 'nombrePiecesLinge',
        'etat': 'etat'
      },
      
      // Puériculture
      'puericulture': {
        'ageEnfant': 'ageEnfant',
        'typeProduit': 'typeProduitPuériculture',
        'materiau': 'materiau',
        'couleur': 'couleur',
        'etat': 'etat',
        'securite': 'securite'
      },
      
      // Tapis & Moquettes
      'tapis_moquettes': {
        'typeTapis': 'typeTapis',
        'formeTapis': 'formeTapis',
        'materiau': 'materiau',
        'dimensions': 'dimensions',
        'couleur': 'couleur',
        'etat': 'etat'
      },
      
      // Meubles Extérieur
      'meubles_exterieur': {
        'typeMeubleExterieur': 'typeMeubleExterieur',
        'materiau': 'materiau',
        'resistance': 'resistanceMeteo',
        'couleur': 'couleur',
        'dimensions': 'dimensions',
        'etat': 'etat'
      },
      
      // Fournitures Scolaires
      'fournitures_scolaires': {
        'typeFourniture': 'typeFourniture',
        'marque': 'marque',
        'couleur': 'couleur',
        'quantite': 'quantite',
        'etat': 'etat'
      },
      
      // Luminaire
      'luminaire': {
        'typeLuminaire': 'typeLuminaire',
        'materiau': 'materiau',
        'couleur': 'couleur',
        'puissance': 'puissance',
        'typeAmpoule': 'typeAmpoule',
        'etat': 'etat'
      },
      
      // Autre
      'autre': {
        'description': 'descriptionSpecifique',
        'dimensions': 'dimensions',
        'materiau': 'materiau',
        'etat': 'etat'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    // Campos generales para muebles
    'materiau': (
      <Form.Group>
        <Form.Label>🪵 {t('material', 'Matériau')}</Form.Label>
        <Form.Select
          name="materiau"
          value={postData.materiau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material', 'Sélectionnez')}</option>
          <option value="bois">{t('wood', 'Bois')}</option>
          <option value="metal">{t('metal', 'Métal')}</option>
          <option value="verre">{t('glass', 'Verre')}</option>
          <option value="plastique">{t('plastic', 'Plastique')}</option>
          <option value="cuir">{t('leather', 'Cuir')}</option>
          <option value="tissu">{t('fabric', 'Tissu')}</option>
          <option value="rotin">{t('rattan', 'Rotin')}</option>
          <option value="osier">{t('wicker', 'Osier')}</option>
          <option value="marbre">{t('marble', 'Marbre')}</option>
          <option value="pierre">{t('stone', 'Pierre')}</option>
          <option value="ceramique">{t('ceramic', 'Céramique')}</option>
          <option value="porcelaine">{t('porcelain', 'Porcelaine')}</option>
          <option value="inox">{t('stainless_steel', 'Inox')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'couleur': (
      <Form.Group>
        <Form.Label>🎨 {t('color', 'Couleur')}</Form.Label>
        <Form.Select
          name="couleur"
          value={postData.couleur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_color', 'Sélectionnez')}</option>
          <option value="blanc">{t('white', 'Blanc')}</option>
          <option value="noir">{t('black', 'Noir')}</option>
          <option value="gris">{t('grey', 'Gris')}</option>
          <option value="marron">{t('brown', 'Marron')}</option>
          <option value="beige">{t('beige', 'Beige')}</option>
          <option value="bleu">{t('blue', 'Bleu')}</option>
          <option value="vert">{t('green', 'Vert')}</option>
          <option value="rouge">{t('red', 'Rouge')}</option>
          <option value="jaune">{t('yellow', 'Jaune')}</option>
          <option value="orange">{t('orange', 'Orange')}</option>
          <option value="rose">{t('pink', 'Rose')}</option>
          <option value="violet">{t('purple', 'Violet')}</option>
          <option value="multicolore">{t('multicolor', 'Multicolore')}</option>
          <option value="bois_naturel">{t('natural_wood', 'Bois naturel')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dimensions': (
      <Form.Group>
        <Form.Label>📐 {t('dimensions', 'Dimensions')}</Form.Label>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="number"
              name="longueur"
              value={postData.longueur || ''}
              onChange={handleChangeInput}
              placeholder={t('length', 'Longueur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="largeur"
              value={postData.largeur || ''}
              onChange={handleChangeInput}
              placeholder={t('width', 'Largeur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="hauteur"
              value={postData.hauteur || ''}
              onChange={handleChangeInput}
              placeholder={t('height', 'Hauteur')}
              min="0"
              step="0.1"
            />
          </Col>
        </Row>
        <Form.Select
          name="uniteDimensions"
          value={postData.uniteDimensions || 'cm'}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="cm">cm</option>
          <option value="m">m</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'poids': (
      <Form.Group>
        <Form.Label>⚖️ {t('weight', 'Poids')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="poids"
              value={postData.poids || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_weight', 'Ex: 15')}
              min="0"
              step="0.1"
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
              <option value="g">g</option>
            </Form.Select>
          </Col>
        </Row>
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
          <option value="neuf">{t('new', 'Neuf (avec étiquette)')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="bon">{t('good', 'Bon état')}</option>
          <option value="moyen">{t('average', 'État moyen')}</option>
          <option value="a_renover">{t('to_renovate', 'À rénover')}</option>
          <option value="antique">{t('antique', 'Antique')}</option>
          <option value="collection">{t('collector', 'Pièce de collection')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'style': (
      <Form.Group>
        <Form.Label>🏛️ {t('style', 'Style')}</Form.Label>
        <Form.Select
          name="style"
          value={postData.style || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_style', 'Sélectionnez')}</option>
          <option value="moderne">{t('modern', 'Moderne')}</option>
          <option value="classique">{t('classic', 'Classique')}</option>
          <option value="contemporain">{t('contemporary', 'Contemporain')}</option>
          <option value="industriel">{t('industrial', 'Industriel')}</option>
          <option value="scandinave">{t('scandinavian', 'Scandinave')}</option>
          <option value="rustique">{t('rustic', 'Rustique')}</option>
          <option value="vintage">{t('vintage', 'Vintage')}</option>
          <option value="retro">{t('retro', 'Rétro')}</option>
          <option value="traditionnel">{t('traditional', 'Traditionnel')}</option>
          <option value="minimaliste">{t('minimalist', 'Minimaliste')}</option>
          <option value="designer">{t('designer', 'Designer')}</option>
          <option value="ethnique">{t('ethnic', 'Ethnique')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Campos específicos para cada subcategoría
    
    // Meubles Maison
    'typeMeuble': (
      <Form.Group>
        <Form.Label>🪑 {t('furniture_type', 'Type de meuble')}</Form.Label>
        <Form.Select
          name="typeMeuble"
          value={postData.typeMeuble || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_furniture_type', 'Sélectionnez')}</option>
          <option value="canape">{t('sofa', 'Canapé')}</option>
          <option value="fauteuil">{t('armchair', 'Fauteuil')}</option>
          <option value="table_basse">{t('coffee_table', 'Table basse')}</option>
          <option value="table_manger">{t('dining_table', 'Table à manger')}</option>
          <option value="chaise">{t('chair', 'Chaise')}</option>
          <option value="armoire">{t('wardrobe', 'Armoire')}</option>
          <option value="commode">{t('dresser', 'Commode')}</option>
          <option value="buffet">{t('sideboard', 'Buffet')}</option>
          <option value="etagere">{t('shelf', 'Étagère')}</option>
          <option value="bibliotheque">{t('bookcase', 'Bibliothèque')}</option>
          <option value="coiffeuse">{t('dressing_table', 'Coiffeuse')}</option>
          <option value="paravent">{t('screen', 'Paravent')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Décoration
    'typeDecoration': (
      <Form.Group>
        <Form.Label>🎨 {t('decoration_type', 'Type de décoration')}</Form.Label>
        <Form.Select
          name="typeDecoration"
          value={postData.typeDecoration || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_decoration_type', 'Sélectionnez')}</option>
          <option value="tableau">{t('painting', 'Tableau')}</option>
          <option value="miroir">{t('mirror', 'Miroir')}</option>
          <option value="vase">{t('vase', 'Vase')}</option>
          <option value="statue">{t('statue', 'Statue')}</option>
          <option value="horloge">{t('clock', 'Horloge')}</option>
          <option value="bougeoir">{t('candle_holder', 'Bougeoir')}</option>
          <option value="coussin">{t('cushion', 'Coussin')}</option>
          <option value="tapis">{t('rug', 'Tapis')}</option>
          <option value="objet_art">{t('art_object', 'Objet d\'art')}</option>
          <option value="cadre_photo">{t('photo_frame', 'Cadre photo')}</option>
          <option value="plante">{t('plant', 'Plante décorative')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Vaisselle
    'typeVaisselle': (
      <Form.Group>
        <Form.Label>🍽️ {t('tableware_type', 'Type de vaisselle')}</Form.Label>
        <Form.Select
          name="typeVaisselle"
          value={postData.typeVaisselle || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_tableware_type', 'Sélectionnez')}</option>
          <option value="assiette">{t('plate', 'Assiette')}</option>
          <option value="verre">{t('glass', 'Verre')}</option>
          <option value="tasse">{t('cup', 'Tasse')}</option>
          <option value="bol">{t('bowl', 'Bol')}</option>
          <option value="couverts">{t('cutlery', 'Couverts')}</option>
          <option value="plat">{t('dish', 'Plat')}</option>
          <option value="saladier">{t('salad_bowl', 'Saladier')}</option>
          <option value="theiere">{t('teapot', 'Théière')}</option>
          <option value="cafetiere">{t('coffee_pot', 'Cafetière')}</option>
          <option value="service_complet">{t('complete_set', 'Service complet')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'nombrePieces': (
      <Form.Group>
        <Form.Label>🧩 {t('number_pieces', 'Nombre de pièces')}</Form.Label>
        <Form.Select
          name="nombrePieces"
          value={postData.nombrePieces || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_number', 'Sélectionnez')}</option>
          {[1,2,3,4,6,8,10,12,16,20,24,30,36,48,60].map(num => (
            <option key={num} value={num}>{num} {t('pieces', 'pièces')}</option>
          ))}
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteVaisselle': (
      <Form.Group>
        <Form.Label>🥛 {t('capacity', 'Capacité')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="capaciteVaisselle"
              value={postData.capaciteVaisselle || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_capacity', 'Ex: 250')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteCapacite"
              value={postData.uniteCapacite || 'ml'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="ml">ml</option>
              <option value="cl">cl</option>
              <option value="l">l</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Meubles Bureau
    'typeBureau': (
      <Form.Group>
        <Form.Label>💼 {t('office_furniture_type', 'Type de meuble bureau')}</Form.Label>
        <Form.Select
          name="typeBureau"
          value={postData.typeBureau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_office_furniture', 'Sélectionnez')}</option>
          <option value="bureau_travail">{t('desk', 'Bureau de travail')}</option>
          <option value="chaise_bureau">{t('office_chair', 'Chaise de bureau')}</option>
          <option value="armoire_bureau">{t('office_cabinet', 'Armoire de bureau')}</option>
          <option value="etagere_bureau">{t('office_shelf', 'Étagère de bureau')}</option>
          <option value="table_reunion">{t('meeting_table', 'Table de réunion')}</option>
          <option value="fauteuil_direction">{t('executive_chair', 'Fauteuil direction')}</option>
          <option value="pupitre">{t('lectern', 'Pupitre')}</option>
          <option value="classement">{t('filing_cabinet', 'Meuble de classement')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'avecRangement': (
      <Form.Group>
        <Form.Label>🗄️ {t('with_storage', 'Avec rangement')}</Form.Label>
        <Form.Check
          type="switch"
          name="avecRangement"
          checked={postData.avecRangement || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'avecRangement',
              value: e.target.checked
            }
          })}
          label={postData.avecRangement ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
        {postData.avecRangement && (
          <Form.Select
            name="typeRangement"
            value={postData.typeRangement || ''}
            onChange={handleChangeInput}
            className="mt-2"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            <option value="">{t('storage_type', 'Type de rangement')}</option>
            <option value="tiroirs">{t('drawers', 'Tiroirs')}</option>
            <option value="porte">{t('doors', 'Portes')}</option>
            <option value="casiers">{t('compartments', 'Casiers')}</option>
            <option value="etageres">{t('shelves', 'Étagères')}</option>
            <option value="mixte">{t('mixed', 'Mixte')}</option>
          </Form.Select>
        )}
      </Form.Group>
    ),
    
    // Rideaux
    'typeRideau': (
      <Form.Group>
        <Form.Label>🪟 {t('curtain_type', 'Type de rideau')}</Form.Label>
        <Form.Select
          name="typeRideau"
          value={postData.typeRideau || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_curtain_type', 'Sélectionnez')}</option>
          <option value="voilage">{t('sheer', 'Voilage')}</option>
          <option value="opaque">{t('blackout', 'Opaque')}</option>
          <option value="thermique">{t('thermal', 'Thermique')}</option>
          <option value="double_rideau">{t('double_curtain', 'Double rideau')}</option>
          <option value="store_roulant">{t('roller_blind', 'Store roulant')}</option>
          <option value="store_venitien">{t('venetian_blind', 'Store vénitien')}</option>
          <option value="store_japonais">{t('japanese_blind', 'Store japonais')}</option>
          <option value="rideau_thermo">{t('thermal_curtain', 'Rideau thermolaqué')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'longueurRideau': (
      <Form.Group>
        <Form.Label>📏 {t('curtain_length', 'Longueur rideau')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="longueurRideau"
              value={postData.longueurRideau || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_length', 'Longueur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteLongueurRideau"
              value={postData.uniteLongueurRideau || 'cm'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'largeurRideau': (
      <Form.Group>
        <Form.Label>📏 {t('curtain_width', 'Largeur rideau')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="largeurRideau"
              value={postData.largeurRideau || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_width', 'Largeur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteLargeurRideau"
              value={postData.uniteLargeurRideau || 'cm'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="cm">cm</option>
              <option value="m">m</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    // Literie & Linge
    'tailleLit': (
      <Form.Group>
        <Form.Label>📏 {t('bed_size', 'Taille du lit')}</Form.Label>
        <Form.Select
          name="tailleLit"
          value={postData.tailleLit || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_bed_size', 'Sélectionnez')}</option>
          <option value="90x190">{t('single', '90x190 cm - Simple')}</option>
          <option value="100x200">{t('single_large', '100x200 cm - Simple large')}</option>
          <option value="140x190">{t('double', '140x190 cm - Double')}</option>
          <option value="160x200">{t('queen', '160x200 cm - Queen')}</option>
          <option value="180x200">{t('king', '180x200 cm - King')}</option>
          <option value="200x200">{t('super_king', '200x200 cm - Super King')}</option>
          <option value="baby">{t('baby_bed', 'Lit bébé')}</option>
          <option value="enfant">{t('child_bed', 'Lit enfant')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeMatelas': (
      <Form.Group>
        <Form.Label>🛏️ {t('mattress_type', 'Type de matelas')}</Form.Label>
        <Form.Select
          name="typeMatelas"
          value={postData.typeMatelas || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_mattress_type', 'Sélectionnez')}</option>
          <option value="ressorts">{t('spring', 'À ressorts')}</option>
          <option value="mousse">{t('foam', 'Mousse')}</option>
          <option value="latex">{t('latex', 'Latex')}</option>
          <option value="memory_foam">{t('memory_foam', 'Mémoire de forme')}</option>
          <option value="gaufre">{t('waffle', 'Gaufre')}</option>
          <option value="rembourre">{t('padded', 'Rembourré')}</option>
          <option value="doux">{t('soft', 'Doux')}</option>
          <option value="ferme">{t('firm', 'Ferme')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'materiauLinge': (
      <Form.Group>
        <Form.Label>🧵 {t('bedding_material', 'Matériau linge')}</Form.Label>
        <Form.Select
          name="materiauLinge"
          value={postData.materiauLinge || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_bedding_material', 'Sélectionnez')}</option>
          <option value="coton">{t('cotton', 'Coton')}</option>
          <option value="soie">{t('silk', 'Soie')}</option>
          <option value="lin">{t('linen', 'Lin')}</option>
          <option value="satin">{t('satin', 'Satin')}</option>
          <option value="polyester">{t('polyester', 'Polyester')}</option>
          <option value="flanelle">{t('flannel', 'Flanelle')}</option>
          <option value="microfibre">{t('microfiber', 'Microfibre')}</option>
          <option value="velours">{t('velvet', 'Velours')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'nombrePiecesLinge': (
      <Form.Group>
        <Form.Label>🧩 {t('number_bedding_pieces', 'Nombre de pièces')}</Form.Label>
        <Form.Select
          name="nombrePiecesLinge"
          value={postData.nombrePiecesLinge || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_number', 'Sélectionnez')}</option>
          <option value="1">1 {t('piece', 'pièce')}</option>
          <option value="2">2 {t('pieces', 'pièces')}</option>
          <option value="3">3 {t('pieces', 'pièces')}</option>
          <option value="4">4 {t('pieces', 'pièces')}</option>
          <option value="5">5 {t('pieces', 'pièces')}</option>
          <option value="6">6 {t('pieces', 'pièces')}</option>
          <option value="complete">{t('complete_set', 'Ensemble complet')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Puériculture
    'ageEnfant': (
      <Form.Group>
        <Form.Label>👶 {t('child_age', 'Âge enfant')}</Form.Label>
        <Form.Select
          name="ageEnfant"
          value={postData.ageEnfant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_child_age', 'Sélectionnez')}</option>
          <option value="0-3">{t('months_0_3', '0-3 mois')}</option>
          <option value="3-6">{t('months_3_6', '3-6 mois')}</option>
          <option value="6-12">{t('months_6_12', '6-12 mois')}</option>
          <option value="1-2">{t('years_1_2', '1-2 ans')}</option>
          <option value="2-3">{t('years_2_3', '2-3 ans')}</option>
          <option value="3-5">{t('years_3_5', '3-5 ans')}</option>
          <option value="5-7">{t('years_5_7', '5-7 ans')}</option>
          <option value="7+">{t('years_7_plus', '7 ans et plus')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeProduitPuériculture': (
      <Form.Group>
        <Form.Label>👶 {t('childcare_product_type', 'Type de produit puériculture')}</Form.Label>
        <Form.Select
          name="typeProduitPuériculture"
          value={postData.typeProduitPuériculture || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_childcare_product', 'Sélectionnez')}</option>
          <option value="lit_bebe">{t('baby_bed', 'Lit bébé')}</option>
          <option value="parc">{t('playpen', 'Parc')}</option>
          <option value="chaise_haute">{t('high_chair', 'Chaise haute')}</option>
          <option value="transat">{t('bouncer', 'Transat')}</option>
          <option value="poussette">{t('stroller', 'Poussette')}</option>
          <option value="siege_auto">{t('car_seat', 'Siège auto')}</option>
          <option value="baignoire">{t('baby_bath', 'Baignoire bébé')}</option>
          <option value="changer">{t('changing_table', 'Table à langer')}</option>
          <option value="jouet">{t('toy', 'Jouet')}</option>
          <option value="vetement_bebe">{t('baby_clothes', 'Vêtement bébé')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'securite': (
      <Form.Group>
        <Form.Label>🛡️ {t('safety', 'Sécurité')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="normesSecurite"
            label={t('safety_standards', 'Normes de sécurité respectées')}
            checked={postData.normesSecurite || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="antiBasculage"
            label={t('anti_tip', 'Anti-basculement')}
            checked={postData.antiBasculage || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="bordsArrondis"
            label={t('rounded_edges', 'Bords arrondis')}
            checked={postData.bordsArrondis || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="nonToxique"
            label={t('non_toxic', 'Non toxique')}
            checked={postData.nonToxique || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Tapis & Moquettes
    'typeTapis': (
      <Form.Group>
        <Form.Label>🧶 {t('carpet_type', 'Type de tapis')}</Form.Label>
        <Form.Select
          name="typeTapis"
          value={postData.typeTapis || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_carpet_type', 'Sélectionnez')}</option>
          <option value="persan">{t('persian', 'Persan')}</option>
          <option value="berbere">{t('berber', 'Berbère')}</option>
          <option value="oriental">{t('oriental', 'Oriental')}</option>
          <option value="moderne">{t('modern_carpet', 'Moderne')}</option>
          <option value="shaggy">{t('shaggy', 'Shaggy')}</option>
          <option value="velours">{t('velvet', 'Velours')}</option>
          <option value="tresse">{t('braided', 'Tressé')}</option>
          <option value="tapis_enfant">{t('kids_rug', 'Tapis enfant')}</option>
          <option value="tapis_salle_bain">{t('bathroom_mat', 'Tapis salle de bain')}</option>
          <option value="moquette">{t('carpet', 'Moquette')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'formeTapis': (
      <Form.Group>
        <Form.Label>🔵 {t('carpet_shape', 'Forme du tapis')}</Form.Label>
        <Form.Select
          name="formeTapis"
          value={postData.formeTapis || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_shape', 'Sélectionnez')}</option>
          <option value="rectangulaire">{t('rectangular', 'Rectangulaire')}</option>
          <option value="rond">{t('round', 'Rond')}</option>
          <option value="carre">{t('square', 'Carré')}</option>
          <option value="ovale">{t('oval', 'Ovale')}</option>
          <option value="runner">{t('runner', 'Couloir')}</option>
          <option value="hexagonal">{t('hexagonal', 'Hexagonal')}</option>
          <option value="forme_libre">{t('free_form', 'Forme libre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // Meubles Extérieur
    'typeMeubleExterieur': (
      <Form.Group>
        <Form.Label>🌳 {t('outdoor_furniture_type', 'Type de meuble extérieur')}</Form.Label>
        <Form.Select
          name="typeMeubleExterieur"
          value={postData.typeMeubleExterieur || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_outdoor_furniture', 'Sélectionnez')}</option>
          <option value="table_jardin">{t('garden_table', 'Table de jardin')}</option>
          <option value="chaise_jardin">{t('garden_chair', 'Chaise de jardin')}</option>
          <option value="transat">{t('deck_chair', 'Transat')}</option>
          <option value="hamac">{t('hammock', 'Hamac')}</option>
          <option value="banc">{t('bench', 'Banc')}</option>
          <option value="parasol">{t('parasol', 'Parasol')}</option>
          <option value="salon_jardin">{t('garden_set', 'Salon de jardin')}</option>
          <option value="barbecue">{t('barbecue', 'Barbecue')}</option>
          <option value="coffre">{t('chest', 'Coffre de rangement')}</option>
          <option value="pot_fleur">{t('flower_pot', 'Pot de fleurs')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'resistanceMeteo': (
      <Form.Group>
        <Form.Label>🌧️ {t('weather_resistance', 'Résistance aux intempéries')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="resistantPluie"
            label={t('rain_resistant', 'Résistant à la pluie')}
            checked={postData.resistantPluie || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="resistantUV"
            label={t('uv_resistant', 'Résistant aux UV')}
            checked={postData.resistantUV || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="resistantGel"
            label={t('frost_resistant', 'Résistant au gel')}
            checked={postData.resistantGel || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    // Fournitures Scolaires
    'typeFourniture': (
      <Form.Group>
        <Form.Label>📚 {t('school_supplies_type', 'Type de fourniture')}</Form.Label>
        <Form.Select
          name="typeFourniture"
          value={postData.typeFourniture || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_school_supplies', 'Sélectionnez')}</option>
          <option value="cartable">{t('schoolbag', 'Cartable')}</option>
          <option value="cahier">{t('notebook', 'Cahier')}</option>
          <option value="stylo">{t('pen', 'Stylo')}</option>
          <option value="crayon">{t('pencil', 'Crayon')}</option>
          <option value="feutre">{t('marker', 'Feutre')}</option>
          <option value="regle">{t('ruler', 'Règle')}</option>
          <option value="compas">{t('compass', 'Compas')}</option>
          <option value="calculatrice">{t('calculator', 'Calculatrice')}</option>
          <option value="trousse">{t('pencil_case', 'Trousse')}</option>
          <option value="dictionnaire">{t('dictionary', 'Dictionnaire')}</option>
          <option value="livre_scolaire">{t('school_book', 'Livre scolaire')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marque': (
      <Form.Group>
        <Form.Label>🏷️ {t('brand', 'Marque')}</Form.Label>
        <Form.Control
          type="text"
          name="marque"
          value={postData.marque || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brand', 'Ex: Bic, Maped, Parker...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'quantite': (
      <Form.Group>
        <Form.Label>📦 {t('quantity', 'Quantité')}</Form.Label>
        <Form.Control
          type="number"
          name="quantite"
          value={postData.quantite || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_quantity', 'Ex: 10')}
          min="1"
        />
      </Form.Group>
    ),
    
    // Luminaire
    'typeLuminaire': (
      <Form.Group>
        <Form.Label>💡 {t('lighting_type', 'Type de luminaire')}</Form.Label>
        <Form.Select
          name="typeLuminaire"
          value={postData.typeLuminaire || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_lighting_type', 'Sélectionnez')}</option>
          <option value="plafonnier">{t('ceiling_light', 'Plafonnier')}</option>
          <option value="suspension">{t('pendant_light', 'Suspension')}</option>
          <option value="applique">{t('wall_light', 'Applique')}</option>
          <option value="lampe_bureau">{t('desk_lamp', 'Lampe de bureau')}</option>
          <option value="lampe_chevet">{t('bedside_lamp', 'Lampe de chevet')}</option>
          <option value="lampe_plancher">{t('floor_lamp', 'Lampe sur pied')}</option>
          <option value="spot">{t('spotlight', 'Spot')}</option>
          <option value="guirlande">{t('fairy_lights', 'Guirlande lumineuse')}</option>
          <option value="lampadaire">{t('standard_lamp', 'Lampadaire')}</option>
          <option value="lustre">{t('chandelier', 'Lustre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'puissance': (
      <Form.Group>
        <Form.Label>⚡ {t('power', 'Puissance')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="puissance"
              value={postData.puissance || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_power', 'Ex: 60')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="unitePuissance"
              value={postData.unitePuissance || 'W'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="W">W</option>
              <option value="lumens">{t('lumens', 'Lumens')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'typeAmpoule': (
      <Form.Group>
        <Form.Label>💡 {t('bulb_type', 'Type d\'ampoule')}</Form.Label>
        <Form.Select
          name="typeAmpoule"
          value={postData.typeAmpoule || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_bulb_type', 'Sélectionnez')}</option>
          <option value="led">{t('led', 'LED')}</option>
          <option value="halogene">{t('halogen', 'Halogène')}</option>
          <option value="fluocompacte">{t('cfl', 'Fluocompacte')}</option>
          <option value="incandescente">{t('incandescent', 'Incandescente')}</option>
          <option value="smart">{t('smart_bulb', 'Ampoule connectée')}</option>
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
          placeholder={t('enter_specific_description', 'Décrivez cet article en détail...')}
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

export default MeublesFields;