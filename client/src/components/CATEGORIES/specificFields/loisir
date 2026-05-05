import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LoisirsFields = ({ fieldName, postData, handleChangeInput, subCategory, articleType, isRTL }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'animalerie': {
        'typeAnimal': 'typeAnimal',
        'ageAnimal': 'ageAnimal',
        'race': 'race',
        'vaccine': 'vaccine'
      },
      'consoles_jeux_videos': {
        'typeConsole': 'typeConsole',
        'etatConsole': 'etatConsole',
        'accessoiresInclus': 'accessoiresInclus',
        'jeuxInclus': 'jeuxInclus'
      },
      'livres_magazines': {
        'typeLivre': 'typeLivre',
        'auteur': 'auteur',
        'edition': 'edition',
        'langue': 'langue'
      },
      'instruments_musique': {
        'typeInstrument': 'typeInstrument',
        'marqueInstrument': 'marqueInstrument',
        'etatInstrument': 'etatInstrument',
        'accordage': 'accordage'
      },
      'jeux_loisirs': {
        'typeJeu': 'typeJeu',
        'nombreJoueurs': 'nombreJoueurs',
        'ageRecommandé': 'ageRecommandé',
        'dureePartie': 'dureePartie'
      },
      'jouets': {
        'typeJouet': 'typeJouet',
        'ageEnfant': 'ageEnfant',
        'marqueJouet': 'marqueJouet',
        'pilesIncluses': 'pilesIncluses'
      },
      'chasse_peche': {
        'typeActivite': 'typeActivite',
        'typeEquipement': 'typeEquipement',
        'marqueEquipement': 'marqueEquipement',
        'etatEquipement': 'etatEquipement'
      },
      'jardinage': {
        'typeOutil': 'typeOutil',
        'marqueOutil': 'marqueOutil',
        'etatOutil': 'etatOutil',
        'puissance': 'puissance'
      },
      'antiquites_collections': {
        'typeObjet': 'typeObjet',
        'periode': 'periode',
        'origine': 'origine',
        'certificatAuthenticite': 'certificatAuthenticite'
      },
      'barbecue_grillades': {
        'typeBarbecue': 'typeBarbecue',
        'materiauBarbecue': 'materiauBarbecue',
        'dimensionsBarbecue': 'dimensionsBarbecue',
        'carburant': 'carburant'
      },
      'vapes_chichas': {
        'typeProduit': 'typeProduit',
        'marqueProduit': 'marqueProduit',
        'capacite': 'capacite',
        'aromesInclus': 'aromesInclus'
      },
      'produits_accesoires_ete': {
        'typeProduit': 'typeProduit',
        'marqueProduit': 'marqueProduit',
        'taille': 'taille',
        'couleur': 'couleur'
      },
      'autre': {
        'descriptionSpecifique': 'descriptionSpecifique'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    // Campos generales
    'typeAnimal': (
      <Form.Group>
        <Form.Label>🐾 {t('animal_type', 'Type d\'animal')}</Form.Label>
        <Form.Select
          name="typeAnimal"
          value={postData.typeAnimal || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_animal_type', 'Sélectionnez')}</option>
          <option value="chien">{t('dog', 'Chien')}</option>
          <option value="chat">{t('cat', 'Chat')}</option>
          <option value="oiseau">{t('bird', 'Oiseau')}</option>
          <option value="rongeur">{t('rodent', 'Rongeur')}</option>
          <option value="poisson">{t('fish', 'Poisson')}</option>
          <option value="reptile">{t('reptile', 'Reptile')}</option>
          <option value="autre">{t('other', 'Autre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'ageAnimal': (
      <Form.Group>
        <Form.Label>📅 {t('animal_age', 'Âge de l\'animal')}</Form.Label>
        <Form.Select
          name="ageAnimal"
          value={postData.ageAnimal || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_age', 'Sélectionnez')}</option>
          <option value="bebe">{t('baby', 'Bébé')}</option>
          <option value="jeune">{t('young', 'Jeune')}</option>
          <option value="adulte">{t('adult', 'Adulte')}</option>
          <option value="senior">{t('senior', 'Senior')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'race': (
      <Form.Group>
        <Form.Label>🏷️ {t('breed', 'Race')}</Form.Label>
        <Form.Control
          type="text"
          name="race"
          value={postData.race || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_breed', 'Ex: Berger Allemand, Persan...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'vaccine': (
      <Form.Group>
        <Form.Label>💉 {t('vaccinated', 'Vacciné')}</Form.Label>
        <Form.Check
          type="switch"
          name="vaccine"
          checked={postData.vaccine || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'vaccine',
              value: e.target.checked
            }
          })}
          label={postData.vaccine ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'typeConsole': (
      <Form.Group>
        <Form.Label>🎮 {t('console_type', 'Type de console')}</Form.Label>
        <Form.Select
          name="typeConsole"
          value={postData.typeConsole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_console', 'Sélectionnez')}</option>
          <option value="playstation">{t('playstation', 'PlayStation')}</option>
          <option value="xbox">{t('xbox', 'Xbox')}</option>
          <option value="nintendo">{t('nintendo', 'Nintendo')}</option>
          <option value="pc_gaming">{t('gaming_pc', 'PC Gaming')}</option>
          <option value="portable">{t('portable', 'Console portable')}</option>
          <option value="arcade">{t('arcade', 'Arcade')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'etatConsole': (
      <Form.Group>
        <Form.Label>🔄 {t('console_condition', 'État de la console')}</Form.Label>
        <Form.Select
          name="etatConsole"
          value={postData.etatConsole || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="fonctionnel">{t('working', 'Fonctionnel')}</option>
          <option value="a_reparer">{t('needs_repair', 'À réparer')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'accessoiresInclus': (
      <Form.Group>
        <Form.Label>🎮 {t('accessories_included', 'Accessoires inclus')}</Form.Label>
        <div className="mb-2">
          <Form.Check
            type="checkbox"
            name="manettes"
            label={t('controllers', 'Manettes')}
            checked={postData.manettes || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="cables"
            label={t('cables', 'Câbles')}
            checked={postData.cables || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="chargeur"
            label={t('charger', 'Chargeur')}
            checked={postData.chargeur || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="boiteOriginale"
            label={t('original_box', 'Boîte originale')}
            checked={postData.boiteOriginale || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'jeuxInclus': (
      <Form.Group>
        <Form.Label>🎮 {t('games_included', 'Jeux inclus')}</Form.Label>
        <Form.Control
          as="textarea"
          name="jeuxInclus"
          value={postData.jeuxInclus || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_games', 'Listez les jeux inclus...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'typeLivre': (
      <Form.Group>
        <Form.Label>📚 {t('book_type', 'Type de livre')}</Form.Label>
        <Form.Select
          name="typeLivre"
          value={postData.typeLivre || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_book_type', 'Sélectionnez')}</option>
          <option value="roman">{t('novel', 'Roman')}</option>
          <option value="policier">{t('crime', 'Policier')}</option>
          <option value="fantastique">{t('fantasy', 'Fantastique')}</option>
          <option value="scientifique">{t('scientific', 'Scientifique')}</option>
          <option value="scolaire">{t('school', 'Scolaire')}</option>
          <option value="bd">{t('comic', 'Bande dessinée')}</option>
          <option value="magazine">{t('magazine', 'Magazine')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'auteur': (
      <Form.Group>
        <Form.Label>✍️ {t('author', 'Auteur')}</Form.Label>
        <Form.Control
          type="text"
          name="auteur"
          value={postData.auteur || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_author', 'Nom de l\'auteur')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'edition': (
      <Form.Group>
        <Form.Label>🏢 {t('edition', 'Édition')}</Form.Label>
        <Form.Control
          type="text"
          name="edition"
          value={postData.edition || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_edition', 'Ex: Gallimard, Hachette...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'langue': (
      <Form.Group>
        <Form.Label>🗣️ {t('language', 'Langue')}</Form.Label>
        <Form.Select
          name="langue"
          value={postData.langue || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_language', 'Sélectionnez')}</option>
          <option value="francais">{t('french', 'Français')}</option>
          <option value="anglais">{t('english', 'Anglais')}</option>
          <option value="arabe">{t('arabic', 'Arabe')}</option>
          <option value="espagnol">{t('spanish', 'Espagnol')}</option>
          <option value="allemand">{t('german', 'Allemand')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeInstrument': (
      <Form.Group>
        <Form.Label>🎵 {t('instrument_type', 'Type d\'instrument')}</Form.Label>
        <Form.Select
          name="typeInstrument"
          value={postData.typeInstrument || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_instrument', 'Sélectionnez')}</option>
          <option value="guitare">{t('guitar', 'Guitare')}</option>
          <option value="piano">{t('piano', 'Piano')}</option>
          <option value="batterie">{t('drums', 'Batterie')}</option>
          <option value="violon">{t('violin', 'Violon')}</option>
          <option value="saxophone">{t('saxophone', 'Saxophone')}</option>
          <option value="flute">{t('flute', 'Flûte')}</option>
          <option value="clavier">{t('keyboard', 'Clavier')}</option>
          <option value="darbouka">{t('darbuka', 'Darbouka')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueInstrument': (
      <Form.Group>
        <Form.Label>🏷️ {t('instrument_brand', 'Marque de l\'instrument')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueInstrument"
          value={postData.marqueInstrument || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brand', 'Ex: Yamaha, Fender, Gibson...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'etatInstrument': (
      <Form.Group>
        <Form.Label>🎵 {t('instrument_condition', 'État de l\'instrument')}</Form.Label>
        <Form.Select
          name="etatInstrument"
          value={postData.etatInstrument || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">{t('new', 'Neuf')}</option>
          <option value="tres_bon">{t('very_good', 'Très bon état')}</option>
          <option value="accordage_necessaire">{t('needs_tuning', 'Accordage nécessaire')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'accordage': (
      <Form.Group>
        <Form.Label>🎵 {t('tuning', 'Accordage')}</Form.Label>
        <Form.Check
          type="switch"
          name="accordage"
          checked={postData.accordage || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'accordage',
              value: e.target.checked
            }
          })}
          label={postData.accordage ? t('tuned', 'Accordé') : t('not_tuned', 'Non accordé')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'typeJeu': (
      <Form.Group>
        <Form.Label>🎲 {t('game_type', 'Type de jeu')}</Form.Label>
        <Form.Select
          name="typeJeu"
          value={postData.typeJeu || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_game_type', 'Sélectionnez')}</option>
          <option value="societe">{t('board_game', 'Jeu de société')}</option>
          <option value="cartes">{t('card_game', 'Jeu de cartes')}</option>
          <option value="strategie">{t('strategy', 'Stratégie')}</option>
          <option value="adresse">{t('skill_game', 'Jeu d\'adresse')}</option>
          <option value="puzzle">{t('puzzle', 'Puzzle')}</option>
          <option value="educatif">{t('educational', 'Éducatif')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'nombreJoueurs': (
      <Form.Group>
        <Form.Label>👥 {t('number_players', 'Nombre de joueurs')}</Form.Label>
        <Form.Select
          name="nombreJoueurs"
          value={postData.nombreJoueurs || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_number', 'Sélectionnez')}</option>
          <option value="1">1 {t('player', 'joueur')}</option>
          <option value="2">2 {t('players', 'joueurs')}</option>
          <option value="2-4">2-4 {t('players', 'joueurs')}</option>
          <option value="2-6">2-6 {t('players', 'joueurs')}</option>
          <option value="2-8">2-8 {t('players', 'joueurs')}</option>
          <option value="4+">4+ {t('players', 'joueurs')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'ageRecommandé': (
      <Form.Group>
        <Form.Label>🎯 {t('recommended_age', 'Âge recommandé')}</Form.Label>
        <Form.Select
          name="ageRecommandé"
          value={postData.ageRecommandé || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_age', 'Sélectionnez')}</option>
          <option value="3+">3+ {t('years', 'ans')}</option>
          <option value="6+">6+ {t('years', 'ans')}</option>
          <option value="8+">8+ {t('years', 'ans')}</option>
          <option value="12+">12+ {t('years', 'ans')}</option>
          <option value="16+">16+ {t('years', 'ans')}</option>
          <option value="18+">18+ {t('years', 'ans')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dureePartie': (
      <Form.Group>
        <Form.Label>⏱️ {t('game_duration', 'Durée d\'une partie')}</Form.Label>
        <Form.Select
          name="dureePartie"
          value={postData.dureePartie || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_duration', 'Sélectionnez')}</option>
          <option value="15">15 {t('minutes', 'minutes')}</option>
          <option value="30">30 {t('minutes', 'minutes')}</option>
          <option value="45">45 {t('minutes', 'minutes')}</option>
          <option value="60">1 {t('hour', 'heure')}</option>
          <option value="90">1h30</option>
          <option value="120">2 {t('hours', 'heures')}</option>
          <option value="variable">{t('variable', 'Variable')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeJouet': (
      <Form.Group>
        <Form.Label>🧸 {t('toy_type', 'Type de jouet')}</Form.Label>
        <Form.Select
          name="typeJouet"
          value={postData.typeJouet || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_toy_type', 'Sélectionnez')}</option>
          <option value="peluche">{t('stuffed_toy', 'Peluche')}</option>
          <option value="voiture">{t('car_toy', 'Voiture')}</option>
          <option value="poupee">{t('doll', 'Poupée')}</option>
          <option value="construction">{t('construction', 'Construction')}</option>
          <option value="educatif">{t('educational', 'Éducatif')}</option>
          <option value="electronique">{t('electronic', 'Électronique')}</option>
          <option value="exterieur">{t('outdoor', 'Extérieur')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
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
          <option value="0-1">0-1 {t('year', 'an')}</option>
          <option value="1-3">1-3 {t('years', 'ans')}</option>
          <option value="3-6">3-6 {t('years', 'ans')}</option>
          <option value="6-9">6-9 {t('years', 'ans')}</option>
          <option value="9-12">9-12 {t('years', 'ans')}</option>
          <option value="12+">12+ {t('years', 'ans')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'marqueJouet': (
      <Form.Group>
        <Form.Label>🏷️ {t('toy_brand', 'Marque du jouet')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueJouet"
          value={postData.marqueJouet || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_toy_brand', 'Ex: Lego, Mattel, Hasbro...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'pilesIncluses': (
      <Form.Group>
        <Form.Label>🔋 {t('batteries_included', 'Piles incluses')}</Form.Label>
        <Form.Check
          type="switch"
          name="pilesIncluses"
          checked={postData.pilesIncluses || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'pilesIncluses',
              value: e.target.checked
            }
          })}
          label={postData.pilesIncluses ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'typeActivite': (
      <Form.Group>
        <Form.Label>🎣 {t('activity_type', 'Type d\'activité')}</Form.Label>
        <Form.Select
          name="typeActivite"
          value={postData.typeActivite || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_activity', 'Sélectionnez')}</option>
          <option value="chasse">{t('hunting', 'Chasse')}</option>
          <option value="peche">{t('fishing', 'Pêche')}</option>
          <option value="tir">{t('shooting', 'Tir')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeEquipement': (
      <Form.Group>
        <Form.Label>🎣 {t('equipment_type', 'Type d\'équipement')}</Form.Label>
        <Form.Control
          type="text"
          name="typeEquipement"
          value={postData.typeEquipement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_equipment', 'Ex: Canne à pêche, Fusil, Appât...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'marqueEquipement': (
      <Form.Group>
        <Form.Label>🏷️ {t('equipment_brand', 'Marque de l\'équipement')}</Form.Label>
        <Form.Control
          type="text"
          name="marqueEquipement"
          value={postData.marqueEquipement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_brand', 'Ex: Shimano, Browning, Winchester...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'etatEquipement': (
      <Form.Group>
        <Form.Label>🔄 {t('equipment_condition', 'État de l\'équipement')}</Form.Label>
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
          <option value="moyen">{t('average', 'État moyen')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeOutil': (
      <Form.Group>
        <Form.Label>🌿 {t('tool_type', 'Type d\'outil')}</Form.Label>
        <Form.Select
          name="typeOutil"
          value={postData.typeOutil || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_tool_type', 'Sélectionnez')}</option>
          <option value="tondeuse">{t('lawnmower', 'Tondeuse')}</option>
          <option value="tronconneuse">{t('chainsaw', 'Tronçonneuse')}</option>
          <option value="taille_haie">{t('hedge_trimmer', 'Taille-haie')}</option>
          <option value="arrosoir">{t('watering_can', 'Arrosoir')}</option>
          <option value="brouette">{t('wheelbarrow', 'Brouette')}</option>
          <option value="outils_main">{t('hand_tools', 'Outils à main')}</option>
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
          placeholder={t('enter_tool_brand', 'Ex: Stihl, Bosch, Gardena...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
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
          <option value="fonctionnel">{t('working', 'Fonctionnel')}</option>
          <option value="entretien_necessaire">{t('needs_maintenance', 'Entretien nécessaire')}</option>
          <option value="reparation">{t('needs_repair', 'Réparation nécessaire')}</option>
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
              placeholder={t('enter_power', 'Ex: 1500')}
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
              <option value="CV">CV</option>
              <option value="cc">{t('cc', 'cm³')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'typeObjet': (
      <Form.Group>
        <Form.Label>🏺 {t('object_type', 'Type d\'objet')}</Form.Label>
        <Form.Select
          name="typeObjet"
          value={postData.typeObjet || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_object_type', 'Sélectionnez')}</option>
          <option value="monnaie">{t('coin', 'Monnaie')}</option>
          <option value="timbre">{t('stamp', 'Timbre')}</option>
          <option value="meuble">{t('furniture', 'Meuble')}</option>
          <option value="bijou">{t('jewelry', 'Bijou')}</option>
          <option value="art">{t('art', 'Œuvre d\'art')}</option>
          <option value="livre">{t('book', 'Livre ancien')}</option>
          <option value="militaria">{t('militaria', 'Militaria')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'periode': (
      <Form.Group>
        <Form.Label>📅 {t('period', 'Période')}</Form.Label>
        <Form.Select
          name="periode"
          value={postData.periode || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_period', 'Sélectionnez')}</option>
          <option value="antique">{t('antique', 'Antique')}</option>
          <option value="medievale">{t('medieval', 'Médiévale')}</option>
          <option value="renaissance">{t('renaissance', 'Renaissance')}</option>
          <option value="19e">{t('19th_century', '19ème siècle')}</option>
          <option value="20e">{t('20th_century', '20ème siècle')}</option>
          <option value="vintage">{t('vintage', 'Vintage')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'origine': (
      <Form.Group>
        <Form.Label>🌍 {t('origin', 'Origine')}</Form.Label>
        <Form.Control
          type="text"
          name="origine"
          value={postData.origine || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_origin', 'Pays/région d\'origine')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'certificatAuthenticite': (
      <Form.Group>
        <Form.Label>📄 {t('authenticity_certificate', 'Certificat d\'authenticité')}</Form.Label>
        <Form.Check
          type="switch"
          name="certificatAuthenticite"
          checked={postData.certificatAuthenticite || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'certificatAuthenticite',
              value: e.target.checked
            }
          })}
          label={postData.certificatAuthenticite ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
      </Form.Group>
    ),
    
    'typeBarbecue': (
      <Form.Group>
        <Form.Label>🔥 {t('barbecue_type', 'Type de barbecue')}</Form.Label>
        <Form.Select
          name="typeBarbecue"
          value={postData.typeBarbecue || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_barbecue_type', 'Sélectionnez')}</option>
          <option value="charbon">{t('charcoal', 'Charbon')}</option>
          <option value="gaz">{t('gas', 'Gaz')}</option>
          <option value="electrique">{t('electric', 'Électrique')}</option>
          <option value="portable">{t('portable', 'Portable')}</option>
          <option value="fixe">{t('fixed', 'Fixe')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'materiauBarbecue': (
      <Form.Group>
        <Form.Label>🛠️ {t('barbecue_material', 'Matériau du barbecue')}</Form.Label>
        <Form.Select
          name="materiauBarbecue"
          value={postData.materiauBarbecue || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_material', 'Sélectionnez')}</option>
          <option value="acier">{t('steel', 'Acier')}</option>
          <option value="fonte">{t('cast_iron', 'Fonte')}</option>
          <option value="inox">{t('stainless_steel', 'Inox')}</option>
          <option value="pierre">{t('stone', 'Pierre')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'dimensionsBarbecue': (
      <Form.Group>
        <Form.Label>📏 {t('barbecue_dimensions', 'Dimensions du barbecue')}</Form.Label>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="number"
              name="longueurBarbecue"
              value={postData.longueurBarbecue || ''}
              onChange={handleChangeInput}
              placeholder={t('length', 'Longueur')}
              min="0"
              step="0.1"
            />
          </Col>
          <Col>
            <Form.Control
              type="number"
              name="largeurBarbecue"
              value={postData.largeurBarbecue || ''}
              onChange={handleChangeInput}
              placeholder={t('width', 'Largeur')}
              min="0"
              step="0.1"
            />
          </Col>
        </Row>
        <Form.Select
          name="uniteDimensionsBarbecue"
          value={postData.uniteDimensionsBarbecue || 'cm'}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="cm">cm</option>
          <option value="m">m</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'carburant': (
      <Form.Group>
        <Form.Label>⛽ {t('fuel_type', 'Type de carburant')}</Form.Label>
        <Form.Select
          name="carburant"
          value={postData.carburant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_fuel', 'Sélectionnez')}</option>
          <option value="charbon">{t('charcoal', 'Charbon')}</option>
          <option value="bois">{t('wood', 'Bois')}</option>
          <option value="gaz">{t('gas', 'Gaz')}</option>
          <option value="electricite">{t('electricity', 'Électricité')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeProduit': (
      <Form.Group>
        <Form.Label>💨 {t('product_type', 'Type de produit')}</Form.Label>
        <Form.Select
          name="typeProduit"
          value={postData.typeProduit || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_product_type', 'Sélectionnez')}</option>
          <option value="cigarette_electronique">{t('e_cigarette', 'Cigarette électronique')}</option>
          <option value="chicha">{t('hookah', 'Chicha/Narguilé')}</option>
          <option value="accessoires">{t('accessories', 'Accessoires')}</option>
          <option value="liquides">{t('liquids', 'Liquides')}</option>
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
          placeholder={t('enter_product_brand', 'Ex: Vaporesso, Al Fakher...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'capacite': (
      <Form.Group>
        <Form.Label>💧 {t('capacity', 'Capacité')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="capacite"
              value={postData.capacite || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_capacity', 'Ex: 2000')}
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="uniteCapacite"
              value={postData.uniteCapacite || 'mah'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="mah">{t('mah', 'mAh')}</option>
              <option value="ml">{t('ml', 'ml')}</option>
              <option value="g">{t('g', 'g')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'aromesInclus': (
      <Form.Group>
        <Form.Label>🍓 {t('flavors_included', 'Arômes inclus')}</Form.Label>
        <Form.Control
          as="textarea"
          name="aromesInclus"
          value={postData.aromesInclus || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_flavors', 'Listez les arômes inclus...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'taille': (
      <Form.Group>
        <Form.Label>📏 {t('size', 'Taille')}</Form.Label>
        <Form.Select
          name="taille"
          value={postData.taille || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="unique">{t('unique_size', 'Taille unique')}</option>
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
          <option value="noir">{t('black', 'Noir')}</option>
          <option value="blanc">{t('white', 'Blanc')}</option>
          <option value="bleu">{t('blue', 'Bleu')}</option>
          <option value="rouge">{t('red', 'Rouge')}</option>
          <option value="vert">{t('green', 'Vert')}</option>
          <option value="jaune">{t('yellow', 'Jaune')}</option>
          <option value="orange">{t('orange', 'Orange')}</option>
          <option value="multicolore">{t('multicolor', 'Multicolore')}</option>
        </Form.Select>
      </Form.Group>
    ),
    
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

export default LoisirsFields;