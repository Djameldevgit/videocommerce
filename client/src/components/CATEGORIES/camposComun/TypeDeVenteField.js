import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TypeDeVenteField = ({
  postData = {},
  handleChangeInput,
  name = 'tipoventa',
  label = '🏷️ Tipo de Venta',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation();
  
  // SOLUCIÓN: Usar siempre el mismo name
  const value = postData[name] || '';

  const tiposVenta = [
    { value: "retail", label: "Vente au Détail" },
    { value: "wholesale", label: "Vente en Gros" },
    { value: "both", label: "Vente Détail et Gros" }
  ];

  return (
    <Form.Group className={className}>
      <Form.Label>{label} {required && '*'}</Form.Label>
      
      <Form.Select
        name={name}
        value={value}
        onChange={handleChangeInput}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
      >
        <option value="">Sélectionnez le type de vente</option>
        {tiposVenta.map(tipo => (
          <option key={tipo.value} value={tipo.value}>
            {tipo.label}
          </option>
        ))}
      </Form.Select>
      
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  )
}

export default TypeDeVenteField