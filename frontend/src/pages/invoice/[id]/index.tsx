import React, { useState } from 'react';
import { Card, Button, Space, Modal, Form, Input, message } from 'antd';
import { DownloadOutlined, MailOutlined, WhatsAppOutlined, ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import InvoiceTemplate from '../../../components/invoice/InvoiceTemplate';
import { useGetInvoiceQuery } from '../../../store/services/invoice';
import { useParams } from 'react-router-dom';
import api, { downloadFile } from '../../../services/api';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading } = useGetInvoiceQuery(id || '');
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [form] = Form.useForm();

  const handlePreview = async () => {
    try {
      const response = await downloadFile(`/invoices/${id}/download?force=true`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setPdfUrl(url);
      setPdfModalVisible(true);
    } catch (error) {
      console.error('Preview error:', error);
      message.error('Failed to preview invoice');
    }
  };

  const handleDownload = async () => {
    try {
      const response = await downloadFile(`/invoices/${id}/download?force=true`);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
      message.error('Failed to download invoice');
    }
  };

  const handleEmailShare = async (values: { email: string; message?: string }) => {
    try {
      await api.post(`/invoices/${id}/share/email`, values);
      message.success('Invoice shared via email successfully');
      setEmailModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('Email sharing error:', error);
      message.error('Failed to share invoice via email');
    }
  };

  const handleWhatsAppShare = async (values: { phoneNumber: string }) => {
    try {
      await api.post(`/invoices/${id}/share/whatsapp`, values);
      message.success('Invoice shared via WhatsApp successfully');
      setWhatsappModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error('WhatsApp sharing error:', error);
      message.error('Failed to share invoice via WhatsApp');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (isLoading || !invoice) {
    return <div>Loading...</div>;
  }
  
  // Debug logs to investigate invoice number
  console.log('Invoice data:', invoice);
  
  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Invoice Details"
        extra={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownload}
            >
              Download
            </Button>
            <Button
              icon={<MailOutlined />}
              onClick={() => setEmailModalVisible(true)}
            >
              Share via Email
            </Button>
            <Button
              icon={<WhatsAppOutlined />}
              onClick={() => setWhatsappModalVisible(true)}
            >
              Share via WhatsApp
            </Button>
          </Space>
        }
      >
        <InvoiceTemplate booking={{
          ...invoice.bookingId,
          customerGSTIN: invoice.bookingId.customerGSTIN || '',
          invoiceNumber: invoice.invoiceNumber, // Use the stored invoice number from the API
          exhibitionId: {
            ...invoice.bookingId.exhibitionId,
            companyName: invoice.bookingId.exhibitionId.companyName || 'Company Name',
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
          },
          calculations: {
            ...invoice.bookingId.calculations,
            stalls: invoice.bookingId.calculations.stalls.map(stall => ({
              discount: stall.discount ? { value: stall.discount.value } : undefined
            }))
          }
        }} />
      </Card>

      <Modal
        title="Preview Invoice"
        open={pdfModalVisible}
        onCancel={() => {
          setPdfModalVisible(false);
          if (pdfUrl) {
            window.URL.revokeObjectURL(pdfUrl);
            setPdfUrl(null);
          }
        }}
        width={1000}
        footer={null}
      >
        {pdfUrl && (
          <div style={{ height: '80vh', overflow: 'auto' }}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div>Loading PDF...</div>}
            >
              {Array.from(new Array(numPages || 0), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={900}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </div>
        )}
      </Modal>

      <Modal
        title="Share Invoice via Email"
        open={emailModalVisible}
        onCancel={() => setEmailModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEmailShare} layout="vertical">
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email address' }
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>
          <Form.Item name="message" label="Message (Optional)">
            <Input.TextArea placeholder="Enter optional message" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Share Invoice via WhatsApp"
        open={whatsappModalVisible}
        onCancel={() => setWhatsappModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleWhatsAppShare} layout="vertical">
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: 'Please enter phone number' },
              { pattern: /^\+?[1-9]\d{9,14}$/, message: 'Please enter a valid phone number' }
            ]}
          >
            <Input placeholder="Enter phone number with country code" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InvoiceDetails; 