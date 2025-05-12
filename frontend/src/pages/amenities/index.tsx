import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Space, Typography, Row, Col, App, Select, Tag, Tooltip, Input } from 'antd';
import { FileExcelOutlined, DownloadOutlined, SearchOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { fetchExhibitions } from '../../store/slices/exhibitionSlice';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Helper function to export data to Excel
const exportToExcel = (data: any[], fileName: string) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Amenities');
  
  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  saveAs(blob, `${fileName}.xlsx`);
};

const AmenitiesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { message } = App.useApp();
  const { exhibitions, loading } = useSelector((state: RootState) => state.exhibition);
  
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [basicAmenities, setBasicAmenities] = useState<any[]>([]);
  const [extraAmenities, setExtraAmenities] = useState<any[]>([]);
  const [basicSearch, setBasicSearch] = useState<string>('');
  const [extraSearch, setExtraSearch] = useState<string>('');

  useEffect(() => {
    dispatch(fetchExhibitions());
  }, [dispatch]);

  useEffect(() => {
    if (selectedExhibition && exhibitions.length > 0) {
      const exhibition = exhibitions.find(e => e._id === selectedExhibition);
      if (exhibition) {
        // Set basic and extra amenities from the selected exhibition
        setBasicAmenities(exhibition.basicAmenities || []);
        setExtraAmenities(exhibition.amenities || []);
      }
    } else {
      setBasicAmenities([]);
      setExtraAmenities([]);
    }
  }, [selectedExhibition, exhibitions]);

  const handleExhibitionChange = (value: string) => {
    setSelectedExhibition(value);
  };

  // Filter amenities based on search
  const filteredBasicAmenities = basicAmenities.filter(amenity => 
    amenity.name.toLowerCase().includes(basicSearch.toLowerCase()) ||
    amenity.type.toLowerCase().includes(basicSearch.toLowerCase()) ||
    (amenity.description && amenity.description.toLowerCase().includes(basicSearch.toLowerCase()))
  );

  const filteredExtraAmenities = extraAmenities.filter(amenity => 
    amenity.name.toLowerCase().includes(extraSearch.toLowerCase()) ||
    amenity.type.toLowerCase().includes(extraSearch.toLowerCase()) ||
    (amenity.description && amenity.description.toLowerCase().includes(extraSearch.toLowerCase()))
  );

  // Export basic amenities to Excel
  const exportBasicAmenities = () => {
    if (filteredBasicAmenities.length === 0) {
      message.warning('No basic amenities to export');
      return;
    }

    const dataToExport = filteredBasicAmenities.map(amenity => ({
      Name: amenity.name,
      Type: amenity.type,
      Description: amenity.description || '',
      'Per Sq. Meter': amenity.perSqm,
      'Quantity Per Unit': amenity.quantity,
      ID: amenity._id || amenity.id
    }));

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const fileName = `${exhibition?.name || 'Exhibition'}_Basic_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success('Basic amenities exported successfully');
  };

  // Export extra amenities to Excel
  const exportExtraAmenities = () => {
    if (filteredExtraAmenities.length === 0) {
      message.warning('No extra amenities to export');
      return;
    }

    const dataToExport = filteredExtraAmenities.map(amenity => ({
      Name: amenity.name,
      Type: amenity.type,
      Description: amenity.description || '',
      Rate: amenity.rate,
      ID: amenity._id || amenity.id
    }));

    const exhibition = exhibitions.find(e => e._id === selectedExhibition);
    const fileName = `${exhibition?.name || 'Exhibition'}_Extra_Amenities`;
    
    exportToExcel(dataToExport, fileName);
    message.success('Extra amenities exported successfully');
  };

  // Columns for basic amenities table
  const basicAmenitiesColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color="blue">{record.type}</Tag>
        </Space>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-'
    },
    {
      title: 'Allocation Formula',
      key: 'formula',
      render: (_: unknown, record: any) => (
        <Tooltip title={`${record.quantity} unit(s) per ${record.perSqm} sq. meters`}>
          <Space>
            <InfoCircleOutlined />
            <Text>1 {record.quantity > 1 ? `set of ${record.quantity}` : 'unit'} per {record.perSqm} sqm</Text>
          </Space>
        </Tooltip>
      )
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (text: string, record: any) => text || record.id || '-'
    }
  ];

  // Columns for extra amenities table
  const extraAmenitiesColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color="blue">{record.type}</Tag>
        </Space>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text || '-'
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `₹${rate?.toLocaleString('en-IN')}` || '-'
    },
    {
      title: 'ID',
      dataIndex: '_id',
      key: '_id',
      render: (text: string, record: any) => text || record.id || '-'
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Header Section */}
      <div style={{ marginBottom: '24px' }}>
        <Row gutter={[24, 24]} align="middle">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Title level={4} style={{ margin: 0 }}>Amenities Management</Title>
              <Text type="secondary">Manage and export basic and additional amenities data</Text>
            </Space>
          </Col>
        </Row>
      </div>

      {/* Exhibition Selection */}
      <Card style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Title level={5}>Select Exhibition</Title>
          <Select
            placeholder="Select an exhibition"
            style={{ width: '100%' }}
            loading={loading}
            onChange={handleExhibitionChange}
            value={selectedExhibition}
          >
            {exhibitions.map(exhibition => (
              <Option key={exhibition._id} value={exhibition._id}>
                {exhibition.name}
              </Option>
            ))}
          </Select>
        </Space>
      </Card>

      {/* Basic Amenities Section */}
      <Card 
        title="Basic Amenities" 
        style={{ marginBottom: 24 }}
        extra={
          <Button 
            type="primary" 
            icon={<FileExcelOutlined />} 
            onClick={exportBasicAmenities}
            disabled={!selectedExhibition || basicAmenities.length === 0}
          >
            Export to Excel
          </Button>
        }
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Basic amenities are included with stall bookings based on stall area. These amenities are automatically calculated.
        </Paragraph>
        
        <Input 
          placeholder="Search basic amenities" 
          prefix={<SearchOutlined />} 
          style={{ marginBottom: 16, maxWidth: 400 }}
          value={basicSearch}
          onChange={(e) => setBasicSearch(e.target.value)}
          allowClear
        />
        
        <Table 
          dataSource={filteredBasicAmenities.map((item, index) => ({ ...item, key: item._id || item.id || index }))} 
          columns={basicAmenitiesColumns}
          pagination={{ pageSize: 10 }}
          loading={loading}
          size="middle"
          locale={{ emptyText: selectedExhibition ? 'No basic amenities found' : 'Please select an exhibition' }}
        />
      </Card>

      {/* Extra Amenities Section */}
      <Card 
        title="Additional Amenities" 
        style={{ marginBottom: 24 }}
        extra={
          <Button 
            type="primary" 
            icon={<FileExcelOutlined />} 
            onClick={exportExtraAmenities}
            disabled={!selectedExhibition || extraAmenities.length === 0}
          >
            Export to Excel
          </Button>
        }
      >
        <Paragraph type="secondary" style={{ marginBottom: 16 }}>
          Additional amenities are optional extras that exhibitors can select during the booking process.
        </Paragraph>
        
        <Input 
          placeholder="Search additional amenities" 
          prefix={<SearchOutlined />} 
          style={{ marginBottom: 16, maxWidth: 400 }}
          value={extraSearch}
          onChange={(e) => setExtraSearch(e.target.value)}
          allowClear
        />
        
        <Table 
          dataSource={filteredExtraAmenities.map((item, index) => ({ ...item, key: item._id || item.id || index }))} 
          columns={extraAmenitiesColumns}
          pagination={{ pageSize: 10 }}
          loading={loading}
          size="middle"
          locale={{ emptyText: selectedExhibition ? 'No additional amenities found' : 'Please select an exhibition' }}
        />
      </Card>
    </div>
  );
};

export default AmenitiesPage; 