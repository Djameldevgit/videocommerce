import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ReferenceField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  name = 'reference', 
  label = 'reference',
  helpText = null
}) => {
  const { t } = useTranslation('camposcomunes');
  
  return (
    <Form.Group>
      <Form.Label>🏷️ {t(label)}</Form.Label>
      <Form.Control
        type="text"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        placeholder={t('enter_reference', 'Numéro de référence/série')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {helpText && (
        <Form.Text className="text-muted">
          {t(helpText, 'Ex: SN-12345, Ref: ABC-789, IMEI: 123456789012345')}
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default ReferenceField;