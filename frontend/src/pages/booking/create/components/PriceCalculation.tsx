import React from 'react';
import { Card, Row, Col, Select, Space, Typography, Divider } from 'antd';
import { Exhibition } from '../../../../services/exhibition';

const { Text } = Typography;

interface Tax {
  name: string;
  rate: number;
  amount: number;
}

interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  isActive: boolean;
}

interface AmountCalculation {
  baseAmount: number;
  selectedDiscount?: Discount;
  discountAmount: number;
  amountAfterDiscount: number;
  taxes: Tax[];
  totalTaxAmount: number;
  totalAmount: number;
}

interface PriceCalculationProps {
  selectedExhibition: Exhibition | null;
  selectedDiscountId: string | undefined;
  onDiscountChange: (discountId: string | undefined) => void;
  calculateAmounts: () => AmountCalculation;
}

const PriceCalculation: React.FC<PriceCalculationProps> = ({
  selectedExhibition,
  selectedDiscountId,
  onDiscountChange,
  calculateAmounts
}) => {
  const amounts = calculateAmounts();

  return (
    <Card title="Price Calculations" size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Select
            placeholder="Select discount"
            allowClear
            style={{ width: '100%' }}
            value={selectedDiscountId}
            onChange={onDiscountChange}
            options={selectedExhibition?.discountConfig
              ?.map(d => ({
                label: `${d.name} (${d.type === 'percentage' ? d.value + '%' : '₹' + d.value})${!d.isActive ? ' - Inactive' : ''}`,
                value: `${d.name}-${d.value}-${d.type}`,
                disabled: !d.isActive
              }))}
          />
        </Col>
        <Col span={12}>
          <div style={{ textAlign: 'right' }}>
            <Text type="secondary">Discount Available</Text>
          </div>
        </Col>
      </Row>

      <div style={{ 
        background: '#fafafa',
        padding: '16px',
        borderRadius: '8px',
        marginTop: '16px'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {/* Base Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Total Base Amount:</Text>
            <Text strong>₹{amounts.baseAmount.toLocaleString()}</Text>
          </div>

          {/* Discount */}
          {amounts.selectedDiscount && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>
                Discount ({amounts.selectedDiscount.type === 'percentage' 
                  ? `${amounts.selectedDiscount.value}%` 
                  : `₹${amounts.selectedDiscount.value.toLocaleString()}`
                }):
              </Text>
              <Text type="danger">-₹{amounts.discountAmount.toLocaleString()}</Text>
            </div>
          )}

          {/* Amount after Discount */}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text>Amount after Discount:</Text>
            <Text>₹{amounts.amountAfterDiscount.toLocaleString()}</Text>
          </div>

          {/* Divider for Taxes */}
          <Divider style={{ margin: '8px 0' }} />

          {/* Taxes */}
          {amounts.taxes.map(tax => (
            <div key={`tax-${tax.name}`} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text>{tax.name} ({tax.rate}%):</Text>
              <Text>₹{tax.amount.toLocaleString()}</Text>
            </div>
          ))}

          {/* Total Amount */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
            <Text strong>Total Amount (incl. Taxes):</Text>
            <Text strong style={{ color: '#1890ff', fontSize: '16px' }}>
              ₹{amounts.totalAmount.toLocaleString()}
            </Text>
          </div>
        </Space>
      </div>
    </Card>
  );
};

export default PriceCalculation; 