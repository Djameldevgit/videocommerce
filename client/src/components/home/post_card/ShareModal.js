import React, { useState } from 'react';
import { Modal, Form, Alert, Button } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

// React Share imports
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon
} from 'react-share';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

 
const ShareModal = ({ 
  show, 
  onHide, 
  post, 
  shareUrl, 
  shareTitle, 
  imageUrl 
}) => {
  const [copied, setCopied] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation('cardbodycarousel');

  const handleCopy = (message) => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: message }
    });
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>🎨 {t('shareArt')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {copied && (
          <Alert variant="success" className="py-2" dismissible onClose={() => setCopied(false)}>
            ✅ {t('linkCopied')}
          </Alert>
        )}

        <h6 className="mb-3">{t('shareOnSocial')}</h6>
        <div className="d-flex justify-content-around flex-wrap mb-4">
          <FacebookShareButton url={shareUrl} quote={shareTitle} className="mx-2 my-2">
            <FacebookIcon size={45} round />
            <div className="small mt-1 text-center">{t('facebook')}</div>
          </FacebookShareButton>

          <TwitterShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
            <TwitterIcon size={45} round />
            <div className="small mt-1 text-center">{t('twitter')}</div>
          </TwitterShareButton>

          <WhatsappShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
            <WhatsappIcon size={45} round />
            <div className="small mt-1 text-center">{t('whatsapp')}</div>
          </WhatsappShareButton>

          {imageUrl && (
            <PinterestShareButton
              url={shareUrl}
              media={imageUrl}
              description={shareTitle}
              className="mx-2 my-2"
            >
              <PinterestIcon size={45} round />
              <div className="small mt-1 text-center">{t('pinterest')}</div>
            </PinterestShareButton>
          )}

          <TelegramShareButton url={shareUrl} title={shareTitle} className="mx-2 my-2">
            <TelegramIcon size={45} round />
            <div className="small mt-1 text-center">{t('telegram')}</div>
          </TelegramShareButton>

          <EmailShareButton url={shareUrl} subject={t('artwork')} body={shareTitle} className="mx-2 my-2">
            <EmailIcon size={45} round />
            <div className="small mt-1 text-center">{t('email')}</div>
          </EmailShareButton>
        </div>

        <h6 className="mb-3">{t('manualShare')}</h6>
        <Form.Group className="mb-3">
          <Form.Label>{t('shareText')}</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={shareTitle}
            readOnly
            className="mb-2"
          />
          <CopyToClipboard
            text={shareTitle}
            onCopy={() => handleCopy(t('textCopied'))}
          >
            <Button variant="outline-primary" size="sm">
              📋 {t('copyText')}
            </Button>
          </CopyToClipboard>
        </Form.Group>

        <Form.Group>
          <Form.Label>{t('postLink')}</Form.Label>
          <div className="input-group">
            <Form.Control
              type="text"
              value={shareUrl}
              readOnly
            />
            <CopyToClipboard
              text={shareUrl}
              onCopy={() => handleCopy(t('linkCopied'))}
            >
              <Button variant="outline-secondary" type="button">
                📋 {t('copyLink')}
              </Button>
            </CopyToClipboard>
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          {t('close')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ShareModal;