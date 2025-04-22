import styled from '@emotion/styled';
import { Card, Button, Typography } from 'antd';

export const StepContent = styled.div`
  padding: 0 20px;
`;

export const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1f1f1f;
  margin-bottom: 8px;
`;

export const PageSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 24px;
`;

export const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  .search-input {
    width: 240px;
    border-radius: 8px;
  }
  
  .filter-select {
    width: 160px;
    border-radius: 8px;
  }
`;

export const StallTabsContainer = styled.div`
  margin-bottom: 24px;
  
  .tab-header {
    display: flex;
    margin-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;
    
    .tab-item {
      padding: 12px 16px;
      font-size: 14px;
      font-weight: 500;
      color: #666;
      cursor: pointer;
      position: relative;
      display: flex;
      align-items: center;
      
      &.active {
        color: #4b47b9;
        
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          right: 0;
          height: 2px;
          background: #4b47b9;
          border-radius: 2px 2px 0 0;
        }
      }
      
      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f0f0f0;
        color: #666;
        font-size: 12px;
        height: 20px;
        min-width: 20px;
        padding: 0 8px;
        border-radius: 10px;
        margin-left: 8px;
        
        &.active {
          background: #4b47b9;
          color: white;
        }
      }
      
      .icon {
        margin-right: 8px;
        
        &.active {
          color: #4b47b9;
        }
      }
    }
  }
`;

export const StallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StallCard = styled.div<{ selected?: boolean }>`
  border: 1px solid ${props => props.selected ? '#4b47b9' : '#e6e6f0'};
  background: ${props => props.selected ? 'rgba(75, 71, 185, 0.05)' : 'white'};
  border-radius: 12px;
  padding: 16px;
  position: relative;
  transition: all 0.2s ease;
  box-shadow: ${props => props.selected ? '0 4px 12px rgba(75, 71, 185, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.04)'};
  cursor: pointer;
  
  &:hover {
    border-color: #4b47b9;
    box-shadow: 0 4px 12px rgba(75, 71, 185, 0.15);
  }
  
  .stall-price {
    position: absolute;
    top: 16px;
    right: 16px;
    background: ${props => props.selected ? '#4b47b9' : '#52c41a'};
    color: white;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 14px;
  }
  
  .stall-number {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 4px;
    color: #1f1f1f;
    display: flex;
    align-items: center;
    
    .hall-label {
      font-size: 13px;
      color: #666;
      margin-left: 8px;
      font-weight: normal;
    }
  }
  
  .stall-details {
    display: flex;
    gap: 12px;
    margin-top: 16px;
    
    .detail-item {
      flex: 1;
      
      .label {
        font-size: 12px;
        color: #666;
        margin-bottom: 4px;
      }
      
      .value {
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
  
  .selection-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    position: absolute;
    top: 12px;
    left: 12px;
    background: ${props => props.selected ? '#4b47b9' : 'white'};
    border: 2px solid ${props => props.selected ? '#4b47b9' : '#d9d9d9'};
    color: white;
    transition: all 0.2s ease;
  }
`;

export const BookingSummaryCard = styled(Card)`
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 24px;
  
  .ant-card-head {
    border-bottom-color: #e6e6f0;
    padding: 0 16px;
    min-height: 48px;
    
    .ant-card-head-title {
      padding: 12px 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .ant-card-body {
    padding: 16px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    
    &:not(:last-child) {
      border-bottom: 1px solid #f0f0f0;
    }
    
    .label {
      color: #666;
    }
    
    .value {
      font-weight: 500;
      text-align: right;
    }
    
    &.discount {
      color: #f5222d;
    }
    
    &.total {
      font-weight: 600;
      font-size: 16px;
      color: #1f1f1f;
      border-top: 1px solid #e6e6f0;
      margin-top: 8px;
      padding-top: 12px;
    }
  }
`;

export const ActionButton = styled(Button)`
  &.ant-btn-primary {
    background: #4b47b9;
    border-color: #4b47b9;
    
    &:hover, &:focus {
      background: #3b37a9;
      border-color: #3b37a9;
    }
  }
  
  &.ant-btn-lg {
    height: 48px;
    padding: 0 24px;
    font-size: 16px;
    border-radius: 8px;
  }
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
`; 