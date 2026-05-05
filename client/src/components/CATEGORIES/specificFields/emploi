import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EmploiFields = ({ fieldName, postData, handleChangeInput, subCategory, isRTL }) => {
  const { t } = useTranslation();
  
  // ✅ FUNCIÓN PARA CAMPOS ESPECÍFICOS POR SUBCATEGORÍA
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'offres_emploi': {
        'typeContrat': 'typeContrat',
        'poste': 'poste',
        'secteurActivite': 'secteurActivite',
        'experienceRequise': 'experienceRequise',
        'niveauEtude': 'niveauEtude',
        'lieuTravail': 'lieuTravail',
        'salaire': 'salaire',
        'avantages': 'avantages',
        'missions': 'missions',
        'competencesRequises': 'competencesRequises',
        'dateDebut': 'dateDebut',
        'processusRecrutement': 'processusRecrutement',
        'contactRecruteur': 'contactRecruteur'
      },
      'demandes_emploi': {
        'posteRecherche': 'posteRecherche',
        'secteurRecherche': 'secteurRecherche',
        'typeContratSouhaite': 'typeContratSouhaite',
        'experienceProfessionnelle': 'experienceProfessionnelle',
        'niveauEtude': 'niveauEtude',
        'competences': 'competences',
        'langues': 'langues',
        'permisConduire': 'permisConduire',
        'disponibilite': 'disponibilite',
        'mobilite': 'mobilite',
        'pretentionsSalariales': 'pretentionsSalariales',
        'cvDisponible': 'cvDisponible',
        'lettreMotivation': 'lettreMotivation',
        'contactCandidat': 'contactCandidat'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  // ✅ OBJETO CON TODOS LOS CAMPOS DE EMPLOI
  const fields = {
    // Offres d'emploi
    'typeContrat': (
      <Form.Group>
        <Form.Label>📄 {t('contract_type', 'Type de contrat')}</Form.Label>
        <Form.Select
          name="typeContrat"
          value={postData.typeContrat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_contract_type', 'Sélectionnez')}</option>
          <option value="cdi">📅 CDI (Contrat à durée indéterminée)</option>
          <option value="cdd">📅 CDD (Contrat à durée déterminée)</option>
          <option value="interim">⏱️ Intérim</option>
          <option value="stage">🎓 Stage</option>
          <option value="alternance">🎓 Alternance</option>
          <option value="freelance">💻 Freelance/Indépendant</option>
          <option value="temps_partiel">⏰ Temps partiel</option>
          <option value="saisonnier">🌞 Saisonnier</option>
          <option value="apprentissage">🎓 Apprentissage</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'poste': (
      <Form.Group>
        <Form.Label>👨‍💼 {t('job_position', 'Poste proposé')}</Form.Label>
        <Form.Control
          type="text"
          name="poste"
          value={postData.poste || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_job_position', 'Ex: Développeur web, Commercial, Comptable...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'secteurActivite': (
      <Form.Group>
        <Form.Label>🏢 {t('industry_sector', 'Secteur d\'activité')}</Form.Label>
        <Form.Select
          name="secteurActivite"
          value={postData.secteurActivite || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_industry', 'Sélectionnez')}</option>
          <option value="informatique">💻 Informatique & Tech</option>
          <option value="commerce">🛒 Commerce & Vente</option>
          <option value="banque">💰 Banque & Finance</option>
          <option value="sante">🏥 Santé & Social</option>
          <option value="education">🎓 Éducation & Formation</option>
          <option value="industrie">🏭 Industrie & Production</option>
          <option value="batiment">🏗️ Bâtiment & Construction</option>
          <option value="tourisme">🏨 Tourisme & Hôtellerie</option>
          <option value="communication">📢 Communication & Médias</option>
          <option value="transport">🚚 Transport & Logistique</option>
          <option value="agriculture">🌾 Agriculture & Agroalimentaire</option>
          <option value="administration">🏛️ Administration Publique</option>
          <option value="autres">🔧 Autres secteurs</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'experienceRequise': (
      <Form.Group>
        <Form.Label>📅 {t('required_experience', 'Expérience requise')}</Form.Label>
        <Form.Select
          name="experienceRequise"
          value={postData.experienceRequise || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_experience', 'Sélectionnez')}</option>
          <option value="debutant">👶 Débutant (0-2 ans)</option>
          <option value="junior">👨‍💼 Junior (2-5 ans)</option>
          <option value="confirme">👨‍💼 Confirmé (5-10 ans)</option>
          <option value="senior">👴 Senior (10+ ans)</option>
          <option value="expert">🎯 Expert (15+ ans)</option>
          <option value="aucune">❌ Aucune expérience requise</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'niveauEtude': (
      <Form.Group>
        <Form.Label>🎓 {t('education_level', 'Niveau d\'études')}</Form.Label>
        <Form.Select
          name="niveauEtude"
          value={postData.niveauEtude || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_education_level', 'Sélectionnez')}</option>
          <option value="aucun">❌ Aucun diplôme</option>
          <option value="bac">📜 Bac</option>
          <option value="bac_2">📜 Bac+2 (BTS, DUT)</option>
          <option value="bac_3">📜 Bac+3 (Licence)</option>
          <option value="bac_5">📜 Bac+5 (Master, Ingénieur)</option>
          <option value="doctorat">📜 Doctorat</option>
          <option value="non_requis">🎯 Non requis</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'lieuTravail': (
      <Form.Group>
        <Form.Label>📍 {t('work_location', 'Lieu de travail')}</Form.Label>
        <Form.Control
          type="text"
          name="lieuTravail"
          value={postData.lieuTravail || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_work_location', 'Ex: Alger centre, Télétravail, Hybride...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'salaire': (
      <Form.Group>
        <Form.Label>💰 {t('salary', 'Salaire proposé')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="text"
              name="salaire"
              value={postData.salaire || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_salary', 'Ex: 60000 DA, 800-1000€, Sur CV...')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          <Col>
            <Form.Select
              name="periodeSalaire"
              value={postData.periodeSalaire || 'mensuel'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="mensuel">{t('monthly', 'Mensuel')}</option>
              <option value="annuel">{t('annual', 'Annuel')}</option>
              <option value="horaire">{t('hourly', 'Horaire')}</option>
              <option value="forfait">{t('package', 'Forfait')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'avantages': (
      <Form.Group>
        <Form.Label>🎁 {t('benefits', 'Avantages')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="checkbox"
            name="mutuelle"
            label={t('health_insurance', 'Mutuelle santé')}
            checked={postData.mutuelle || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="ticketsResto"
            label={t('meal_vouchers', 'Tickets restaurant')}
            checked={postData.ticketsResto || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="transport"
            label={t('transport_allowance', 'Prime transport')}
            checked={postData.transport || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="formation"
            label={t('training', 'Formation continue')}
            checked={postData.formation || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="teletravail"
            label={t('remote_work', 'Télétravail possible')}
            checked={postData.teletravail || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="conges"
            label={t('extra_leave', 'Jours de congés supplémentaires')}
            checked={postData.conges || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'missions': (
      <Form.Group>
        <Form.Label>📋 {t('missions', 'Missions principales')}</Form.Label>
        <Form.Control
          as="textarea"
          name="missions"
          value={postData.missions || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_missions', 'Décrivez les principales missions du poste...')}
          rows={3}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'competencesRequises': (
      <Form.Group>
        <Form.Label>🎯 {t('required_skills', 'Compétences requises')}</Form.Label>
        <Form.Control
          as="textarea"
          name="competencesRequises"
          value={postData.competencesRequises || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_required_skills', 'Liste des compétences techniques et comportementales requises...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'dateDebut': (
      <Form.Group>
        <Form.Label>📅 {t('start_date', 'Date de début')}</Form.Label>
        <Form.Control
          type="date"
          name="dateDebut"
          value={postData.dateDebut || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Form.Text className="text-muted">
          💡 {t('start_date_tip', 'Date prévue pour le début du contrat')}
        </Form.Text>
      </Form.Group>
    ),
    
    'processusRecrutement': (
      <Form.Group>
        <Form.Label>📝 {t('recruitment_process', 'Processus de recrutement')}</Form.Label>
        <Form.Control
          as="textarea"
          name="processusRecrutement"
          value={postData.processusRecrutement || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_recruitment_process', 'Étapes du recrutement, tests, entretiens...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'contactRecruteur': (
      <Form.Group>
        <Form.Label>📞 {t('recruiter_contact', 'Contact recruteur')}</Form.Label>
        <Form.Control
          type="text"
          name="contactRecruteur"
          value={postData.contactRecruteur || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_recruiter_contact', 'Nom, email, téléphone pour postuler...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    // Demandes d'emploi
    'posteRecherche': (
      <Form.Group>
        <Form.Label>👨‍💼 {t('desired_position', 'Poste recherché')}</Form.Label>
        <Form.Control
          type="text"
          name="posteRecherche"
          value={postData.posteRecherche || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_desired_position', 'Ex: Développeur web, Commercial, Comptable...')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'secteurRecherche': (
      <Form.Group>
        <Form.Label>🏢 {t('desired_sector', 'Secteur recherché')}</Form.Label>
        <Form.Select
          name="secteurRecherche"
          value={postData.secteurRecherche || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_desired_sector', 'Sélectionnez')}</option>
          <option value="informatique">💻 Informatique & Tech</option>
          <option value="commerce">🛒 Commerce & Vente</option>
          <option value="banque">💰 Banque & Finance</option>
          <option value="sante">🏥 Santé & Social</option>
          <option value="education">🎓 Éducation & Formation</option>
          <option value="industrie">🏭 Industrie & Production</option>
          <option value="batiment">🏗️ Bâtiment & Construction</option>
          <option value="tourisme">🏨 Tourisme & Hôtellerie</option>
          <option value="communication">📢 Communication & Médias</option>
          <option value="transport">🚚 Transport & Logistique</option>
          <option value="agriculture">🌾 Agriculture & Agroalimentaire</option>
          <option value="administration">🏛️ Administration Publique</option>
          <option value="tous">🌍 Tous secteurs</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'typeContratSouhaite': (
      <Form.Group>
        <Form.Label>📄 {t('desired_contract_type', 'Type de contrat souhaité')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="checkbox"
            name="cdi"
            label="CDI"
            checked={postData.cdi || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="cdd"
            label="CDD"
            checked={postData.cdd || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="interim"
            label="Intérim"
            checked={postData.interim || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="stage"
            label="Stage"
            checked={postData.stage || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="alternance"
            label="Alternance"
            checked={postData.alternance || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="freelance"
            label="Freelance"
            checked={postData.freelance || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'experienceProfessionnelle': (
      <Form.Group>
        <Form.Label>📅 {t('professional_experience', 'Expérience professionnelle')}</Form.Label>
        <Form.Select
          name="experienceProfessionnelle"
          value={postData.experienceProfessionnelle || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_experience', 'Sélectionnez')}</option>
          <option value="aucune">👶 Aucune expérience</option>
          <option value="moins_1">👶 Moins de 1 an</option>
          <option value="1_3">👨‍💼 1-3 ans</option>
          <option value="3_5">👨‍💼 3-5 ans</option>
          <option value="5_10">👨‍💼 5-10 ans</option>
          <option value="10_plus">👴 10+ ans</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'competences': (
      <Form.Group>
        <Form.Label>🎯 {t('skills', 'Compétences')}</Form.Label>
        <Form.Control
          as="textarea"
          name="competences"
          value={postData.competences || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_skills', 'Compétences techniques, logiciels maîtrisés, langages...')}
          rows={2}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'langues': (
      <Form.Group>
        <Form.Label>🗣️ {t('languages', 'Langues parlées')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="checkbox"
            name="arabe"
            label="🇩🇿 Arabe"
            checked={postData.arabe || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="francais"
            label="🇫🇷 Français"
            checked={postData.francais || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="anglais"
            label="🇬🇧 Anglais"
            checked={postData.anglais || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="espagnol"
            label="🇪🇸 Espagnol"
            checked={postData.espagnol || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="allemand"
            label="🇩🇪 Allemand"
            checked={postData.allemand || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="autres_langues"
            label="🌍 Autres"
            checked={postData.autres_langues || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'permisConduire': (
      <Form.Group>
        <Form.Label>🚗 {t('driving_license', 'Permis de conduire')}</Form.Label>
        <Form.Select
          name="permisConduire"
          value={postData.permisConduire || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_license', 'Sélectionnez')}</option>
          <option value="aucun">❌ Aucun</option>
          <option value="a">🛵 Permis A (Moto)</option>
          <option value="b">🚗 Permis B (Voiture)</option>
          <option value="c">🚚 Permis C (Poids lourd)</option>
          <option value="d">🚌 Permis D (Bus)</option>
          <option value="b_voiture">🚗 Permis B (Voiture + Utilitaire)</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'disponibilite': (
      <Form.Group>
        <Form.Label>⏰ {t('availability', 'Disponibilité')}</Form.Label>
        <Form.Select
          name="disponibilite"
          value={postData.disponibilite || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_availability', 'Sélectionnez')}</option>
          <option value="immediate">⚡ Immédiate</option>
          <option value="1_semaine">📅 1 semaine</option>
          <option value="2_semaines">📅 2 semaines</option>
          <option value="1_mois">📅 1 mois</option>
          <option value="2_mois">📅 2 mois</option>
          <option value="negociable">🤝 Négociable</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'mobilite': (
      <Form.Group>
        <Form.Label>🌍 {t('mobility', 'Mobilité géographique')}</Form.Label>
        <div className="d-flex flex-wrap gap-3">
          <Form.Check
            type="checkbox"
            name="mobiliteLocale"
            label={t('local_mobility', 'Locale')}
            checked={postData.mobiliteLocale || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="mobiliteNationale"
            label={t('national_mobility', 'Nationale')}
            checked={postData.mobiliteNationale || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="mobiliteInternationale"
            label={t('international_mobility', 'Internationale')}
            checked={postData.mobiliteInternationale || false}
            onChange={handleChangeInput}
            className="mb-1"
          />
          <Form.Check
            type="checkbox"
            name="teletravailPossible"
            label={t('remote_work_possible', 'Télétravail possible')}
            checked={postData.teletravailPossible || false}
            onChange={handleChangeInput}
          />
        </div>
      </Form.Group>
    ),
    
    'pretentionsSalariales': (
      <Form.Group>
        <Form.Label>💰 {t('salary_expectations', 'Prétentions salariales')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="text"
              name="pretentionsSalariales"
              value={postData.pretentionsSalariales || ''}
              onChange={handleChangeInput}
              placeholder={t('enter_salary_expectations', 'Ex: 60000 DA, 800-1000€, Négociable...')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          <Col>
            <Form.Select
              name="periodePretentions"
              value={postData.periodePretentions || 'mensuel'}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="mensuel">{t('monthly', 'Mensuel')}</option>
              <option value="annuel">{t('annual', 'Annuel')}</option>
              <option value="horaire">{t('hourly', 'Horaire')}</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),
    
    'cvDisponible': (
      <Form.Group>
        <Form.Label>📄 {t('cv_available', 'CV disponible')}</Form.Label>
        <Form.Check
          type="switch"
          name="cvDisponible"
          checked={postData.cvDisponible || false}
          onChange={(e) => handleChangeInput({
            target: {
              name: 'cvDisponible',
              value: e.target.checked
            }
          })}
          label={postData.cvDisponible ? t('yes', 'Oui') : t('no', 'Non')}
          reverse={isRTL}
        />
        {postData.cvDisponible && (
          <Form.Text className="text-muted">
            💡 {t('cv_available_tip', 'Le CV sera envoyé sur demande ou lors de la candidature')}
          </Form.Text>
        )}
      </Form.Group>
    ),
    
    'lettreMotivation': (
      <Form.Group>
        <Form.Label>📝 {t('cover_letter', 'Lettre de motivation')}</Form.Label>
        <Form.Control
          as="textarea"
          name="lettreMotivation"
          value={postData.lettreMotivation || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_cover_letter', 'Résumé de votre parcours, motivations, objectifs...')}
          rows={3}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    ),
    
    'contactCandidat': (
      <Form.Group>
        <Form.Label>📞 {t('candidate_contact', 'Contact candidat')}</Form.Label>
        <Row className="mb-2">
          <Col>
            <Form.Control
              type="text"
              name="nomCandidat"
              value={postData.nomCandidat || ''}
              onChange={handleChangeInput}
              placeholder={t('last_name', 'Nom')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              name="prenomCandidat"
              value={postData.prenomCandidat || ''}
              onChange={handleChangeInput}
              placeholder={t('first_name', 'Prénom')}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </Col>
        </Row>
        <Form.Control
          type="email"
          name="emailCandidat"
          value={postData.emailCandidat || ''}
          onChange={handleChangeInput}
          placeholder={t('email', 'Email')}
          className="mb-2"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Form.Control
          type="tel"
          name="telephoneCandidat"
          value={postData.telephoneCandidat || ''}
          onChange={handleChangeInput}
          placeholder={t('phone', 'Téléphone')}
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
          placeholder={t('enter_price', 'Pour offres: frais de recrutement, Pour demandes: honoraires...')}
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
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en EmploiFields para "${subCategory}"`);
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

export default EmploiFields;