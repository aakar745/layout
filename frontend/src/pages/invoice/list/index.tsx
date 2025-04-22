import React, { useState } from 'react';
import { Table, Tag, Space, Button, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useGetInvoicesQuery } from '../../../store/services/invoice';

const InvoiceList: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data: invoiceData, isLoading } = useGetInvoicesQuery({ page, limit: pageSize });

  const columns = [
    {
      title: 'Invoice ID',
      dataIndex: '_id',
      key: 'id',
      render: (id: string) => <a onClick={() => navigate(`/invoice/${id}`)}>{id}</a>,
    },
    {
      title: 'Booking ID',
      dataIndex: 'bookingId',
      key: 'bookingId',
      render: (bookingId: any) => (
        <a onClick={() => navigate(`/booking/${bookingId._id}`)}>{bookingId._id}</a>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `₹${amount.toLocaleString('en-IN')}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'paid' ? 'green' :
          status === 'pending' ? 'gold' :
          status === 'cancelled' ? 'red' :
          'blue'
        }>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => navigate(`/invoice/${record._id}`)}>
            View Invoice
          </Button>
          <Button onClick={() => navigate(`/invoice/${record._id}/download`)}>
            Download
          </Button>
        </Space>
      ),
    },
  ];

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  return (
    <div className="invoice-list-container">
      <h1>Invoices</h1>
      <Table
        columns={columns}
        dataSource={invoiceData?.data || []}
        rowKey="_id"
        loading={isLoading}
        pagination={false}
      />
      {invoiceData?.pagination && (
        <div className="pagination-container">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={invoiceData.pagination.total}
            onChange={handlePageChange}
            showSizeChanger
            showTotal={(total) => `Total ${total} invoices`}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceList; 