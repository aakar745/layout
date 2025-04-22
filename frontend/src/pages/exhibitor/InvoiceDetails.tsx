import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  Row, 
  Col, 
  Button, 
  Divider, 
  Space, 
  Spin, 
  Modal, 
  Form, 
  Input,
  Typography,
  message
} from 'antd';
import { 
  FilePdfOutlined, 
  DownloadOutlined, 
  MailOutlined, 
  WhatsAppOutlined 
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  useGetExhibitorInvoiceQuery,
  useDownloadExhibitorInvoiceMutation,
  useShareViaEmailMutation,
  useShareViaWhatsAppMutation
} from '../../store/services/exhibitorInvoice';
import InvoiceTemplate from '../../components/invoice/InvoiceTemplate';
import type { BookingExtended } from '../../components/invoice/InvoiceTemplate';
import type { Booking, Invoice } from '../../types/booking';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const { Title, Text } = Typography;

const ExhibitorInvoiceDetails: React.FC = () => {
  const { id: bookingId } = useParams<{ id: string }>();
  const { data: invoice, isLoading, error } = useGetExhibitorInvoiceQuery(bookingId || '');
  const [downloadInvoice] = useDownloadExhibitorInvoiceMutation();
  const [shareViaEmail] = useShareViaEmailMutation();
  const [shareViaWhatsApp] = useShareViaWhatsAppMutation();
  
  const [previewVisible, setPreviewVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [emailForm] = Form.useForm();
  const [whatsappForm] = Form.useForm();
  const [pdfDocument, setPdfDocument] = useState<string | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
    setPageNumber(1);
  }

  const handlePreview = async () => {
    try {
      const response = await downloadInvoice(bookingId || '').unwrap();
      const url = URL.createObjectURL(response);
      setPdfDocument(url);
      setPreviewVisible(true);
    } catch (error) {
      console.error('Error generating PDF preview:', error);
      message.error('Failed to generate PDF preview');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadInvoice(bookingId || '').unwrap();
      const url = URL.createObjectURL(response);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${invoice?.invoiceNumber || bookingId || 'download'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      message.error('Failed to download PDF');
    }
  };

  const handleEmailShare = () => {
    setEmailModalVisible(true);
  };

  const handleWhatsAppShare = () => {
    setWhatsappModalVisible(true);
  };

  const sendEmail = async (values: { email: string; message: string }) => {
    try {
      await shareViaEmail({
        bookingId: bookingId || '',
        email: values.email,
        message: values.message
      }).unwrap();
      
      message.success(`Invoice sent to ${values.email}`);
      setEmailModalVisible(false);
      emailForm.resetFields();
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Failed to send email');
    }
  };

  const sendWhatsApp = async (values: { phoneNumber: string; message: string }) => {
    try {
      await shareViaWhatsApp({
        bookingId: bookingId || '',
        phoneNumber: values.phoneNumber
      }).unwrap();
      
      const phone = values.phoneNumber.replace(/\D/g, '');
      const text = encodeURIComponent(values.message);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
      setWhatsappModalVisible(false);
      whatsappForm.resetFields();
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      message.error('Failed to open WhatsApp');
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <Title level={3}>Invoice Not Found</Title>
        <Text>The requested invoice could not be loaded. Please try again later.</Text>
      </div>
    );
  }

  return (
    <>
      <Card title="Invoice Details" style={{ margin: '20px' }}>
        <Row gutter={[16, 24]}>
          <Col span={24}>
            <Space>
              <Button 
                type="primary" 
                icon={<FilePdfOutlined />} 
                onClick={handlePreview}
              >
                Preview Invoice
              </Button>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={handleDownload}
              >
                Download PDF
              </Button>
              <Button 
                icon={<MailOutlined />} 
                onClick={handleEmailShare}
              >
                Share via Email
              </Button>
              <Button 
                icon={<WhatsAppOutlined />} 
                onClick={handleWhatsAppShare}
              >
                Share via WhatsApp
              </Button>
            </Space>
          </Col>
        </Row>

        <Divider />

        <InvoiceTemplate booking={{
          ...invoice.bookingId,
          customerGSTIN: invoice.bookingId.exhibitionId.companyGST || '',
          invoiceNumber: invoice.invoiceNumber,
          exhibitionId: {
            ...invoice.bookingId.exhibitionId,
            companyName: invoice.bookingId.exhibitionId.companyName || '',
            bankName: invoice.bookingId.exhibitionId.bankName || '',
            bankAccount: invoice.bookingId.exhibitionId.bankAccount || '',
            bankAccountName: invoice.bookingId.exhibitionId.bankAccountName || '',
            bankBranch: invoice.bookingId.exhibitionId.bankBranch || '',
            bankIFSC: invoice.bookingId.exhibitionId.bankIFSC || '',
            companyCIN: invoice.bookingId.exhibitionId.companyCIN || '',
            companyPAN: invoice.bookingId.exhibitionId.companyPAN || '',
            companySAC: invoice.bookingId.exhibitionId.companySAC || '',
            companyGST: invoice.bookingId.exhibitionId.companyGST || '',
            companyEmail: invoice.bookingId.exhibitionId.companyEmail || '',
            companyWebsite: invoice.bookingId.exhibitionId.companyWebsite || '',
            companyAddress: invoice.bookingId.exhibitionId.companyAddress || ''
          }
        } as BookingExtended} />
      </Card>

      {/* PDF Preview Modal */}
      <Modal
        title="Invoice Preview"
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
      >
        {pdfDocument && (
          <Document
            file={pdfDocument}
            onLoadSuccess={onDocumentLoadSuccess}
            options={{ cMapUrl: 'cmaps/', cMapPacked: true }}
          >
            <Page pageNumber={pageNumber} width={750} />
          </Document>
        )}
        {numPages && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <Text>Page {pageNumber} of {numPages}</Text>
          </div>
        )}
      </Modal>

      {/* Email Modal */}
      <Modal
        title="Share Invoice via Email"
        visible={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        footer={null}
      >
        <Form
          form={emailForm}
          layout="vertical"
          onFinish={sendEmail}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter an email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="example@example.com" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            initialValue={`Please find attached the invoice for your booking with invoice number ${invoice.invoiceNumber}.`}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* WhatsApp Modal */}
      <Modal
        title="Share Invoice via WhatsApp"
        visible={whatsappModalVisible}
        onCancel={() => setWhatsappModalVisible(false)}
        footer={null}
      >
        <Form
          form={whatsappForm}
          layout="vertical"
          onFinish={sendWhatsApp}
        >
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter a phone number' }
            ]}
          >
            <Input placeholder="+1234567890" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            initialValue={`Please find the invoice for your booking with invoice number ${invoice.invoiceNumber}.`}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Open WhatsApp
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExhibitorInvoiceDetails; 