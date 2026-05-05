// components/ReportModal.js
import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

const ReportModal = ({ 
  show, 
  onHide, 
  reportReason, 
  setReportReason, 
  onSubmitReport, 
  t 
}) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('reportPublication')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="reportReason">
          <Form.Label>{t('reportReason')}</Form.Label>
          <Form.Select
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
          >
            <option value="">{t('selectReason')}</option>
            <option value="abuse">{t('harassmentOrAbuse')}</option>
            <option value="spam">{t('spam')}</option>
            <option value="terms">{t('termsViolation')}</option>
            <option value="offensive">{t('offensiveContent')}</option>
            <option value="fraud">{t('fraudOrScam')}</option>
            <option value="impersonation">{t('identityTheft')}</option>
            <option value="inappropriate">{t('inappropriateContent')}</option>
            <option value="privacy">{t('privacyViolation')}</option>
            <option value="disruption">{t('serviceDisruption')}</option>
            <option value="suspicious">{t('suspiciousActivity')}</option>
            <option value="other">{t('other')}</option>
          </Form.Select>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
            setReportReason('');
          }}
        >
          {t('cancel')}
        </Button>
        <Button
          variant="danger"
          disabled={!reportReason}
          onClick={onSubmitReport}
        >
          {t('submitReport')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportModal;