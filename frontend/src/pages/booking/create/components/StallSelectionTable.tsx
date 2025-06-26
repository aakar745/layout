import React from 'react';
import { Card, Table, Typography } from 'antd';
import { Stall } from '../../../../services/exhibition';

const { Text } = Typography;

interface StallSelectionTableProps {
  selectedStalls: Stall[];
  calculateBaseAmount: (stall: Stall) => number;
}

const StallSelectionTable: React.FC<StallSelectionTableProps> = ({
  selectedStalls,
  calculateBaseAmount
}) => {
  if (selectedStalls.length === 0) {
    return null;
  }

  const columns = [
    {
      title: 'Stall Number',
      dataIndex: 'number',
      key: 'number',
      width: 120
    },
    {
      title: 'Stall Type',
      key: 'type',
      width: 150,
      render: (_: any, stall: Stall) => 
        stall.stallType?.name || 
        (typeof stall.stallTypeId === 'object' ? stall.stallTypeId?.name : 'Not specified')
    },
    {
      title: 'Dimensions',
      key: 'dimensions',
      width: 120,
      render: (_: any, stall: Stall) => 
        `${stall.dimensions.width}m × ${stall.dimensions.height}m`
    },
    {
      title: 'Area (sqm)',
      key: 'area',
      width: 100,
      render: (_: any, stall: Stall) => 
        (stall.dimensions.width * stall.dimensions.height).toFixed(2)
    },
    {
      title: 'Rate/sq.m',
      dataIndex: 'ratePerSqm',
      key: 'rate',
      width: 120,
      render: (rate: number) => `₹${rate.toLocaleString()}`
    },
    {
      title: 'Base Amount',
      key: 'baseAmount',
      width: 120,
      render: (_: any, stall: Stall) => `₹${calculateBaseAmount(stall).toLocaleString()}`
    }
  ];

  const totalBaseAmount = selectedStalls.reduce(
    (sum, stall) => sum + calculateBaseAmount(stall),
    0
  );

  return (
    <Card 
      title="Selected Stalls Summary" 
      size="small" 
      style={{ marginBottom: 16 }}
    >
      <Table
        dataSource={selectedStalls.map(stall => ({
          ...stall,
          key: stall._id || stall.id
        }))}
        columns={columns}
        pagination={false}
        size="small"
        summary={() => (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} colSpan={5}>
              <Text strong>Total Base Amount</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={1}>
              <Text strong>₹{totalBaseAmount.toLocaleString()}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        )}
      />
    </Card>
  );
};

export default StallSelectionTable; 