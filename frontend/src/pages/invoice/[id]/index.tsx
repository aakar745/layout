import React, { useState } from 'react';
import { Card, Button, Space, Modal, Form, Input, message, Progress, Spin } from 'antd';
import { DownloadOutlined, MailOutlined, WhatsAppOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import InvoiceTemplate from '../../../components/invoice/InvoiceTemplate';
import { useGetInvoiceQuery } from '../../../store/services/invoice';
import { useParams } from 'react-router-dom';
import api, { downloadFile } from '../../../services/api';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: invoice, isLoading } = useGetInvoiceQuery(id || '');
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [whatsappModalVisible, setWhatsappModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  const handleDownload = async () => {
    if (!id) return;
    
    try {
      setIsDownloading(true);
      setDownloadProgress(0);
      message.loading({ content: 'Preparing invoice...', key: 'download' });
      
      const response = await downloadFile(
        `/invoices/${id}/download?force=false`,
        false,
        (progressEvent) => {
          const total = progressEvent.total;
          const loaded = progressEvent.loaded;
          
          if (total) {
            // Calculate and update progress percentage
            const percentage = Math.round((loaded * 100) / total);
            setDownloadProgress(percentage);
            
            // Update message when progress changes significantly
            if (percentage % 25 === 0) {
              message.loading({ 
                content: `Downloading: ${percentage}% complete`, 
                key: 'download'
              });
            }
          }
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      message.success({ content: 'Invoice downloaded successfully', key: 'download' });
    } catch (error) {
      console.error('Download error:', error);
      message.error({ content: 'Failed to download invoice', key: 'download' });
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
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
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                disabled={isDownloading}
              >
                Back
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
                loading={isDownloading && downloadProgress < 100}
                disabled={isDownloading && downloadProgress >= 100}
              >
                Download
              </Button>
              <Button
                icon={<MailOutlined />}
                onClick={() => setEmailModalVisible(true)}
                disabled={isDownloading}
              >
                Share via Email
              </Button>
              <Button
                icon={<WhatsAppOutlined />}
                onClick={() => setWhatsappModalVisible(true)}
                disabled={isDownloading}
              >
                Share via WhatsApp
              </Button>
            </Space>
            {isDownloading && (
              <Progress 
                percent={downloadProgress} 
                size="small" 
                status="active" 
                style={{ marginBottom: 0, marginTop: 4 }}
              />
            )}
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
            companyAddress: invoice.bookingId.exhibitionId.companyAddress || '',
            headerLogo: invoice.bookingId.exhibitionId.headerLogo || undefined, // Pass headerLogo if available
          },
          calculations: {
            ...invoice.bookingId.calculations,
            stalls: invoice.bookingId.calculations.stalls.map(stall => ({
              discount: stall.discount ? { 
                ...stall.discount,
                // Preserve all discount properties including type and value
                type: stall.discount.type || 'percentage',
                value: stall.discount.value
              } : undefined
            }))
          }
        }} />
      </Card>

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